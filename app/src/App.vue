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

}
</style>
