import CriteriumCreation from "../components/CriteriumCreation.vue";
import CriteriumListBox from "../components/CriteriumListBox.vue";

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
    path: "*",
    component: App,
    name: "Start",
  },
];

const router = new VueRouter({
  routes,
});

export default router;
