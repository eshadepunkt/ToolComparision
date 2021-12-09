import Workflow from "../components/Other/Workflow.vue";

import CriteriumFirstCreation from "../components/Criterium/CriteriumFirstCreation.vue";
import CriteriumListBox from "../components/Criterium/CriteriumListBox.vue";

import ToolLastCreation from "../components/Tool/ToolLastCreation.vue";
import ToolCriteriumSuitabilityCreation from "../components/Tool/ToolCriteriumSuitabilityCreation.vue";
import ToolListBox from "../components/Tool/ToolListBox.vue";

import ComparisionDataIterator from "../components/Comparision/ComparisionDataIterator.vue";
import ComparisionDataTable from "../components/Comparision/ComparisionDataTable.vue";

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
    path: "/CriteriaFirst/CriteriumCreation/:mode/:id",
    component: CriteriumFirstCreation,
    name: "CriteriumFirstCreation",
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
    path: "/Comparision/DataIterator/",
    component: ComparisionDataIterator,
    name: "ComparisionDataIterator",
  },

  {
    path: "/Comparision/DataTable/",
    component: ComparisionDataTable,
    name: "ComparisionDataTable",
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
