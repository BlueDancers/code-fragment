import Vue, { ComponentOptions } from "vue";
declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    myStore?: any;
  }
}

declare module "vue/types/vue" {
  interface Vue {
    $mystore: any;
  }
}
