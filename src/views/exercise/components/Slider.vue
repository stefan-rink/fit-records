<template>
  <div class="container">
    <button @click="decrement">-</button>
    <div class="input-wrapper">
      <div class="input">
        <input
          ref="number-input"
          type="number"
          v-model="value"
          size="4"
          maxlength="4"
          @keyup="resize"
        />
        <span ref="shadow" class="shadow-width"></span>
        <span class="unit">{{ unit }}</span>
      </div>
    </div>
    <button @click="increment">+</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Slider",
  props: {
    unit: {
      type: String,
      default: "kg",
    },
    delta: {
      type: Number,
      default: 1,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      value: 0,
    };
  },
  mounted() {
    this.value = this.modelValue;
    this.resize();
  },
  methods: {
    resize() {
      const shadowElement = this.$refs.shadow as HTMLElement;
      const inputElement = this.$refs["number-input"] as HTMLInputElement;
      shadowElement.innerText = this.value.toString();
      inputElement.style.width = `${shadowElement.clientWidth}px`;
    },
    increment() {
      this.value += parseFloat(this.delta.toString());
      this.resize();
    },
    decrement() {
      this.value -= parseFloat(this.delta.toString());
      this.resize();
    },
  },
  watch: {
    value(val) {
      this.$emit("update:modelValue", val);
    },
  },
});
</script>

<style scoped lang="less">
.container {
  border: 1px solid black;
  margin: 8px;
  display: flex;
  align-content: center;
  position: relative;

  .input-wrapper {
    display: flex;
    flex-grow: 1;

    .input {
      margin: 0 auto;
      width: auto;
      display: flex;

      input[type="number"] {
        width: 24px;
        text-align: right;
        border: 0;
        font-size: 24px;
        outline: none;
        margin: 0 auto;
        -moz-appearance: none;
        padding: 0;
      }

      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .unit {
        display: inline-block;
        position: relative;
        font-size: 16px;
        top: 20px;
        padding-left: 2px;
      }

      span.shadow-width {
        position: absolute;
        font-size: 24px;
        z-index: -1;
        padding: 0 8px;
        color: white;
      }
    }
  }

  button {
    background-color: white;
    border-radius: 0;
    border: 0;
    font-size: 30px;
    padding: 4px 20px;
    cursor: pointer;
  }
}
</style>
