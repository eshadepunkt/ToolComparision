import CriteriumCreation from "../components/Criterium/CriteriumCreation.vue";
import CriteriumListBox from "../components/Criterium/CriteriumListBox.vue";

import ToolCreation from "../components/Tool/ToolCreation.vue";
import ToolCriteriumSuitabilityCreation from "../components/Tool/ToolCriteriumSuitabilityCreation.vue";
import ToolListBox from "../components/Tool/ToolListBox.vue";

import ComparisionListBox from "../components/Other/ComparisionListBox.vue";

import App from "../App.vue";

import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { component } from "vue/types/umd";
import { appState } from "@/types";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
  },
  {
    path: "/CriteriumCreation/:mode/:id",
    component: CriteriumCreation,
    name: "CriteriumCreation",
  },
  {
    path: "/Criteria/",
    component: CriteriumListBox,
    name: "Criteria",
  },

  {
    path: "/Tools/",
    component: ToolListBox,
    name: "Tools",
  },
  {
    path: "/ToolCreation/:mode/:toolid",
    component: ToolCreation,
    name: "ToolCreation",
  },
  {
    path: "/ToolCriteriumSuitabilityCreation/:mode/:toolid/:criteriumid",
    component: ToolCriteriumSuitabilityCreation,
    name: "ToolCriteriumSuitabilityCreation",
  },

  {
    path: "/Comparision/",
    component: ComparisionListBox,
    name: "Comparision",
  },

  {
    path: "*",
    component: App,
    name: "Start",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
