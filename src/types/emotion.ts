// 情绪样式类型
export type EmotionStyle = 'basic' | 'pro';

// 情绪记录类型
export interface Emotion {
  id: number;
  emotion: string;
  reason: string;
  lastWords: string;
  style: EmotionStyle;
  date: string;
  createdAt: number;
}

// 埋葬表单类型
export interface BuryForm {
  emotion: string;
  reason: string;
  lastWords: string;
  style: EmotionStyle;
} 