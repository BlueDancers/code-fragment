<template>
  <div>
    <div>{{ data }}</div>
    <div>{{ pushdata }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  mounted() {
    setTimeout(() => {
      this.$mystore.commit("changeData", "变化");
    }, 1000);
    setTimeout(() => {
      this.$mystore.commit.call(this, "changeData", "再变化");
    }, 2000);
    this.$mystore.dispatch("asnycChangeData", "action变化");
  },
  computed: {
    data() {
      console.log(this.$mystore);
      return this.$mystore.state.data;
    },
    pushdata() {
      return this.$mystore.getters.pushdata;
    }
  }
});
</script>

<style scoped>
</style>