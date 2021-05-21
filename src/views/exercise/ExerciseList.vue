<template>
  <section class="exercise-list">
    <div class="exercise-header">
      <h1>Exercises</h1>
      <router-link to="/">
        <svg class="close-icon">
          <use :xlink:href="`${require('@/assets/icons.svg')}#close`"></use>
        </svg>
      </router-link>
    </div>

    <ul>
      <li><router-link to="train">Push-Ups</router-link></li>
      <li><router-link to="train">Bench Press</router-link></li>
      <li><router-link to="train">Deadlifts</router-link></li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExerciseList',
  components: {},
});
</script>

<style scoped lang="less">

.exercise-list {

  .exercise-header {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e4e4e4;
    position: relative;
    width: 100%;

    h1 {
      display: inline-block;
      padding: 8px;
      margin: 0;
      font-size: 28px;
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
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      font-size: 24px;
      padding: 8px 32px;

      a {
        color: #333;
        text-decoration: none;
      }
    }
  }
}

</style>
