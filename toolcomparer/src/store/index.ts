
import Vue from "vue";
import Vuex from "vuex";

import "../../types/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});

const criteriaStore = new Vuex.Store({
  state: {
    criteria: Array<criterium>(),
  },
  mutations: {
    addCriterium (state, item: criterium) {
      state.criteria.push(item);
    },
    removeCriterium (state, item: criterium) {
      let index: number = state.criteria.indexOf(item);
      state.criteria.slice(index, 1);
    },
  }
})
