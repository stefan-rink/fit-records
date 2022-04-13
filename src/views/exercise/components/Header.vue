<template>
  <div class="header">
    <router-link v-if="back" :to="back">
      <svg class="icon back-icon">
        <use :xlink:href="`${require('@/assets/icons.svg')}#back`"></use>
      </svg>
    </router-link>
    <h1>
      <slot></slot>
    </h1>
    <router-link v-if="close" :to="close">
      <svg class="icon close-icon">
        <use :xlink:href="`${require('@/assets/icons.svg')}#close`"></use>
      </svg>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header",
  props: {
    title: String,
    back: String,
    close: String,
  },
});
</script>

<style scoped lang="less">
@import "./../../variables";

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e4e4e4;
  position: relative;
  height: @header-height;
  width: 100%;

  h1 {
    display: inline-block;
    text-align: center;
  }

  .icon {
    position: absolute;
    top: 16px;
    height: 28px;
    width: 28px;
  }

  .close-icon {
    right: 16px;
  }

  .back-icon {
    left: 16px;
  }
}
</style>
