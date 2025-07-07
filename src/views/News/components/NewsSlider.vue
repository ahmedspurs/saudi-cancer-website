<template>
  <section class="py-12">
    <div class="container mx-auto text-right">
      <!-- Section Title -->
      <h2 class="section-title mb-6">الأخبار</h2>

      <!-- Swiper -->
      <swiper
        :slides-per-view="4"
        :space-between="20"
        :navigation="navigation"
        :modules="modules"
        class="rtl"
        :breakpoints="{
          1024: { slidesPerView: 4 },
          768: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }"
      >
        <swiper-slide
          v-for="(item, index) in newsList"
          :key="index"
          class="text-start"
        >
          <h3 class="font-bold border-b pb-1 mb-3">عنوان الخبر</h3>
          <div class="bg-gray-100 h-40 w-full mb-4"></div>
          <p class="text-sm">
            تفاصيل الخبر تكتب <br />
            <a href="#" class="text-sky-600 font-medium">المزيد</a>
          </p>
        </swiper-slide>

        <!-- Navigation Buttons -->
        <div class="flex justify-center gap-4 mt-6">
          <button
            class="swiper-button-prev me-4 group bg-purple-100 hover:bg-purple-500 text-black hover:text-white transition-colors duration-300 p-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></button>

          <button
            class="swiper-button-next group bg-purple-100 hover:bg-purple-500 text-black hover:text-white transition-colors duration-300 p-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></button>
        </div>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules"; // Import Navigation module
import "swiper/css";
import "swiper/css/navigation";

const newsList = Array.from({ length: 8 }, (_, i) => ({
  title: "عنوان الخبر",
  image: "", // placeholder or actual image
  details: "تفاصيل الخبر تكتب",
}));

// Define navigation configuration
const navigation = {
  nextEl: ".swiper-button-next",
  prevEl: ".swiper-button-prev",
};

// Register Swiper modules
const modules = [Navigation];
</script>

<style scoped>
/* Ensure navigation buttons are styled correctly */
/* Already scoped, but you can leave most design inside Tailwind utility classes. */
.swiper-button-prev,
.swiper-button-next {
  position: relative;
  top: auto;
  width: 50px;
  height: 50px;
  margin-top: 0;
}

/* Prevent unwanted flipping in RTL */
.rtl .swiper-button-prev,
.rtl .swiper-button-next {
  transform: none;
}
</style>
