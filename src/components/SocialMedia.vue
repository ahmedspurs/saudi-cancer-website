<template>
  <div>
    <div class="flex flex-col">
      <div v-if="socialMediaLinks.length > 0" class="flex justify-center">
        <!-- Dynamic Social Media Icons for Mobile -->
        <a
          v-for="social in socialMediaLinks"
          :key="social.type"
          :href="social.url"
          target="_blank"
          class="transition-colors me-2 duration-300 hover:text-teal-700"
          :style="{ color: color }"
        >
          <i :class="social.icon"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import request from "../services/request"; // Adjust the path to your request service
import NoData from "./NoData.vue"; // Adjust the path to your NoData component

const props = defineProps({
  color: {
    type: String,
    default: "#000000", // Default color if not provided
  },
});

const socialMediaLinks = ref([]);

// Mapping of social media types to Font Awesome icons with toLowerCase
const iconMap = {
  facebook: "fab fa-facebook-f",
  instagram: "fab fa-instagram",
  twitter: "fab fa-x-twitter",
  email: "fas fa-envelope",
  linkedin: "fab fa-linkedin-in",
  youtube: "fab fa-youtube",
  tiktok: "fab fa-tiktok",
  snapchat: "fab fa-snapchat-ghost",
  whatsapp: "fab fa-whatsapp",
  telegram: "fab fa-telegram-plane",
  pinterest: "fab fa-pinterest-p",
  reddit: "fab fa-reddit-alien",
  discord: "fab fa-discord",
  slack: "fab fa-slack",
  github: "fab fa-github",
  vimeo: "fab fa-vimeo-v",
  twitch: "fab fa-twitch",
};

// Convert iconMap keys to lowercase for case-insensitive matching
const lowercaseIconMap = Object.fromEntries(
  Object.entries(iconMap).map(([key, value]) => [key.toLowerCase(), value])
);

const getSocialMediaLinks = async () => {
  try {
    const res = await request.get("social-media-links");
    socialMediaLinks.value =
      res.data?.map((item) => ({
        type: item.platform.toLowerCase(), // Convert type to lowercase
        url: item.url,
        icon: lowercaseIconMap[item.platform.toLowerCase()] || "fas fa-link", // Use lowercase type
      })) || [];
  } catch (error) {
    socialMediaLinks.value = []; // Set to empty array on error to trigger NoData
  }
};

onMounted(() => {
  getSocialMediaLinks();
});
</script>

<style scoped>
/* Ensure Font Awesome icons are styled properly */
i {
  font-size: 1.5rem; /* Adjust icon size as needed */
}
</style>
