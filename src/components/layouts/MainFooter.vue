<template>
  <footer class="bg-secondary text-white">
    <div
      class="max-w-7xl mx-auto py-20 px-4 grid grid-cols-1 md:grid-cols-4 container gap-4 text-center md:text-start"
    >
      <!-- Column 1: Logo -->
      <div class="flex justify-center md:justify-start items-center">
        <img
          src="/images/main-logo-white.png"
          alt="Saudi Cancer Foundation"
          class="h-32"
        />
      </div>

      <!-- Dynamic Columns -->
      <div v-for="(section, index) in footerLinks" :key="index">
        <h3 class="font-bold mb-3">{{ section.title }}</h3>
        <ul class="space-y-1">
          <li v-for="(link, idx) in section.links" :key="idx">
            <router-link
              v-if="link.internal"
              :to="link.href"
              class="hover:underline"
            >
              {{ link.label }}
            </router-link>
            <a
              v-else
              :href="link.href"
              class="hover:underline"
              target="_blank"
              rel="noopener"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="h-1 bg-white"></div>
    <div
      class="bg-secondary text-sm container py-4 px-4 flex flex-col md:flex-row items-center justify-between"
    >
      <a href="https://lahn.sa" target="_blank" class="h-[50px] mb-3">
        <Image
          src="/images/white-footer-logo.png"
          imageClass="w-full h-full object-contain"
        />
      </a>
      <SocialMedia class="mt-3" color="white" />
    </div>
  </footer>
</template>

<script setup>
import Image from "primevue/image";
import SocialMedia from "../SocialMedia.vue";

const footerLinks = [
  {
    title: "الجمعية",
    links: [
      {
        label: "عن الجمعية",
        href: "https://www.scf.org.sa/#/about",
        internal: true,
      },
      {
        label: "موقع جمع التبرعات",
        href: "https://donate.scf.org.sa",
        internal: false,
      },
      {
        label: "الرؤية الشاملة",
        href: "https://www.scf.org.sa/#/about",
        internal: true,
      },
      {
        label: "الحوكمة",
        href: "https://www.scf.org.sa/#/governance",
        internal: true,
      },
    ],
  },
  {
    title: "المركز الإعلامي",
    links: [
      {
        label: "الأخبار",
        href: "https://www.scf.org.sa/#/news-page",
        internal: true,
      },
      {
        label: "الصور",
        href: "https://www.scf.org.sa/#/gallery",
        internal: true,
      },
      {
        label: "الفيديوهات",
        href: "https://www.scf.org.sa/#/videos",
        internal: true,
      },
    ],
  },
  {
    title: "تواصل معنا",
    links: [
      {
        label: "اتصل بنا",
        href: "https://www.scf.org.sa/#/contact",
        internal: true,
      },
      { label: "واتس آب", href: "https://wa.me/966xxxxxxxxx", internal: false },
    ],
  },
];
</script>
