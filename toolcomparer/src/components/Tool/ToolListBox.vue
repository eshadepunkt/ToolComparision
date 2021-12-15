<template>
  <div id="ToolListBox">
    <v-list>
      <v-item-group>
        <v-item v-for="item in getTools" :key="noSecHash(item)">
          <ToolListItem :propToolKV="item" />
        </v-item>
      </v-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { v4 as uuidv4 } from "uuid";
import { NIL as uuidNIL } from "uuid";
import { sha1 as noSecHash } from "object-hash";

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
      type: Array as () => Array<Typ.toolKeyValue>,
    },
    criteria: {
      type: Array as () => Array<Typ.criteriumKeyValue>,
    },
  },

  //DATA
  data() {
    return {
      uuidNIL,
      noSecHash,
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
