import { Emotion } from '../types/emotion';

// 生成分享图片
export const generateShareImage = async (emotion: Emotion): Promise<string> => {
  // TODO: 使用 canvas 生成分享图片
  return new Promise((resolve) => {
    // 模拟生成图片
    setTimeout(() => {
      resolve('/static/images/share-template.png');
    }, 1000);
  });
};

// 分享到微信
export const shareToWechat = async (emotion: Emotion) => {
  try {
    const imageUrl = await generateShareImage(emotion);

    uni.share({
      provider: 'weixin',
      scene: 'WXSceneSession',
      type: 0,
      title: `我的情绪：${emotion.emotion}`,
      summary: `${emotion.reason}\n${emotion.lastWords}`,
      imageUrl,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: () => {
        uni.showToast({
          title: '分享失败',
          icon: 'error'
        });
      }
    });
  } catch (error) {
    uni.showToast({
      title: '生成分享图片失败',
      icon: 'error'
    });
  }
};

// 分享到朋友圈
export const shareToTimeline = async (emotion: Emotion) => {
  try {
    const imageUrl = await generateShareImage(emotion);

    uni.share({
      provider: 'weixin',
      scene: 'WXSceneTimeline',
      type: 0,
      title: `我的情绪：${emotion.emotion}`,
      summary: `${emotion.reason}\n${emotion.lastWords}`,
      imageUrl,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: () => {
        uni.showToast({
          title: '分享失败',
          icon: 'error'
        });
      }
    });
  } catch (error) {
    uni.showToast({
      title: '生成分享图片失败',
      icon: 'error'
    });
  }
}; 