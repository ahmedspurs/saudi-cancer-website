import { createApp } from "vue";
import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      baseUrl: "http://localhost:3030/",
      // baseUrl: "https://api.ratlclinic.com/",
    };
  },
});

export default store;
