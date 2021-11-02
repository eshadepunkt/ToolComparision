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
    uniqueID: 0 as number,
  },
  getters: {
    getCriteria: (state) => {
      return state.criteria;
    },
    getID: (state) => {
      return state.uniqueID;
    }
  },

  mutations: {
    addCriterium (state, item: Typ.criteriumKeyValue) {
      const cloned: Typ.criteriumKeyValue = JSON.parse(JSON.stringify(item)) as Typ.criteriumKeyValue;
      state.criteria.push(cloned);

      //LOG
      console.log("Vuex: criterium with key: " + item.key + " added");
    },
    removeCriterium (state, item: Typ.criteriumKeyValue) {
      const index: number = state.criteria.findIndex(x => x.key === item.key);
      if (index >= 0) {
        state.criteria = state.criteria.slice(index, 1);

        //LOG
        console.log("Vuex: criterium with key: " + item.key + " at index: " + index + " removed");
      }  
    },  
    incrementUniqueID(state) {
        ++(state.uniqueID);

        //LOG
        console.log("Vuex: unique id incremented to: " + state.uniqueID);
    }
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
