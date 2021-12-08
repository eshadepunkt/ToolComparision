<template>
  <div id="ToolListBox">
    <v-list style="height: 72vh; overflow-y: auto">
      <v-item-group>
        <v-item v-for="item in getTools" :key="item.key">
          <ToolListItem :propToolKV="item" />
        </v-item>
      </v-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";
import { NIL as uuidNIL } from "uuid";

import * as Typ from "../../types/index";
import {
  mdiAccount,
  mdiPencil,
  mdiShareVariant,
  mdiDelete,
  mdiAppleKeyboardControl,
} from "@mdi/js";

import Vue from "vue";

import ToolListItem from "./ToolListItem.vue";

export default Vue.extend({
  name: "ToolListBox",

  components: {
    ToolListItem,
  },

  props: {
    tools: {
      type: Object as () => Array<Typ.toolKeyValue>,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
    };
  },

  //COMPUTED
  computed: {
    getTools: function (): Array<Typ.toolKeyValue> {
      return this.tools;
    },
  },
});
</script>
