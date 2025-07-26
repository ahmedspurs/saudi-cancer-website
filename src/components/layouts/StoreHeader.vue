<template>
  <header class="w-full transition">
    <div class="container flex items-center justify-between py-4">
      <!-- Mobile Header -->
      <div class="container grid grid-cols-3 items-center md:hidden w-full">
        <button
          class="text-white bg-secondary justify-self-start rounded-lg text-sm px-5 py-4 hover:bg-purple-700 transition-colors"
          type="button"
          @click="drawerVisible = !drawerVisible"
        >
          <i class="fa-solid fa-bars text-xl"></i>
        </button>
        <div class="h-[90px] justify-self-center">
          <router-link to="/">
            <img
              src="/images/main-logo.png"
              class="w-full h-full object-contain object-right"
              alt="Logo"
            />
          </router-link>
        </div>
        <div class="relative justify-self-end flex items-center gap-4">
          <router-link to="/profile" class="relative">
            <i
              class="fa-solid fa-user text-secondary text-xl hover:text-purple-900 transition-colors"
            ></i>
          </router-link>
          <div class="relative">
            <router-link to="/profile" class="relative">
              <i
                class="fa-solid fa-cart-shopping text-secondary text-xl hover:text-purple-900 transition-colors"
              ></i>
              <span
                v-if="count > 0"
                class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
              >
                {{ count }}
              </span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Desktop Header -->
      <div class="hidden md:flex container justify-between items-center">
        <div class="h-[90px]">
          <img
            src="/images/main-logo.png"
            class="w-full h-full object-contain object-right"
            alt="Logo"
          />
        </div>
        <nav class="flex items-center font-semibold text-primary">
          <span v-for="link in mainNavLinks" :key="link.text">
            <router-link
              :to="link?.to"
              v-if="!link?.external"
              class="me-4 text-secondary hover:text-purple-700 transition-colors"
            >
              {{ link?.text }}
            </router-link>
            <a
              :href="link?.to"
              target="_blank"
              v-else
              class="me-4 text-secondary hover:text-purple-700 transition-colors"
            >
              {{ link?.text }}
            </a>
          </span>
        </nav>
        <div class="relative flex items-center gap-4">
          <router-link to="/profile" class="relative">
            <i
              class="fa-solid fa-user text-purple-700 text-xl hover:text-purple-900 transition-colors"
            ></i>
          </router-link>
          <router-link to="/cart" class="relative">
            <i
              class="fa-solid fa-cart-shopping text-secondary text-xl hover:text-purple-900 transition-colors"
            ></i>
            <span
              v-if="count > 0"
              class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
            >
              {{ count }}
            </span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Desktop Secondary Navigation -->
    <div class="bg-secondary w-[80%] mx-auto rounded-2xl hidden md:block py-4">
      <div class="container flex justify-between">
        <nav class="flex items-center font-semibold text-white">
          <span v-for="link in secondaryNavLinks" :key="link.text">
            <router-link
              :to="link.to"
              class="me-6 !text-white hover:text-purple-700 flex items-center transition-colors"
            >
              <i :class="link.icon" class="me-2"></i>
              {{ link.text }}
            </router-link>
          </span>
        </nav>
        <div class="flex items-center gap-3">
          <SocialMedia color="white" />
        </div>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <Drawer
      v-model:visible="drawerVisible"
      position="left"
      :modal="true"
      class="w-4/5 max-w-sm bg-secondary shadow-2xl"
    >
      <div class="flex flex-col h-full bg-secondary">
        <div
          class="flex justify-between items-center p-4 border-b border-purple-500"
        >
          <div class="h-[60px]">
            <img
              src="/images/main-logo-white.png"
              class="h-full object-contain"
              alt="Logo"
            />
          </div>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <nav class="flex flex-col font-semibold text-white mb-6">
            <div class="w-full py-3 border-b border-purple-500">
              <span class="text-lg font-bold">القائمة الرئيسية</span>
            </div>
            <router-link
              v-for="link in mainNavLinks"
              :key="link.text"
              :to="link.to"
              class="py-3 text-white hover:bg-purple-600 hover:text-white rounded-lg px-3 transition-all duration-300"
              @click="drawerVisible = false"
            >
              {{ link.text }}
            </router-link>
          </nav>
          <nav class="flex flex-col font-semibold text-white">
            <div class="w-full py-3 border-b border-purple-500">
              <span class="text-lg font-bold">التبرعات</span>
            </div>
            <router-link
              v-for="link in secondaryNavLinks"
              :key="link.text"
              :to="link.to"
              class="py-3 text-white hover:bg-purple-600 hover:text-white rounded-lg px-3 transition-all duration-300 flex items-center"
              @click="drawerVisible = false"
            >
              <i :class="link.icon" class="me-3"></i>
              {{ link.text }}
            </router-link>
          </nav>
        </div>
        <div class="p-4 border-t border-purple-500">
          <div class="flex justify-center gap-4">
            <SocialMedia color="white" />
          </div>
          <router-link
            to="/profile"
            class="flex items-center justify-center mt-4 text-white hover:bg-purple-600 rounded-lg p-3 transition-colors"
            @click="drawerVisible = false"
          >
            <i class="fa-solid fa-user me-2"></i>
            <span>{{ user?.name || "الملف الشخصي" }}</span>
          </router-link>
        </div>
      </div>
    </Drawer>
  </header>
</template>

<script setup>
import Drawer from "primevue/drawer";
import { ref } from "vue";
import SocialMedia from "../SocialMedia.vue";

const drawerVisible = ref(false);
const count = ref(0);
const user = JSON.parse(localStorage.getItem("user_data") || "{}");

const mainNavLinks = [
  { text: "الرئيسية", to: "/" },
  { text: "موقع المنظمة", to: "https://scf.org.sa", external: true },
  { text: "الحسابات البنكية", to: "/bank-accounts" },
  { text: "تواصل معنا", to: "/contact" },
];

const secondaryNavLinks = [
  {
    text: "حالات كبرى",
    to: "/donation-cases/major",
    icon: "fa-solid fa-heart",
  },
  {
    text: "حالات صغرى",
    to: "/donation-cases/minor",
    icon: "fa-solid fa-hand-holding-heart",
  },
  {
    text: "حالات عاجلة",
    to: "/donation-cases/urgent",
    icon: "fa-solid fa-ambulance",
  },
  { text: "الاهدائات", to: "/gift-donation", icon: "fa-solid fa-gift" },
];

const socialLinks = [
  { icon: "fa-brands fa-snapchat", url: "#" },
  { icon: "fa-brands fa-instagram", url: "#" },
  { icon: "fa-brands fa-x-twitter", url: "#" },
  { icon: "fa-solid fa-envelope", url: "#" },
];
</script>

<style scoped>
.transition {
  transition: all 0.3s ease;
}

.router-link-exact-active {
  color: #ccc;
  font-weight: 700;
  position: relative;
}

.router-link-exact-active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #ccc;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}
</style>
