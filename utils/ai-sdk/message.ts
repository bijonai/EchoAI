import type { Message } from "ai"

export class message {
  static user(content: string): Message {
    return {
      id: crypto.randomUUID(),
      role: 'user',
      content,
    }
  }

  static system(content: string): Message {
    return {
      id: crypto.randomUUID(),
      role: 'system',
      content,
    }
  }

  static assistant(content: string): Message {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
    }
  }
}