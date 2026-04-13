-- Phase 6: Parent-Child Chunking — Create chunk_parents table
-- This table stores full-context parent chunks in PostgreSQL.
-- Child chunks (smaller, search-optimized) live in Qdrant with parent_id payloads.

CREATE TABLE IF NOT EXISTS chunk_parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    page_number INTEGER DEFAULT 0,
    headings JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_chunk_parents_document_id ON chunk_parents (document_id);
