<template>

<div id="App">
<v-app>
    App
    <CriteriumCard />

    <Tst />
    

  </v-app>
</div>
  
</template>

<script lang="ts">
console.log("Load App.vue");
console.dir();


import Vue from 'vue';

import CriteriumCard from "./components/CriteriumCard.vue";

import Tst from "./components/Tst.vue";

export default Vue.extend({
  name: "App",

  components: {
    CriteriumCard,
    Tst,
  },

  data: () => ({
    //
  }),
});
</script>
