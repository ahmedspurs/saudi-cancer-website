import { createApp } from "vue";
import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      baseUrl: "https://swges.org/",
      imageUrl: "https://images.lahn.sa/SWGESE/Images/",
      images: [
        "https://images.lahn.sa/SWGESE/Images/Specars/1.jpeg",
        "https://images.lahn.sa/SWGESE/Images/Specars/2.jpeg",
        "https://images.lahn.sa/SWGESE/Images/Specars/3.jpeg",
        "https://images.lahn.sa/SWGESE/Images/Specars/4.jpeg",
        "https://images.lahn.sa/SWGESE/Images/Specars/5.jpeg",
        "https://images.lahn.sa/SWGESE/Images/Specars/6.jpeg",
        "https://images.lahn.sa/SWGESE/Images/Specars/7.jpeg",
        "https://images.lahn.sa/SWGESE/Images/Specars/8.jpeg",
        "https://images.lahn.sa/SWGESE/Images/Specars/9.jpeg",
      ],
    };
  },
});

export default store;
