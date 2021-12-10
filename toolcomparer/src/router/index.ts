import Workflow from "../components/Other/Workflow.vue";

import ToolLastCreation from "../components/Tool/ToolLastCreationDialog.vue";
import ToolCriteriumSuitabilityCreation from "../components/Tool/ToolCriteriumSuitabilityCreationDialog.vue";

import Comparision from "../components/Comparision/Comparision.vue";

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
    path: "/Workflow/:workflow",
    component: Workflow,
    name: "Workflow",
  },
  {
    path: "/CriteriaFirst/ToolCreation/:mode/:toolid",
    component: ToolLastCreation,
    name: "ToolLastCreation",
  },
  {
    path: "/ToolCriteriumSuitabilityCreation/:mode/:toolid/:criteriumid",
    component: ToolCriteriumSuitabilityCreation,
    name: "ToolCriteriumSuitabilityCreation",
  },

  {
    path: "/Start/Comparision/",
    component: Comparision,
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
