<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible" class="bg-secondary h-screen w-full">
      <template #container="{ closeCallback }">
        <div class="p-8">
          <button type="button" @click="closeCallback">
            <vue-feather
              class="transition"
              type="x"
              stroke="white"
              fill="white"
              size="30px"
            ></vue-feather>
          </button>

          <div
            class="items w-full mobile-menu transition flex flex-col items-center bg-secondary text-white rounded-2xl relative"
          >
            <div class="transition link flex flex-col items-center pt-6">
              <RouterLink
                @click="toggleMenu()"
                activeClass="text-secondary"
                class="text-tirnary font-semibold pb-4"
                to="/"
              >
                {{ $t("menu.home") }}
              </RouterLink>
              <RouterLink
                @click="toggleMenu()"
                to="/our-services"
                activeClass="text-secondary"
                class="text-tirnary font-semibold pb-4 mx-3"
              >
                {{ $t("menu.services") }}
              </RouterLink>
              <RouterLink
                @click="toggleMenu()"
                acitve-class="text-secondary"
                class="text-white font-semibold pb-4"
                to="/our-work"
              >
                {{ $t("menu.our_work") }}
              </RouterLink>
            </div>
            <div class="flex justify-between pb-6">
              <button class="btn-header ms-4 me-2">
                {{ $t("menu.contact") }}
              </button>
              <div class="icons mx-2 cursor-pointer">
                <div
                  @click="changeLocale('en')"
                  v-if="$i18n.locale == 'ar'"
                  class="flex items-center"
                >
                  <span class="text-tirnary font-bold me-1">EN</span>
                  <img
                    loading="lazy"
                    src="./../../assets/icons/language.svg"
                    class="object-contain w-full h-5"
                    alt=""
                  />
                </div>

                <div
                  @click="changeLocale('ar')"
                  v-else
                  class="flex items-center"
                >
                  <span class="text-tirnary font-bold me-1">AR</span>
                  <img
                    loading="lazy"
                    src="./../../assets/icons/language.svg"
                    class="object-contain w-full h-5"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Drawer>
    <Button icon="pi pi-bars" @click="visible = true" />
  </div>
</template>

<script>
import Drawer from "primevue/drawer";

export default {
  components: { Drawer },
  data() {
    return {
      menuStatus: false,
      visible: false,
    };
  },
  methods: {
    changeLocale(lang) {
      const html = document?.querySelector("html");

      if (lang == "ar") {
        localStorage.setItem("current_language", lang);
        this.$i18n.locale = "ar";
        document.body.dir = "rtl";
        html?.setAttribute("lang", "ar");
        // location.reload();
      } else {
        localStorage.setItem("current_language", lang);
        this.$i18n.locale = "en";
        document.body.dir = "ltr";
        html?.setAttribute("lang", "en");
        // location.reload();
      }
      if (this.$route.fullPath == "/our-services") {
        location.reload();
      }
      this.toggleMenu();
    },
  },
};
</script>

<style>
.transition {
  transition: all 0.2s ease !important;
}
.mobile-menu {
  direction: ltr !important   ;
}
.router-link-exact-active {
  color: #2e97f2;
}

.mobile-menu .router-link-exact-active {
  color: black;
}
</style>
