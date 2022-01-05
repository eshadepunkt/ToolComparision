<template>
  <div id="Header">
    <v-card color="indigo darken-4">
      <h1 style="text-align: center; color: white">
        {{ headerText }}
      </h1>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Header",

  props: {
    headerText: {
      type: String,
    },
  },
});
</script>
