<!--
 * @Author: your name
 * @Date: 2020-04-10 17:28:56
 * @LastEditTime: 2020-04-11 20:17:07
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /vuebyvuex/src/App.vue
 -->
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/test.vue";

export default {
  name: "App",
  components: {
    HelloWorld
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
