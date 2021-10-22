import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {},
});

const criteriaStore = new Vuex.Store({
  state: {
    criteria: Array
  },
  mutations: {
    addItem (item) {
      this.criteria.add(item);
    },
    removeItem (item) {
      this.criteria.remove(item);
    },
    updateItem (oldItem, newItem) {
       
    }
  }
})
