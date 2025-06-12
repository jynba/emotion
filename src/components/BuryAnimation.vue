<template>
  <view class="bury-animation">
    <view class="scene">
      <!-- 背景 -->
      <view class="background">
        <image src="../static/images/cemetery-bg-yellow.png" mode="aspectFill" class="bg-image" />
      </view>

      <!-- 小动物 -->
      <view class="companion" :class="[companion, { 'is-carrying': isCarrying }]">
        <image :src="companionImage" mode="aspectFit" class="companion-image" />
        <!-- 情绪纸条 -->
        <!-- <view class="emotion-note" :class="{ 'is-visible': isCarrying }">
          <view class="note-content">
            <text class="note-type">{{ emotionType }}</text>
            <text class="note-desc">{{ description }}</text>
          </view>
        </view> -->
      </view>

      <!-- 情绪卡片 -->
      <view class="emotion-card" :class="{ 'is-burying': isBurying }">
        <image src="/static/images/emotion.png" mode="aspectFit" class="card-image" />
      </view>

      <!-- 铲子 -->
      <view class="shovel" :class="{ 'is-digging': isDigging, 'is-hidden': !isDigging }">
        <image src="/static/images/shovel.png" mode="aspectFit" class="shovel-image" />
      </view>

      <!-- 土堆 -->
      <view class="soil" :class="{ 'is-dug': isDigging, 'is-visible': isSoil }">
        <image src="/static/images/soil.png" mode="aspectFit" class="soil-image" />
      </view>

      <!-- 情绪种子 -->
      <view class="seed" :class="{ 'is-planted': isPlanted }">
        <image src="/static/images/seed.png" mode="aspectFit" class="seed-image" />
      </view>

      <!-- 情绪之花 -->
      <view class="flower" :class="{ 'is-grown': isGrown }">
        <image src="../static/images/flower.png" mode="aspectFit" class="flower-image" />
      </view>
    </view>

    <!-- 对话气泡 -->
    <view class="speech-bubble" :class="{ 'is-visible': showSpeech }">
      <text class="speech-text">{{ currentSpeech }}</text>
    </view>

    <!-- 音效控制 -->
    <!-- <audio id="digSound" src="/static/sounds/dig.mp3" />
    <audio id="bellSound" src="/static/sounds/bell.mp3" /> -->
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const props = defineProps<{
  companion: string;
  emotionType: string;
  description: string;
}>();

const isCarrying = ref(false);
const isDigging = ref(false);
const isBurying = ref(false);
const isPlanted = ref(false);
const isGrown = ref(false);
const showSpeech = ref(false);
const currentSpeech = ref('');
const isSoil = ref(false);

// 音效控制
// const playSound = (soundId: string) => {
//   const audio = document.getElementById(soundId) as HTMLAudioElement;
//   if (audio) {
//     audio.currentTime = 0;
//     audio.play().catch(err => console.log('Audio play failed:', err));
//   }
// };

const speeches = {
  cat: [
    '喵~让我帮你把坏情绪埋起来',
    '挖个坑，把情绪放进去',
    '种下一颗希望的种子',
    '看，开出了美丽的花呢'
  ],
  dog: [
    '汪！我们一起把坏情绪赶跑！',
    '挖呀挖，把情绪埋起来',
    '种下快乐的种子',
    '哇！开出了漂亮的花！'
  ],
  bear: [
    '抱抱~一切都会好起来的',
    '让我帮你把情绪埋起来',
    '种下治愈的种子',
    '看，开出了温暖的花'
  ]
};

const companionImage = computed(() => {
  return `/static/images/${props.companion}.png`;
});

const startAnimation = async () => {
  // 开始对话
  showSpeech.value = true;
  currentSpeech.value = speeches[props.companion][0];

  // 等待1秒后开始挖坑
  await new Promise(resolve => setTimeout(resolve, 1000));
  isDigging.value = true;
  currentSpeech.value = speeches[props.companion][1];
  // playSound('digSound');

  // 等待2秒后出现土壤
  await new Promise(resolve => setTimeout(resolve, 2000));
  isSoil.value = true;

  // 等待1秒后卡片开始下落
  await new Promise(resolve => setTimeout(resolve, 1000));
  isBurying.value = true;  // 显示卡片并开始下落

  // 等待2秒停顿
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 继续挖坑动画
  isDigging.value = true;
  currentSpeech.value = speeches[props.companion][2];

  // 等待2秒后卡片消失，土壤消失
  await new Promise(resolve => setTimeout(resolve, 2000));
  isBurying.value = false;  // 隐藏卡片
  isSoil.value = false;

  // 等待1秒停顿
  await new Promise(resolve => setTimeout(resolve, 1000));
  // 挖坑动画停止
  isDigging.value = false;

  // 等待1秒后种子出现
  await new Promise(resolve => setTimeout(resolve, 1000));
  isPlanted.value = true;

  // 等待1秒后种子消失，同时花出现
  await new Promise(resolve => setTimeout(resolve, 1000));
  isPlanted.value = false;
  isGrown.value = true;
  currentSpeech.value = speeches[props.companion][3];

  // 等待3秒后结束动画
  await new Promise(resolve => setTimeout(resolve, 3000));
  emit('complete');
};

const emit = defineEmits<{
  (e: 'complete'): void;
}>();

onMounted(() => {
  startAnimation();
});
</script>

<style lang="scss" scoped>
.bury-animation {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #faf6f1;
  overflow: hidden;

  .scene {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .bg-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .companion {
    position: absolute;
    bottom: 200rpx;
    right: 180rpx;
    transform: translateX(50%);
    width: 200rpx;
    height: 200rpx;
    transition: all 0.5s ease;

    &.is-carrying {
      transform: translateX(50%) translateY(-20rpx);
      animation: floating 1s ease-in-out infinite;
    }

    &.cat {
      bottom: 250rpx;
    }

    &.dog {
      bottom: 250rpx;
    }

    &.bear {
      bottom: 220rpx;
    }

    .companion-image {
      width: 100%;
      height: 100%;
    }
  }

  .emotion-card {
    position: absolute;
    bottom: 320rpx;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100rpx;
    height: 100rpx;
    transition: all 1s ease;
    z-index: 2;
    opacity: 0;
    visibility: hidden;

    &.is-burying {
      transform: translate(-50%, 90%);
      opacity: 1;
      visibility: visible;
      animation: cardFall 2s ease-in forwards;
    }

    .card-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .shovel {
    position: absolute;
    bottom: 300rpx;
    left: 50%;
    width: 100rpx;
    height: 100rpx;
    transform-origin: bottom center;
    transition: all 0.5s ease;
    z-index: 3;
    opacity: 1;
    visibility: visible;

    &.is-digging {
      animation: digging 1s infinite;
    }

    &.is-hidden {
      opacity: 0;
      visibility: hidden;
    }

    .shovel-image {
      width: 100%;
      height: 100%;
    }
  }

  .soil {
    position: absolute;
    bottom: 200rpx;
    left: 50%;
    transform: translateX(-50%) scale(0);
    width: 300rpx;
    height: 200rpx;
    transition: all 0.5s ease;
    z-index: 1;
    opacity: 0;

    &.is-visible {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }

    &.is-dug {
      transform: translateX(-50%) scale(1.2);
      animation: digging-soil 1s ease-in-out;
    }

    .soil-image {
      width: 100%;
      height: 100%;
    }
  }

  .seed {
    position: absolute;
    bottom: 260rpx;
    left: 50%;
    transform: translate(-50%, 100%);
    width: 60rpx;
    height: 60rpx;
    opacity: 0;
    transition: all 0.5s ease;
    z-index: 2;

    &.is-planted {
      transform: translate(-50%, 0);
      opacity: 1;
      animation: seedDisappear 1s forwards;
    }

    .seed-image {
      width: 100%;
      height: 100%;
    }
  }

  .flower {
    position: absolute;
    bottom: 300rpx;
    left: 50%;
    transform: translate(-50%, 100%);
    width: 120rpx;
    height: 120rpx;
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 2;

    &.is-grown {
      transform: translate(-50%, 0);
      opacity: 1;
    }

    .flower-image {
      width: 100%;
      height: 100%;
    }
  }

  .speech-bubble {
    position: absolute;
    top: 100rpx;
    left: 50%;
    transform: translateX(-50%) scale(0);
    background: #fff;
    padding: 20rpx 30rpx;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    opacity: 0;

    &.is-visible {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }

    .speech-text {
      font-size: 28rpx;
      color: #5d4037;
      line-height: 1.4;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -20rpx;
      left: 50%;
      transform: translateX(-50%);
      border: 10rpx solid transparent;
      border-top-color: #fff;
    }
  }
}

@keyframes floating {

  0%,
  100% {
    transform: translateX(50%) translateY(-20rpx);
  }

  50% {
    transform: translateX(50%) translateY(-30rpx);
  }
}

@keyframes digging-soil {
  0% {
    transform: translateX(-50%) scale(1);
  }

  50% {
    transform: translateX(-50%) scale(1.3);
  }

  100% {
    transform: translateX(-50%) scale(1.2);
  }
}

@keyframes digging {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(15deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes seedDisappear {
  0% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  80% {
    opacity: 1;
    transform: translate(-50%, 0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -20rpx);
  }
}

@keyframes cardFall {
  0% {
    transform: translate(-50%, 0);
    opacity: 1;
    visibility: visible;
  }

  80% {
    transform: translate(-50%, 100%);
    opacity: 1;
    visibility: visible;
  }

  100% {
    transform: translate(-50%, 100%);
    opacity: 0;
    visibility: hidden;
  }
}

// 添加动画效果
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.bury-animation {
  animation: fadeIn 0.6s ease-out;
}
</style>