<template>
  <header>
    <h1>Today</h1>
  </header>
  <nav class="bottom-toolbar">
    Add
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Home',
  components: {},
});
</script>

<style scoped lang="less">
h1 {
  margin: 40px 0 0;
}

.bottom-toolbar {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 64px;
  background: #e4e4e4;
}

</style>
