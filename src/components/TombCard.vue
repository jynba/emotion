<template>
  <view class="tomb-card" :class="[style, { 'is-pro': isPro }]">
    <view class="tomb-header">
      <text class="emotion">🪦 {{ emotion.emotion }}</text>
      <text class="date">{{ emotion.date }}</text>
    </view>
    <view class="tomb-content">
      <view class="reason">
        <text class="label">死因：</text>
        <text class="value">{{ emotion.reason }}</text>
      </view>
      <view class="last-words">
        <text class="label">遗言：</text>
        <text class="value">{{ emotion.lastWords }}</text>
      </view>
    </view>
    <view class="tomb-footer">
      <button class="share-btn" @click="handleShare">分享</button>
      <button class="delete-btn" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Emotion } from '../types/emotion';
import { storage } from '../utils/storage';

const props = defineProps<{
  emotion: Emotion;
}>();

const emit = defineEmits<{
  (e: 'delete', id: number): void;
  (e: 'share', emotion: Emotion): void;
}>();

const style = computed(() => props.emotion.style);
const isPro = computed(() => storage.isPro());

const handleShare = () => {
  emit('share', props.emotion);
};

const handleDelete = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这条情绪记录吗？',
    success: (res) => {
      if (res.confirm) {
        storage.deleteEmotion(props.emotion.id);
        emit('delete', props.emotion.id);
      }
    }
  });
};
</script>

<style lang="scss" scoped>
.tomb-card {
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);

  &.basic {
    border: 2rpx solid #ddd;
  }

  &.pro {
    background: linear-gradient(135deg, #2c3e50, #3498db);
    color: #fff;

    .label {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .tomb-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .emotion {
      font-size: 36rpx;
      font-weight: bold;
    }

    .date {
      font-size: 24rpx;
      color: #999;
    }
  }

  .tomb-content {

    .reason,
    .last-words {
      margin: 16rpx 0;

      .label {
        color: #666;
        margin-right: 10rpx;
      }

      .value {
        color: #333;
      }
    }
  }

  .tomb-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20rpx;
    gap: 20rpx;

    button {
      font-size: 24rpx;
      padding: 10rpx 20rpx;
      border-radius: 8rpx;

      &.share-btn {
        background: #3498db;
        color: #fff;
      }

      &.delete-btn {
        background: #e74c3c;
        color: #fff;
      }
    }
  }
}
</style>