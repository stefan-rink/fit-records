<template>
  <section>
    <header>
      <h1>Today</h1>
    </header>
    <nav class="bottom-toolbar">
      <router-link to="list">
        <svg class="add-icon">
          <use :xlink:href="`${require('@/assets/icons.svg')}#add`"></use>
        </svg>
      </router-link>
    </nav>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Home",
  components: {},
});
</script>

<style scoped lang="less">
section {
  height: 100vh;
}
header {
  background-color: #e4e4e4;
  height: 80px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;

  h1 {
    text-align: center;
  }
}

.bottom-toolbar {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 64px;
  background: #e4e4e4;
  display: flex;
  justify-content: center;
  align-items: center;
}

svg.add-icon {
  width: 32px;
  height: 32px;
}
</style>
