import { Emotion } from '../types/emotion';

const EMOTIONS_KEY = 'emotions';
const PRO_KEY = 'isPro';

export const storage = {
  // 获取所有情绪
  getEmotions(): Emotion[] {
    const emotions = uni.getStorageSync(EMOTIONS_KEY);
    return emotions ? JSON.parse(emotions) : [];
  },

  // 保存情绪
  saveEmotion(emotion: Emotion): void {
    const emotions = this.getEmotions();
    emotions.unshift(emotion);
    uni.setStorageSync(EMOTIONS_KEY, JSON.stringify(emotions));
  },

  // 删除情绪
  deleteEmotion(id: number): void {
    const emotions = this.getEmotions();
    const newEmotions = emotions.filter(e => e.id !== id);
    uni.setStorageSync(EMOTIONS_KEY, JSON.stringify(newEmotions));
  },

  // 检查是否解锁高级版
  isPro(): boolean {
    return uni.getStorageSync(PRO_KEY) === 'true';
  },

  // 解锁高级版
  unlockPro(): void {
    uni.setStorageSync(PRO_KEY, 'true');
  }
}; 