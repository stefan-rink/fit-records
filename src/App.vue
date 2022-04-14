<template>
  <div id="app-wrapper">
    <router-view v-slot="{ Component }" class="drawer-content">
      <transition :name="transitionName">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import Home from "@/views/Home.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { Home },
  data() {
    return {
      transitionName: "",
    };
  },
  watch: {
    $route(to, from) {
      if (to.meta.index === 1 && from.meta.index === 0) {
        this.transitionName = "up";
      } else if (to.meta.index === 0) {
        this.transitionName = "down";
      } else {
        this.transitionName = to.meta.index > from.meta.index ? "next" : "prev";
      }
    },
  },
});
</script>

<style lang="less">
@import "assets/fonts/style.css";
@import "views/variables";

* {
  box-sizing: border-box;
  font-weight: 400;
  font-family: "Poppins", normal, sans-serif;
}

html,
body,
div#app {
  padding: 0;
  margin: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  touch-action: none;
}

h1 {
  font-size: 28px;
  margin: 0;
  padding: 8px;
}

svg {
  width: 24px;
  height: 24px;
}

input[type="text"] {
  border: 0;
  border-bottom: 1px solid black;
  outline: 0;
  font-size: 20px;

  &:active {
    border-bottom: 2px;
  }
}

main {
  width: 100%;
  height: calc(100% - @header-height);
  overflow-y: auto;
  padding: 0 24px;

  & > .content {
    width: 100%;
    max-width: 560px;
    margin: 0 auto;
    padding: 16px 0;
  }

  h1 {
    margin-bottom: 16px;
    padding: 0;
  }

  input[type="text"] {
    width: 100%;
    margin-bottom: 16px;
  }
}

button.btn {
  background-color: #e4e4e4;
  border: 0;
  box-shadow: none;
  display: block;
  width: 100%;
  height: 48px;
  font-size: 20px;
  cursor: pointer;
  color: #333;

  &.btn-delete {
    color: darkred;
    background-color: #da9191;
  }
}

section {
  width: 100%;
}

div#app-wrapper {
  display: grid;
  grid-template: "main";
  background-color: white;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  transform: translateY(0);

  & > * {
    grid-area: main;
    background-color: white;
    position: relative;
    min-height: 100%;
  }

  & > :first-child {
    z-index: 1; /* Prevent flickering on first frame when transition classes not added yet */
  }
}

/* https://codesandbox.io/s/vue-ios-like-transitions-n6v3d?file=/src/router.js:390-421 */
.next-leave-to {
  animation: leaveToLeft 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 0;
}

.next-enter-to {
  animation: enterFromRight 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.prev-leave-to {
  animation: leaveToRight 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.prev-enter-to {
  animation: enterFromLeft 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 0;
}

.up-leave-to {
  animation: leaveToBottom 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 0;
}

.up-enter-to {
  animation: enterFromTop 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.down-leave-to {
  animation: leaveToTop 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.down-enter-to {
  animation: enterFromBottom 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 0;
}

@keyframes leaveToLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-25%);
    filter: brightness(0.5);
  }
}

@keyframes enterFromLeft {
  from {
    transform: translateX(-25%);
    filter: brightness(0.5);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes leaveToRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes enterFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes leaveToBottom {
  from {
    transform: translateY(0);
  }
  to {
    filter: brightness(0.5);
  }
}

@keyframes enterFromBottom {
  from {
    filter: brightness(0.5);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes leaveToTop {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes enterFromTop {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
