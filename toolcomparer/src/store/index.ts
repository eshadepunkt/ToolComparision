console.log("Load Vuex Store");

import Vue from "vue";
import Vuex from "vuex";

import * as Typ from "../types/index";

Vue.use(Vuex);
/*
export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});
*/
const store = new Vuex.Store({
  state: {
    criteria: Array<Typ.criteriumKeyValue>(),
    tools: Array<Typ.toolKeyValue>(),
  },
  getters: {
    getCriteria: (state) => {
      return state.criteria;
    },
    getCriterium: (state) => (key: string) => {
      const index: number = state.criteria.findIndex((x) => x.key === key);
      if (index != -1) {
        //LOG
        console.log(
          "Vuex: criterium with key: " +
            key +
            " at index: " +
            index +
            " returned"
        );

        return state.criteria[index];
      }

      return null;
    },
    getTools: (state) => {
      return state.tools;
    },
    getTool: (state) => (key: string) => {
      const index: number = state.tools.findIndex(x => x.key === key);
      if (index != -1) {
        //LOG
        console.log(
          "Vuex: tool with key: " +
            key +
            " at index: " +
            index +
            " returned"
        );

        return state.tools[index];
      }

      return null;
    },
    getIndexOf: (state) => (array: any, key: string) => {
      if (Array.isArray(array)) {
        const index: number = array.findIndex(x => x.key === key);
        return index;
      }

      return -1;
    }
  },

  mutations: {
    addCriterium(state, item: Typ.criteriumKeyValue) {
      const cloned: Typ.criteriumKeyValue = JSON.parse(
        JSON.stringify(item)
      ) as Typ.criteriumKeyValue;
      state.criteria.push(cloned);

      //LOG
      console.log("Vuex: criterium with key: " + item.key + " added");
    },
    removeCriterium(state, item: Typ.criteriumKeyValue) {
      const index: number = state.criteria.findIndex(x => x.key === item.key);
      if (index !== -1) {
        state.criteria.splice(index, 1);

        //LOG
        console.log(
          "Vuex: criterium with key: " +
            item.key +
            " at index: " +
            index +
            " removed"
        );
      }
    },
    addTool(state, item: Typ.toolKeyValue) {
      const cloned: Typ.toolKeyValue = JSON.parse(
        JSON.stringify(item)
      ) as Typ.toolKeyValue;
      state.tools.push(cloned);

      //LOG
      console.log("Vuex: tool with key: " + item.key + " added");
    },
    removeTool(state, item: Typ.toolKeyValue) {
      const index: number = state.tools.findIndex(x => x.key === item.key);
      if (index !== -1) {
        state.tools.splice(index, 1);

        //LOG
        console.log(
          "Vuex: tool with key: " +
            item.key +
            " at index: " +
            index +
            " removed"
        );
      }
    },
    appendToolCriteriumSuitabilities(state, payload: {toolKV: Typ.toolKeyValue, criteriumSuitability: Typ.toolCriteriumSuitability}) {
      const index: number = state.tools.findIndex(x => x.key === payload.toolKV.key);
      if (index != -1) {
          state.tools[index].value.criteriaSuitabilities.push(payload.criteriumSuitability);

          //LOG
          console.log(
            "Vuex: tool with key: " +
            state.tools[index].key +
              " at index: " +
              index +
              " appended"
          );
      }
    },
  },
  actions: {
    updateCriterium(context, item: Typ.criteriumKeyValue) {
      context.commit("removeCriterium", item);
      context.commit("addCriterium", item);

      //LOG
      console.log("Vuex: criterium with key: " + item.key + " updated");
    },
    extendCriteria(context, extend: Array<Typ.criteriumKeyValue>) {
      extend.forEach((element) => {
        if (Typ.isCriteriumKV(element)) {
          if (this.getters.getCriterium(element.key) === null) {
            context.commit("addCriterium", element);
          }
        }
      });
    },

    updateTool(context, item: Typ.toolKeyValue) {
      context.commit("removeTool", item);
      context.commit("addTool", item);

      //LOG
      console.log("Vuex: tool with key: " + item.key + " updated");
    },
    
    extendTools(context, extend: Array<Typ.toolKeyValue>) {
      extend.forEach((element) => {
        if (Typ.isToolKV(element)) {
          if (this.getters.getCriterium(element.key) === null) {
            context.commit("addTool", element);
          }
        }
      });
    },
  },
});

export default store;
