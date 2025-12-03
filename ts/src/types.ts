export interface OHLCV {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}