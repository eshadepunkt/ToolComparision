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
    uniqueKey: 0 as number,
  },
  getters: {
    getUniqueKey: (state) => {
      return ++(state.uniqueKey);
    },
    getCriteria: (state) => {
      return state.criteria;
    },
  },

  mutations: {
    addCriterium (state, item: Typ.criteriumKeyValue) {
      state.criteria.push(item);

      //LOG
      console.log("Vuex: criterium with key: " + item.key + " added");
    },
    removeCriterium (state, item: Typ.criteriumKeyValue) {
      const index: number = state.criteria.findIndex(x => x.key === item.key);
      if (index >= 0) {
        state.criteria.slice(index, 1);

        //LOG
        console.log("Vuex: criterium with key: " + item.key + " removed");
      }  
    },  
  },
  actions: {
    updateCriterium (context, item: Typ.criteriumKeyValue) {
      context.commit("removeCriterium", item);
      context.commit("addCriterium", item);

      //LOG
      console.log("Vuex: criterium with key: " + item.key + " updated");
    },
  }
})

export default store;
