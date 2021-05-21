<template>
  <section class="train-wrapper">
    <div class="train-header">
      <a @click="$router.go(-1)">
        <svg class="back-icon">
          <use :xlink:href="`${require('@/assets/icons.svg')}#back`"></use>
        </svg>
      </a>
      <h1>Train hard!</h1>
      <router-link to="/">
        <svg class="close-icon">
          <use :xlink:href="`${require('@/assets/icons.svg')}#close`"></use>
        </svg>
      </router-link>
    </div>

  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Train',
  components: {},
});
</script>

<style scoped lang="less">
.train-wrapper {
  height: 100%;
  width: 100%;
}

.train-header {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e4e4e4;
  position: relative;
  width: 100%;

  h1 {
    display: inline-block;
    padding: 8px;
    font-size: 28px;
    margin: 0;
    text-align: center;
  }

  .close-icon {
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 16px;
    height: 28px;
    width: 28px;
  }

  .back-icon {
    cursor: pointer;
    position: absolute;
    top: 16px;
    left: 16px;
    height: 28px;
    width: 28px;
  }
}
</style>
