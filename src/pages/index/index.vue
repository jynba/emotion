<template>
  <view>
    <view v-if="!showAnimation" class="container">
      <!-- 头部 -->
      <view class="header">
        <text class="title">⚰️ 情绪坟场</text>
        <text class="subtitle">让坏情绪在这里安息</text>
      </view>

      <!-- 主要内容区域 -->
      <view class="main-content">
        <!-- 情绪输入表单 -->
        <view class="emotion-form">
          <view class="form-section">
            <text class="section-title">🎭 选择你的情绪</text>
            <view class="emotion-types">
              <view v-for="type in emotionTypes" :key="type.value" class="emotion-type-item"
                :class="{ 'is-selected': selectedEmotion === type.value }" @click="selectEmotion(type.value)">
                <text class="emotion-icon">{{ type.icon }}</text>
                <text class="emotion-name">{{ type.label }}</text>
              </view>
            </view>
          </view>

          <view class="form-section">
            <text class="section-title">💭 描述你的感受</text>
            <textarea v-model="emotionDescription" class="emotion-input" placeholder="写下你的情绪，让它在这里安息..."
              :maxlength="100" show-confirm-bar />
            <text class="input-count">{{ emotionDescription.length }}/100</text>
          </view>

          <view class="form-section">
            <text class="section-title">🐾 选择你的陪伴者</text>
            <view class="companion-selector">
              <view v-for="companion in companions" :key="companion.value" class="companion-item"
                :class="{ 'is-selected': selectedCompanion === companion.value }"
                @click="selectCompanion(companion.value)">
                <image :src="companion.image" mode="aspectFit" class="companion-image" />
                <view class="companion-msg">
                  <text class="companion-name">{{ companion.label }}</text>
                  <text class="companion-desc">{{ companion.description }}</text>
                </view>
              </view>
            </view>
          </view>

          <button class="submit-button" :disabled="!canSubmit" @click="startBurying">
            开始埋葬
          </button>
        </view>
      </view>

      <!-- 历史记录入口 -->
      <view class="history-entry" @click="goToHistory">
        <text class="history-icon">🪦</text>
        <text class="history-text">扫墓</text>
      </view>

      <!-- 悬浮菜单 -->
      <floating-menu :current-page="currentPage" />
    </view>
    <!-- 埋葬动画 -->
    <buryAnimation v-if="showAnimation" :companion="selectedCompanion" :emotion-type="selectedEmotion"
      :description="emotionDescription" @complete="onBuryingComplete" @animation-end="handleAnimationEnd" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import FloatingMenu from '@/components/FloatingMenu.vue';
import BuryAnimation from '@/components/BuryAnimation.vue';

// 当前页面路径
const currentPage = ref('/pages/index/index');

// 情绪类型
const emotionTypes = [
  { value: 'anxiety', label: '焦虑', icon: '😰' },
  { value: 'anger', label: '愤怒', icon: '😠' },
  { value: 'sadness', label: '悲伤', icon: '😢' },
  { value: 'stress', label: '压力', icon: '😫' },
  { value: 'custom', label: '其他', icon: '😔' }
];

// 陪伴者选项
const companions = [
  {
    value: 'cat',
    label: '温柔猫咪',
    description: '喵~让我来安慰你',
    image: '/static/images/cat.png'
  },
  {
    value: 'dog',
    label: '活力小狗',
    description: '汪！我们一起赶走坏情绪',
    image: '/static/images/dog.png'
  },
  {
    value: 'bear',
    label: '暖心小熊',
    description: '抱抱~一切都会好起来的',
    image: '/static/images/bear.png'
  }
];

// 表单数据
const selectedEmotion = ref<string | null>(null);
const emotionDescription = ref<string>('');
const selectedCompanion = ref('');
const showAnimation = ref(false);

// 计算属性：是否可以提交
const canSubmit = computed(() => {
  return selectedEmotion.value &&
    emotionDescription.value.trim().length > 0 &&
    selectedCompanion.value;
});

// 选择情绪
const selectEmotion = (emotion: string) => {
  selectedEmotion.value = emotion;
};

// 选择陪伴者
const selectCompanion = (companion: string) => {
  selectedCompanion.value = companion;
};

// 开始埋葬流程
const startBurying = () => {
  if (!canSubmit.value) return;

  // 保存情绪记录
  const emotion = {
    type: selectedEmotion.value,
    description: emotionDescription.value,
    companion: selectedCompanion.value,
    timestamp: new Date().toISOString()
  };

  // 保存到本地存储
  const emotions = uni.getStorageSync('emotions') || [];
  emotions.push(emotion);
  uni.setStorageSync('emotions', emotions);

  // 显示动画
  showAnimation.value = true;
};

// 埋葬完成回调
const onBuryingComplete = () => {
  // 重置表单
  selectedEmotion.value = null;
  emotionDescription.value = '';
  selectedCompanion.value = '';
  showAnimation.value = false;

  // 显示完成提示
  uni.showToast({
    title: '情绪已安息',
    icon: 'success',
    duration: 2000
  });
};

// 跳转到历史记录
const goToHistory = () => {
  uni.navigateTo({
    url: '/pages/history/index'
  });
};

// 检查平台
const checkPlatform = () => {
  // #ifdef H5
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (!isMobile) {
    // uni.showModal({
    //   title: '提示',
    //   content: '为了更好的体验，请使用手机访问',
    //   showCancel: false,
    //   success: () => {
    //     // 可以在这里添加重定向到移动端提示页面
    //     // uni.redirectTo({
    //     //   url: '/pages/mobile-tip/index'
    //     // });
    //   }
    // });
  }
  // #endif

  // #ifdef MP
  // 小程序环境，不需要特殊处理
  // #endif
};

// 页面加载时检查平台
onMounted(() => {
  checkPlatform();
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const showAnimationParam = currentPage.$page?.options?.showAnimation;

  if (showAnimationParam === 'true') {
    const emotion = uni.getStorageSync('selectedEmotion');
    if (emotion) {
      selectedEmotion.value = emotion;
      showAnimation.value = true;
      // 清除存储的选中情绪
      uni.removeStorageSync('selectedEmotion');
    }
  }
});

// 动画结束后的处理
const handleAnimationEnd = () => {
  showAnimation.value = false;
  selectedEmotion.value = null;
  // 如果是从历史记录页面跳转来的，返回历史记录页面
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  }
};

// 页面显示时刷新数据
onShow(() => {
  // 可以在这里添加数据刷新逻辑
});
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  min-height: 100vh;
  background: #faf6f1;
  padding: 30rpx;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;

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

.main-content {
  position: relative;
  min-height: 800rpx;
}

.emotion-form {
  .form-section {
    margin-bottom: 40rpx;

    .section-title {
      font-size: 32rpx;
      color: #5d4037;
      font-weight: 500;
      margin-bottom: 20rpx;
      display: block;
    }
  }

  .emotion-types {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;

    .emotion-type-item {
      flex: 1;
      min-width: 120rpx;
      padding: 20rpx;
      background: #fff;
      border-radius: 16rpx;
      text-align: center;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &.is-selected {
        background: #8d6e63;
        transform: translateY(-4rpx);
        box-shadow: 0 4rpx 12rpx rgba(141, 110, 99, 0.2);

        .emotion-name {
          color: #fff;
        }
      }

      .emotion-icon {
        font-size: 40rpx;
        margin-bottom: 8rpx;
        display: block;
      }

      .emotion-name {
        font-size: 24rpx;
        color: #6b4f4f;
      }
    }
  }

  .emotion-input {
    width: 100%;
    height: 200rpx;
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #5d4037;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
  }

  .input-count {
    font-size: 24rpx;
    color: #8d6e63;
    text-align: right;
    margin-top: 8rpx;
    display: block;
  }

  .companion-selector {
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .companion-item {
      background: #fff;
      border-radius: 16rpx;
      padding: 20rpx;
      display: flex;
      align-items: center;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &.is-selected {
        background: #8d6e63;
        transform: translateX(8rpx);
        box-shadow: 0 4rpx 12rpx rgba(141, 110, 99, 0.2);

        .companion-msg {
          display: flex;
          flex-direction: column;

          .companion-name,
          .companion-desc {
            color: #fff;
          }
        }
      }

      .companion-image {
        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
      }

      .companion-info {
        flex: 1;
      }

      .companion-name {
        font-size: 28rpx;
        color: #5d4037;
        font-weight: 500;
        margin-bottom: 8rpx;
        display: block;
      }

      .companion-desc {
        font-size: 24rpx;
        color: #8d6e63;
      }
    }
  }

  .submit-button {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #8d6e63, #5d4037);
    border-radius: 44rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    box-shadow: 0 4rpx 12rpx rgba(141, 110, 99, 0.2);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
    }

    &[disabled] {
      background: #ccc;
      box-shadow: none;
    }
  }
}

.history-entry {
  position: fixed;
  right: 30rpx;
  top: 40rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 16rpx 24rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

  .history-icon {
    font-size: 32rpx;
    margin-right: 8rpx;
  }

  .history-text {
    font-size: 28rpx;
    color: #5d4037;
  }
}

// 添加响应式样式
@media screen and (min-width: 768px) {
  .container {
    max-width: 750rpx; // 限制最大宽度
    margin: 0 auto; // 居中显示
    background: #faf6f1;
    min-height: 100vh;
    position: relative;
  }

  .emotion-form {
    max-width: 600px;
    margin: 0 auto;
  }

  .history-entry {
    right: calc(50% - 375rpx + 30rpx); // 根据容器宽度调整位置
  }
}

// 添加移动端适配
@media screen and (max-width: 767px) {
  .container {
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
  }
}
</style>