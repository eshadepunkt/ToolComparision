import Navigation from "../components/Other/Navigation.vue";
import Workflow from "../components/Other/Workflow.vue";

import App from "../App.vue";

import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { component } from "vue/types/umd";
import { appState } from "@/types";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: App,
    name: "Start",
  },
  {
    path: "/Workflow/:workflow",
    component: Workflow,
    name: "Workflow",
  },

  {
    path: "/Start/",
    component: Navigation,
    name: "Navigation",
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
