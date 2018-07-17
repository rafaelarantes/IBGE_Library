<template>
  <div id="app" class="container">
    <home></home>
  </div>
</template>

<script>
import Home from './components/home/Home.vue';

export default {
  name: 'app',
  components: {
      'home' : Home
  }
}
</script>

<style>
#app {
  position: absolute;
  top: px;
  left:50%;
  transform: translate(-50%,-50%);
}
</style>
