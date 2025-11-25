"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import {
  adminBackend,
  type AdminRedisEntry,
  type AdminSessionSummary,
  type AdminQdrantCollection,
  type AdminQdrantPoint,
} from "@/services/admin-backend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdminMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export default function AdminPage() {
  const [sessions, setSessions] = useState<AdminSessionSummary[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [sessionMessages, setSessionMessages] = useState<AdminMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sessionFilter, setSessionFilter] = useState<string>("");

  const [redisEntries, setRedisEntries] = useState<AdminRedisEntry[]>([]);
  const [redisLoading, setRedisLoading] = useState(false);

  const [collections, setCollections] = useState<AdminQdrantCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [collectionPoints, setCollectionPoints] = useState<AdminQdrantPoint[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(false);

  const filteredSessions = useMemo(() => {
    if (!sessionFilter) return sessions;
    const normalized = sessionFilter.toLowerCase();
    return sessions.filter((session) =>
      [session.id, session.user_id, session.title]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalized)),
    );
  }, [sessions, sessionFilter]);

  useEffect(() => {
    refreshSessions();
    refreshRedis();
    refreshCollections();
  }, []);

  async function refreshSessions() {
    try {
      setSessionsLoading(true);
      const data = await adminBackend.listSessions(200);
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions", error);
    } finally {
      setSessionsLoading(false);
    }
  }

  async function loadSessionMessages(sessionId: string) {
    try {
      setMessagesLoading(true);
      const data = await adminBackend.getSessionMessages(sessionId);
      setSessionMessages(data as AdminMessage[]);
      setSelectedSessionId(sessionId);
    } catch (error) {
      console.error("Failed to load session messages", error);
    } finally {
      setMessagesLoading(false);
    }
  }

  async function refreshRedis(sessionId?: string) {
    try {
      setRedisLoading(true);
      const data = await adminBackend.listRedisCache(sessionId);
      setRedisEntries(data.entries);
    } catch (error) {
      console.error("Failed to load redis cache", error);
    } finally {
      setRedisLoading(false);
    }
  }

  async function flushRedis(sessionId: string) {
    try {
      await adminBackend.deleteRedisCache(sessionId);
      await refreshRedis();
    } catch (error) {
      console.error("Failed to flush redis cache", error);
    }
  }

  async function refreshCollections() {
    try {
      const data = await adminBackend.listCollections();
      setCollections(data);
    } catch (error) {
      console.error("Failed to load collections", error);
    }
  }

  async function loadCollectionPoints(collectionName: string) {
    try {
      setCollectionLoading(true);
      const data = await adminBackend.listCollectionPoints(collectionName, 20);
      setSelectedCollection(collectionName);
      setCollectionPoints(data);
    } catch (error) {
      console.error("Failed to load collection points", error);
    } finally {
      setCollectionLoading(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Chat Sessions</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshSessions()}
              disabled={sessionsLoading}
            >
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Filter by session ID, user or title"
              value={sessionFilter}
              onChange={(event) => setSessionFilter(event.target.value)}
              className="mb-3"
            />
            <ScrollArea className="h-80 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow
                      key={session.id}
                      className={selectedSessionId === session.id ? "bg-muted" : undefined}
                    >
                      <TableCell className="font-mono text-xs">{session.id}</TableCell>
                      <TableCell>{session.user_id ?? "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{session.message_count}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => loadSessionMessages(session.id)}
                          disabled={messagesLoading && selectedSessionId === session.id}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Session Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSessionId ? (
              messagesLoading ? (
                <p>Loading messages…</p>
              ) : sessionMessages.length ? (
                <ScrollArea className="h-80 border rounded-md p-2 space-y-4">
                  {sessionMessages.map((message) => (
                    <div key={message.id} className="rounded-md border p-3">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="uppercase font-semibold">{message.role}</span>
                        <span>{new Date(message.created_at).toLocaleString()}</span>
                      </div>
                      <Textarea value={message.content} readOnly className="mt-2" rows={3} />
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p>No messages found for this session.</p>
              )
            ) : (
              <p>Select a session to inspect messages.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Redis Cache</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshRedis()}
              disabled={redisLoading}
            >
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Session</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>TTL</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redisEntries.map((entry) => (
                    <TableRow key={entry.key}>
                      <TableCell className="font-mono text-xs">{entry.session_id}</TableCell>
                      <TableCell>{entry.message_count}</TableCell>
                      <TableCell>{entry.ttl_seconds ?? "∞"}</TableCell>
                      <TableCell>{(entry.size_bytes / 1024).toFixed(1)} KB</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="destructive" onClick={() => flushRedis(entry.session_id)}>
                          Clear
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!redisEntries.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No cache entries found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Qdrant Collections</CardTitle>
            <Button variant="outline" size="sm" onClick={() => refreshCollections()}>
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {collections.map((collection) => (
                  <Button
                    key={collection.name}
                    size="sm"
                    variant={selectedCollection === collection.name ? "default" : "outline"}
                    onClick={() => loadCollectionPoints(collection.name)}
                  >
                    {collection.name} ({collection.vectors_count})
                  </Button>
                ))}
              </div>
              <div>
                {selectedCollection ? (
                  collectionLoading ? (
                    <p>Loading points…</p>
                  ) : collectionPoints.length ? (
                    <ScrollArea className="h-64 border rounded-md p-2 space-y-3">
                      {collectionPoints.map((point) => (
                        <div key={point.id} className="rounded-md border p-3 text-sm">
                          <div className="font-mono text-xs mb-2">ID: {point.id}</div>
                          <pre className="whitespace-pre-wrap text-xs">
                            {JSON.stringify(point.payload ?? {}, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <p>No points found.</p>
                  )
                ) : (
                  <p>Select a collection to inspect payloads.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
