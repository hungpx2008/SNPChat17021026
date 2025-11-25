import path from 'path';
import dotenvFlow from 'dotenv-flow';
import { Pool } from 'pg';
import { QdrantClient } from '@qdrant/js-client-rest';
import Redis from 'ioredis';
import {
  configApi,
  createSpace,
  createBase,
  createTable,
  createRecords,
} from '@teable/openapi';
import type { IFieldRo } from '@teable/core';
import { FieldType } from '@teable/core';

dotenvFlow.config({ path: path.resolve(__dirname, '..') });

const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

const CHATSNP_DB_URL = requiredEnv('CHATSNP_DB_URL');
const QDRANT_URL = process.env.QDRANT_URL ?? 'http://127.0.0.1:6333';
const REDIS_URL = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379/0';
const TEABLE_ENDPOINT = process.env.TEABLE_ENDPOINT ?? 'http://127.0.0.1:3000';
const TEABLE_TOKEN = requiredEnv('TEABLE_TOKEN');
const TEABLE_SPACE_ID = process.env.TEABLE_SPACE_ID;
const TEABLE_BASE_ID = process.env.TEABLE_BASE_ID;
const BATCH_SIZE = Number(process.env.TEABLE_SYNC_BATCH_SIZE ?? 100);

configApi({ endpoint: TEABLE_ENDPOINT, token: TEABLE_TOKEN });

const pgPool = new Pool({ connectionString: CHATSNP_DB_URL });
const qdrant = new QdrantClient({ url: QDRANT_URL });
const redis = new Redis(REDIS_URL);

const toIsoString = (value: unknown) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

const chunk = <T>(items: T[], size: number): T[][] => {
  if (items.length <= size) return [items];
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

async function ensureSpace(): Promise<string> {
  if (TEABLE_SPACE_ID) {
    return TEABLE_SPACE_ID;
  }
  const { data } = await createSpace({ name: 'ChatSNP Mirror' });
  return data.id;
}

async function ensureBase(spaceId: string): Promise<string> {
  if (TEABLE_BASE_ID) {
    return TEABLE_BASE_ID;
  }
  const { data } = await createBase({ spaceId, name: 'ChatSNP Data' });
  return data.id;
}

type TableDefinition = {
  name: string;
  fields: IFieldRo[];
};

async function createTableIfNeeded(baseId: string, table: TableDefinition): Promise<string> {
  const { data } = await createTable(baseId, {
    name: table.name,
    fieldKeyType: 'name',
    fields: table.fields,
    views: [],
    records: [],
  });
  return data.id;
}

async function insertRecords(tableId: string, records: Record<string, unknown>[]) {
  if (!records.length) return;
  for (const group of chunk(records, BATCH_SIZE)) {
    await createRecords(tableId, {
      fieldKeyType: 'name',
      records: group.map((fields) => ({ fields })),
    });
  }
}

async function syncSessions(tableId: string) {
  const { rows } = await pgPool.query<{
    id: string;
    user_id: string | null;
    department: string | null;
    title: string | null;
    created_at: Date | null;
    updated_at: Date | null;
    message_count: number;
  }>(
    `
      SELECT s.id,
             s.user_id,
             s.department,
             s.title,
             s.created_at,
             s.updated_at,
             COUNT(m.id)::int AS message_count
      FROM chat_sessions s
      LEFT JOIN chat_messages m ON s.id = m.session_id
      GROUP BY s.id
      ORDER BY s.created_at ASC
    `,
  );

  await insertRecords(
    tableId,
    rows.map((row) => ({
      session_id: row.id,
      user_id: row.user_id ?? '',
      department: row.department ?? '',
      title: row.title ?? '',
      created_at: toIsoString(row.created_at),
      updated_at: toIsoString(row.updated_at),
      message_count: row.message_count ?? 0,
    })),
  );
}

async function syncMessages(tableId: string) {
  const { rows } = await pgPool.query<{
    id: string;
    session_id: string;
    role: string;
    content: string;
    metadata: unknown;
    created_at: Date | null;
  }>(
    `
      SELECT id,
             session_id,
             role,
             content,
             metadata,
             created_at
      FROM chat_messages
      ORDER BY created_at ASC
    `,
  );

  await insertRecords(
    tableId,
    rows.map((row) => ({
      message_id: row.id,
      session_id: row.session_id,
      role: row.role,
      content: row.content,
      metadata: JSON.stringify(row.metadata ?? {}),
      created_at: toIsoString(row.created_at),
    })),
  );
}

async function syncChunks(tableId: string) {
  const { rows } = await pgPool.query<{
    id: string;
    message_id: string;
    chunk_index: number;
    content: string;
    vector_id: string | null;
    metadata: unknown;
    created_at: Date | null;
  }>(
    `
      SELECT id,
             message_id,
             chunk_index,
             content,
             vector_id,
             metadata,
             created_at
      FROM chat_message_chunks
      ORDER BY created_at ASC
    `,
  );

  await insertRecords(
    tableId,
    rows.map((row) => ({
      chunk_id: row.id,
      message_id: row.message_id,
      chunk_index: row.chunk_index ?? 0,
      content: row.content,
      vector_id: row.vector_id ?? '',
      metadata: JSON.stringify(row.metadata ?? {}),
      created_at: toIsoString(row.created_at),
    })),
  );
}

async function syncVectors(tableId: string) {
  for (const collection of ['chat_chunks', 'long_term_memory']) {
    let offset: string | undefined;
    do {
      try {
        const { points, next_page_offset } = await qdrant.scroll(collection, {
          with_payload: true,
          with_vectors: true,
          limit: BATCH_SIZE,
          offset,
        });
        if (points?.length) {
          await insertRecords(
            tableId,
            points.map((point) => ({
              collection,
              point_id: String(point.id),
              session_id: point.payload?.session_id ?? '',
              message_id: point.payload?.message_id ?? '',
              payload: JSON.stringify(point.payload ?? {}),
              vector: JSON.stringify(point.vector ?? []),
            })),
          );
        }
        offset = next_page_offset ?? undefined;
      } catch (err) {
        // Qdrant returns 404 when collection does not exist; skip gracefully.
        if ((err as { status?: number })?.status === 404) {
          console.warn(`Qdrant collection '${collection}' not found, skipping vector sync.`);
          break;
        }
        throw err;
      }
    } while (offset);
  }
}

async function syncRedis(tableId: string) {
  const stream = redis.scanStream({ match: 'chat:session:*', count: 100 });
  const buffer: Record<string, unknown>[] = [];

  for await (const keys of stream) {
    for (const key of keys as string[]) {
      const raw = await redis.get(key);
      const ttl = await redis.ttl(key);
      const parsed = raw ? JSON.parse(raw) : [];
      buffer.push({
        key,
        session_id: key.split(':').pop() ?? '',
        ttl: ttl ?? -1,
        message_count: Array.isArray(parsed) ? parsed.length : 0,
        size_bytes: raw ? Buffer.byteLength(raw, 'utf8') : 0,
        payload: raw ?? '',
      });
    }
  }

  await insertRecords(tableId, buffer);
}

async function run() {
  const spaceId = await ensureSpace();
  const baseId = await ensureBase(spaceId);

  const sessionsTableId = await createTableIfNeeded(baseId, {
    name: 'Chat Sessions',
    fields: [
      { name: 'session_id', type: FieldType.SingleLineText, isPrimary: true },
      { name: 'user_id', type: FieldType.SingleLineText },
      { name: 'department', type: FieldType.SingleLineText },
      { name: 'title', type: FieldType.SingleLineText },
      { name: 'created_at', type: FieldType.Date },
      { name: 'updated_at', type: FieldType.Date },
      { name: 'message_count', type: FieldType.Number },
    ],
  });

  const messagesTableId = await createTableIfNeeded(baseId, {
    name: 'Chat Messages',
    fields: [
      { name: 'message_id', type: FieldType.SingleLineText, isPrimary: true },
      { name: 'session_id', type: FieldType.SingleLineText },
      { name: 'role', type: FieldType.SingleLineText },
      { name: 'content', type: FieldType.LongText },
      { name: 'metadata', type: FieldType.LongText },
      { name: 'created_at', type: FieldType.Date },
    ],
  });

  const chunksTableId = await createTableIfNeeded(baseId, {
    name: 'Message Chunks',
    fields: [
      { name: 'chunk_id', type: FieldType.SingleLineText, isPrimary: true },
      { name: 'message_id', type: FieldType.SingleLineText },
      { name: 'chunk_index', type: FieldType.Number },
      { name: 'content', type: FieldType.LongText },
      { name: 'vector_id', type: FieldType.SingleLineText },
      { name: 'metadata', type: FieldType.LongText },
      { name: 'created_at', type: FieldType.Date },
    ],
  });

  const vectorsTableId = await createTableIfNeeded(baseId, {
    name: 'Vector Store',
    fields: [
      { name: 'collection', type: FieldType.SingleLineText },
      { name: 'point_id', type: FieldType.SingleLineText },
      { name: 'session_id', type: FieldType.SingleLineText },
      { name: 'message_id', type: FieldType.SingleLineText },
      { name: 'payload', type: FieldType.LongText },
      { name: 'vector', type: FieldType.LongText },
    ],
  });

  const redisTableId = await createTableIfNeeded(baseId, {
    name: 'Redis Cache',
    fields: [
      { name: 'key', type: FieldType.SingleLineText, isPrimary: true },
      { name: 'session_id', type: FieldType.SingleLineText },
      { name: 'ttl', type: FieldType.Number },
      { name: 'message_count', type: FieldType.Number },
      { name: 'size_bytes', type: FieldType.Number },
      { name: 'payload', type: FieldType.LongText },
    ],
  });

  console.log('Syncing chat_sessions …');
  await syncSessions(sessionsTableId);
  console.log('Syncing chat_messages …');
  await syncMessages(messagesTableId);
  console.log('Syncing chat_message_chunks …');
  await syncChunks(chunksTableId);
  console.log('Syncing Qdrant vectors …');
  await syncVectors(vectorsTableId);
  console.log('Syncing Redis cache …');
  await syncRedis(redisTableId);
  console.log('Sync completed successfully.');
}

run()
  .catch((error) => {
    console.error('Sync failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pgPool.end().catch(() => undefined);
    await redis.quit().catch(() => undefined);
  });
