<template>
  <view class="floating-menu" :class="{ 'is-expanded': isExpanded }">
    <!-- 主按钮 -->
    <view class="menu-button" @click="toggleMenu">
      <text class="menu-icon">{{ isExpanded ? '✕' : '☰' }}</text>
    </view>

    <!-- 菜单项 -->
    <view class="menu-items" v-if="isExpanded">
      <view v-for="(item, index) in menuItems" :key="index" class="menu-item"
        :class="{ 'is-active': currentPage === item.path }" @click="navigateTo(item.path)">
        <text class="item-icon">{{ item.icon }}</text>
        <text class="item-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  currentPage: string;
}>();

const isExpanded = ref(false);

const menuItems = [
  {
    path: '/pages/index/index',
    icon: '⚰️',
    text: '情绪坟场'
  }
];

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value;
};

const navigateTo = (path: string) => {
  if (path === props.currentPage) {
    isExpanded.value = false;
    return;
  }
  uni.navigateTo({ url: path });
  isExpanded.value = false;
};
</script>

<style lang="scss" scoped>
.floating-menu {
  position: fixed;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;

  .menu-button {
    width: 80rpx;
    height: 80rpx;
    background: linear-gradient(135deg, #8d6e63, #5d4037);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.95);
    }

    .menu-icon {
      color: #fff;
      font-size: 36rpx;
      font-weight: 500;
    }
  }

  .menu-items {
    position: absolute;
    right: 100rpx;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20rpx;
    padding: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    min-width: 200rpx;
    opacity: 0;
    transform: translateX(20rpx);
    pointer-events: none;
    transition: all 0.3s ease;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 16rpx 24rpx;
      border-radius: 12rpx;
      transition: all 0.3s ease;

      &:active {
        background: rgba(0, 0, 0, 0.05);
      }

      &.is-active {
        background: rgba(141, 110, 99, 0.1);

        .item-text {
          color: #5d4037;
          font-weight: 500;
        }
      }

      .item-icon {
        font-size: 32rpx;
        margin-right: 16rpx;
      }

      .item-text {
        font-size: 28rpx;
        color: #6b4f4f;
      }
    }
  }

  &.is-expanded {
    .menu-button {
      background: linear-gradient(135deg, #5d4037, #8d6e63);
    }

    .menu-items {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }
  }
}
</style>