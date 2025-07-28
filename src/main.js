import { createApp } from "vue";
import { router } from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";
import ToastService from "primevue/toastservice";
import Button from "primevue/button";
import Toast from "primevue/toast";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import Image from "primevue/image";
import Drawer from "primevue/drawer";
import "primeicons/primeicons.css";
import "./theme/style.css";
import "./theme/index.css";
import "./theme/config.css";
import VueFeather from "vue-feather";
import { i18n } from "./i18n/index.js";
import store from "./store/index.js";
import VueCountdown from "@chenfengyuan/vue-countdown";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import AosVue from "aos-vue";
import App from "./App.vue";
import "@emran-alhaddad/saudi-riyal-font/index.css";

const globalOptions = {
  mode: "auto",
  defaultCountry: "SA",
};

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#f5f3fa",
      100: "#e9e5f4",
      200: "#d3cce8",
      300: "#b7a9d7",
      400: "#9d87c6",
      500: "#866eaf", // Primary color
      600: "#7a62a1",
      700: "#6b548e",
      800: "#594674",
      900: "#4a3a61",
      950: "#2e253d",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#ffffff", // Secondary color
      600: "#e6e6e6",
      700: "#d4d4d4",
      800: "#b3b3b3",
      900: "#999999",
      950: "#666666",
    },
    surface: {
      0: "#ffffff",
      50: "{zinc.50}",
      100: "{zinc.100}",
      200: "{zinc.200}",
      300: "{zinc.300}",
      400: "{zinc.400}",
      500: "{zinc.500}",
      600: "{zinc.600}",
      700: "{zinc.700}",
      800: "{zinc.800}",
      900: "{zinc.900}",
      950: "{zinc.950}",
    },
    danger: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626", // For cart badge
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#450a0a",
    },
    success: {
      50: "#f5f3fa", // Override green with primary palette
      100: "#e9e5f4",
      200: "#d3cce8",
      300: "#b7a9d7",
      400: "#9d87c6",
      500: "#866eaf",
      600: "#7a62a1",
      700: "#6b548e",
      800: "#594674",
      900: "#4a3a61",
      950: "#2e253d",
    },
    content: {
      background: "{surface.0}",
      color: "{surface.950}",
    },
    colorScheme: {
      light: {
        surface: {
          0: "#ffffff",
          50: "{zinc.50}",
          100: "{zinc.100}",
          200: "{zinc.200}",
          300: "{zinc.300}",
          400: "{zinc.400}",
          500: "{zinc.500}",
          600: "{zinc.600}",
          700: "{zinc.700}",
          800: "{zinc.800}",
          900: "{zinc.900}",
          950: "{zinc.950}",
        },
      },
      dark: {
        surface: {
          0: "#ffffff",
          50: "{slate.50}",
          100: "{slate.100}",
          200: "{slate.200}",
          300: "{slate.300}",
          400: "{slate.400}",
          500: "{slate.500}",
          600: "{slate.600}",
          700: "{slate.700}",
          800: "{slate.800}",
          900: "{slate.900}",
          950: "{slate.950}",
        },
      },
    },
  },
});

const app = createApp(App);

app.component("VueFeather", VueFeather);
app.component("VueCountdown", VueCountdown);
app.component("Button", Button);
app.component("Toast", Toast);
app.component("Image", Image);
app.component("ConfirmDialog", ConfirmDialog);
app.component("Drawer", Drawer);

app
  .use(router)
  .use(i18n)
  .use(store)
  .use(ConfirmationService)
  .use(ToastService)
  .use(AosVue)
  .use(VueTelInput, globalOptions)
  .use(PrimeVue, {
    theme: {
      preset: MyPreset, // Use MyPreset instead of Aura
      options: {
        prefix: "p",
        darkModeSelector: ".dark",
        cssLayer: false,
      },
    },
  })
  .mount("#app");
