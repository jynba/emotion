<template>
  <view class="mobile-tip">
    <view class="tip-content">
      <image src="/static/images/mobile-tip.png" mode="aspectFit" class="tip-image" />
      <text class="tip-title">请使用手机访问</text>
      <text class="tip-desc">为了给您带来更好的体验，请使用手机浏览器访问本应用</text>
      <view class="qrcode-section">
        <text class="qrcode-title">或扫描下方二维码</text>
        <image src="/static/images/qrcode.png" mode="aspectFit" class="qrcode-image" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
// 无需特殊逻辑
</script>

<style lang="scss" scoped>
.mobile-tip {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #faf6f1;
  padding: 40rpx;

  .tip-content {
    text-align: center;
    max-width: 600px;
    width: 100%;
  }

  .tip-image {
    width: 400rpx;
    height: 400rpx;
    margin-bottom: 40rpx;
  }

  .tip-title {
    font-size: 48rpx;
    color: #5d4037;
    font-weight: 600;
    margin-bottom: 20rpx;
    display: block;
  }

  .tip-desc {
    font-size: 32rpx;
    color: #8d6e63;
    line-height: 1.6;
    margin-bottom: 60rpx;
    display: block;
  }

  .qrcode-section {
    background: #fff;
    padding: 40rpx;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);

    .qrcode-title {
      font-size: 32rpx;
      color: #5d4037;
      margin-bottom: 20rpx;
      display: block;
    }

    .qrcode-image {
      width: 300rpx;
      height: 300rpx;
    }
  }
}
</style>