export interface ChatSourceProduct {
  id: number;
  name: string;
  price: number;
  categoryName?: string;
  score?: number;
}

export interface ChatToolCall {
  name: string;
  input: string;
  outputSummary: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSourceProduct[];
  toolCalls?: ChatToolCall[];
  streaming?: boolean;
  error?: string;
  createdAt: number;
}
