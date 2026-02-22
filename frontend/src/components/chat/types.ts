import type { ReactNode } from "react";
import type { Attachment } from "@/services/chat-backend";

export interface Message {
  id: number;
  role: "user" | "bot";
  content: string | ReactNode;
  backendId?: string;
  metadata?: {
    attachments?: Attachment[];
    [key: string]: any;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  department: string;
  created_at?: string;
}

export interface AttachedFile {
  dataUri: string;
  name: string;
  type: string;
}
