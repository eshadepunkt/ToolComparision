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
  },
  getters: {
    getCriteria: (state) => {
      return state.criteria;
    },
    getCriterium: (state) => (key: string) => {
      const index: number = state.criteria.findIndex(x => x.key === key);
      if (index >= 0) {
        //LOG
        console.log("Vuex: criterium with key: " + key + " at index: " + index + " returned");

        return state.criteria[index];
      }  

      return null;
    },
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
        state.criteria.splice(index, 1);

        //LOG
        console.log("Vuex: criterium with key: " + item.key + " at index: " + index + " removed");
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
    extendCriteria(context, extend: Array<Typ.criteriumKeyValue>) {
      extend.forEach(element => {
        if (Typ.isCriteriumKV(element)) {
          if (this.getters.getCriterium(element.key) === null) {
            context.commit("addCriterium", element);
          }
        }   
      });
    },  
  }
})

export default store;
