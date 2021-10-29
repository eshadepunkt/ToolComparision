<template>

<div id="App" style="background-color: #FAFAFA">
  <v-app>
    <v-card
      color="grey lighten-5">

      <CriteriumCreation />
    </v-card>    
  </v-app>
</div>
  
</template>

<script lang="ts">
console.log("Load App.vue");
console.dir();


import Vue from 'vue';

import CriteriumCard from "./components/CriteriumCard.vue";
import CriteriumCreation from "./components/CriteriumCreation.vue";

//import Tst from "./components/Tst.vue";

export default Vue.extend({
  name: "App",

  components: {
    CriteriumCard,
    CriteriumCreation,
    //Tst,
  },

  data: () => ({
    //
  }),
});
</script>
