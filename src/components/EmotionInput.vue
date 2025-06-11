<template>
  <view class="emotion-input">
    <!-- 情绪类型选择 -->
    <view class="emotion-types">
      <text class="section-title">🎭 选择你的情绪</text>
      <view class="type-grid">
        <view v-for="type in emotionTypes" :key="type.value" class="type-item"
          :class="{ active: selectedType === type.value }" @click="selectedType = type.value">
          <text class="emoji">{{ type.emoji }}</text>
          <text class="name">{{ type.label }}</text>
        </view>
      </view>
    </view>

    <!-- 情绪描述输入 -->
    <view class="emotion-desc">
      <text class="section-title">💭 描述一下发生了什么</text>
      <textarea v-model="description" class="desc-input" placeholder="告诉我发生了什么，你的感受是什么..." maxlength="200" />
    </view>

    <!-- 选择陪伴者 -->
    <view class="companion-select">
      <text class="section-title">🐾 选择你的陪伴者</text>
      <view class="companion-list">
        <view v-for="pet in companions" :key="pet.id" class="companion-item"
          :class="{ active: selectedCompanion === pet.id }" @click="selectedCompanion = pet.id">
          <image :src="pet.avatar" class="avatar" mode="aspectFit" />
          <view class="info">
            <text class="name">{{ pet.name }}</text>
            <text class="personality">{{ pet.personality }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 提交按钮 -->
    <button class="submit-btn" :disabled="!isValid" @click="handleSubmit">
      🌸 开始倾诉
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emotionTypes = [
  { value: 'anxiety', label: '焦虑', emoji: '😰' },
  { value: 'anger', label: '愤怒', emoji: '😠' },
  { value: 'sadness', label: '委屈', emoji: '😢' },
  { value: 'stress', label: '压力', emoji: '😫' },
  { value: 'lonely', label: '孤独', emoji: '🥺' },
  { value: 'other', label: '其他', emoji: '🤔' }
];

const companions = [
  {
    id: 'cat',
    name: '温柔小猫',
    personality: '善于倾听',
    avatar: '/static/images/cat.png'
  },
  {
    id: 'dog',
    name: '活力小狗',
    personality: '带来欢乐',
    avatar: '/static/images/dog.png'
  },
  {
    id: 'bear',
    name: '治愈小熊',
    personality: '给予力量',
    avatar: '/static/images/bear.png'
  }
];

const selectedType = ref('');
const description = ref('');
const selectedCompanion = ref('');

const isValid = computed(() => {
  return selectedType.value &&
    description.value.trim().length > 0 &&
    selectedCompanion.value;
});

const emit = defineEmits<{
  (e: 'submit', data: {
    type: string;
    description: string;
    companion: string;
  }): void;
}>();

const handleSubmit = () => {
  if (!isValid.value) return;

  emit('submit', {
    type: selectedType.value,
    description: description.value.trim(),
    companion: selectedCompanion.value
  });
};
</script>

<style lang="scss" scoped>
.emotion-input {
  padding: 30rpx;
  background: #faf6f1;

  .section-title {
    display: block;
    font-size: 32rpx;
    color: #6b4f4f;
    margin-bottom: 24rpx;
    font-weight: 500;
  }

  .emotion-types {
    margin-bottom: 40rpx;

    .type-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20rpx;

      .type-item {
        background: #fff;
        border: 3rpx solid #d4c4b7;
        border-radius: 16rpx;
        padding: 20rpx;
        text-align: center;
        transition: all 0.3s ease;

        &.active {
          border-color: #8d6e63;
          background: #fff;
          box-shadow: 0 4rpx 12rpx rgba(141, 110, 99, 0.1);
        }

        .emoji {
          font-size: 40rpx;
          display: block;
          margin-bottom: 8rpx;
        }

        .name {
          font-size: 26rpx;
          color: #6b4f4f;
        }
      }
    }
  }

  .emotion-desc {
    margin-bottom: 40rpx;

    .desc-input {
      width: 100%;
      height: 200rpx;
      padding: 24rpx;
      background: #fff;
      border: 3rpx solid #d4c4b7;
      border-radius: 16rpx;
      font-size: 28rpx;
      color: #5d4037;
      line-height: 1.6;

      &::placeholder {
        color: #a1887f;
      }
    }
  }

  .companion-select {
    margin-bottom: 40rpx;

    .companion-list {
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .companion-item {
        display: flex;
        align-items: center;
        padding: 20rpx;
        background: #fff;
        border: 3rpx solid #d4c4b7;
        border-radius: 16rpx;
        transition: all 0.3s ease;

        &.active {
          border-color: #8d6e63;
          background: #fff;
          box-shadow: 0 4rpx 12rpx rgba(141, 110, 99, 0.1);
        }

        .avatar {
          width: 80rpx;
          height: 80rpx;
          margin-right: 20rpx;
          border-radius: 50%;
        }

        .info {
          flex: 1;

          .name {
            font-size: 28rpx;
            color: #5d4037;
            font-weight: 500;
            margin-bottom: 4rpx;
          }

          .personality {
            font-size: 24rpx;
            color: #a1887f;
          }
        }
      }
    }
  }

  .submit-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: linear-gradient(135deg, #a1887f, #8d6e63);
    color: #fff;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 500;
    letter-spacing: 2rpx;
    box-shadow: 0 4rpx 12rpx rgba(141, 110, 99, 0.2);
    transition: all 0.3s ease;

    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 2rpx 6rpx rgba(141, 110, 99, 0.2);
    }

    &:disabled {
      background: #d4c4b7;
      box-shadow: none;
    }
  }
}

// 添加动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.emotion-input {
  animation: fadeIn 0.6s ease-out;
}
</style>