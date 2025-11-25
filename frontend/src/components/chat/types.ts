import type { ReactNode } from "react";

export interface Message {
  id: number;
  role: "user" | "bot";
  content: string | ReactNode;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  department: string;
}

export interface AttachedFile {
  dataUri: string;
  name: string;
  type: string;
}
