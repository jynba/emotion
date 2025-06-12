<template>
  <view>
    <view class="history-page" v-if="!showAnimation">
      <!-- 返回按钮 -->
      <view class="back-button" @click="goBack">
        <text class="back-icon">←</text>
      </view>

      <!-- 头部 -->
      <view class="header">
        <text class="title">🪦 情绪坟场</text>
        <text class="subtitle">查看你的情绪记录</text>
      </view>
      <!-- 历史记录列表 -->
      <scroll-view class="history-list" scroll-y>
        <view v-if="emotions.length === 0" class="empty-state">
          <text class="empty-text">还没有埋葬过情绪呢</text>
          <text class="empty-subtext">去首页埋葬你的第一个情绪吧</text>
        </view>
        <view v-else v-for="(emotion, index) in emotions" :key="index" class="history-item"
          @click="viewEmotion(emotion)">
          <view class="emotion-info">
            <text class="emotion-type">{{ getEmotionTypeLabel(emotion.type) }}</text>
            <text class="emotion-date">{{ formatDate(emotion.timestamp) }}</text>
          </view>
          <view class="emotion-desc">{{ emotion.description }}</view>
          <view class="companion-info">
            <image :src="getCompanionImage(emotion.companion)" mode="aspectFit" class="companion-icon" />
            <text class="companion-name">{{ getCompanionName(emotion.companion) }}</text>
          </view>
        </view>
      </scroll-view>

    </view>
    <!-- 动画展示 -->
    <buryAnimation v-if="showAnimation" :companion="selectedEmotion.companion" :emotion-type="selectedEmotion.type"
      :description="selectedEmotion.description" @complete="onAnimationComplete" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BuryAnimation from '@/components/BuryAnimation.vue';

interface Emotion {
  type: string;
  description: string;
  companion: string;
  timestamp: string;
}

// 情绪类型映射
const emotionTypes = {
  anxiety: { label: '焦虑', icon: '😰' },
  anger: { label: '愤怒', icon: '😠' },
  sadness: { label: '悲伤', icon: '😢' },
  stress: { label: '压力', icon: '😫' },
  custom: { label: '其他', icon: '😔' }
};

// 陪伴者映射
const companions = {
  cat: { name: '温柔猫咪', image: '/static/images/cat.png' },
  dog: { name: '活力小狗', image: '/static/images/dog.png' },
  bear: { name: '暖心小熊', image: '/static/images/bear.png' }
};

const emotions = ref<Emotion[]>([]);
const showAnimation = ref(false);
const selectedEmotion = ref<Emotion | null>(null);

// 获取情绪类型标签
const getEmotionTypeLabel = (type: string) => {
  return emotionTypes[type]?.label || '其他';
};

// 获取陪伴者名称
const getCompanionName = (companion: string) => {
  return companions[companion]?.name || '未知';
};

// 获取陪伴者图片
const getCompanionImage = (companion: string) => {
  return companions[companion]?.image || '';
};

// 格式化日期
const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 返回首页
const goBack = () => {
  uni.navigateBack();
};

// 查看情绪动画
const viewEmotion = (emotion: Emotion) => {
  console.log(emotion, 'emotion');
  selectedEmotion.value = emotion;
  showAnimation.value = true;
};

// 动画完成回调
const onAnimationComplete = () => {
  console.log('onAnimationComplete');
  showAnimation.value = false;
  selectedEmotion.value = null;
};

// 加载历史记录
const loadHistory = () => {
  const history = uni.getStorageSync('emotions') || [];
  emotions.value = history.sort((a: Emotion, b: Emotion) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

onMounted(() => {
  loadHistory();
});
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background: #faf6f1;
  padding: 30rpx;
  box-sizing: border-box;
  position: relative;
}

.back-button {
  position: absolute;
  top: 40rpx;
  left: 30rpx;
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  z-index: 10;

  .back-icon {
    font-size: 40rpx;
    color: #5d4037;
  }

  &:active {
    transform: scale(0.95);
  }
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
  padding-top: 40rpx;

  .title {
    font-size: 48rpx;
    color: #5d4037;
    font-weight: 600;
    margin-bottom: 12rpx;
    display: block;
  }

  .subtitle {
    font-size: 28rpx;
    color: #8d6e63;
    display: block;
  }
}

.history-list {
  height: calc(100vh - 200rpx);
  padding: 20rpx 0;
}

.empty-state {
  text-align: center;
  padding: 100rpx 0;

  .empty-text {
    font-size: 32rpx;
    color: #8d6e63;
    margin-bottom: 12rpx;
    display: block;
  }

  .empty-subtext {
    font-size: 28rpx;
    color: #a1887f;
  }
}

.history-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  .emotion-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;

    .emotion-type {
      font-size: 32rpx;
      color: #5d4037;
      font-weight: 500;
    }

    .emotion-date {
      font-size: 24rpx;
      color: #8d6e63;
    }
  }

  .emotion-desc {
    font-size: 28rpx;
    color: #6b4f4f;
    line-height: 1.4;
    margin-bottom: 16rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .companion-info {
    display: flex;
    align-items: center;

    .companion-icon {
      width: 40rpx;
      height: 40rpx;
      margin-right: 12rpx;
    }

    .companion-name {
      font-size: 24rpx;
      color: #8d6e63;
    }
  }
}
</style>