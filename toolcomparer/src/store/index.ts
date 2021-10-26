
import Vue from "vue";
import Vuex from "vuex";

import * as Typ from "../types/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});

const criteriaStore = new Vuex.Store({
  state: {
    criteria: Array<Typ.criterium>(),
  },
  mutations: {
    addCriterium (state, item: Typ.criterium) {
      state.criteria.push(item);
    },
    removeCriterium (state, item: Typ.criterium) {
      const index: number = state.criteria.indexOf(item);
      state.criteria.slice(index, 1);
    },
  }
})
