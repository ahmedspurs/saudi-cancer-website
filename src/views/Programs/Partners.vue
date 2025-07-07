<template>
  <div class="container mx-auto py-10 text-right">
    <h2 class="section-title mb-8">شركاؤنا</h2>

    <div class="grid-3 gap-8 justify-items-center">
      <div
        v-for="(partner, index) in partners"
        :key="index"
        class="w-40 h-40 mb-6 transform rotate-45 bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden"
      >
        <!-- Inside image should be rotated back to appear upright -->
        <img
          :src="partner.logo"
          alt="partner logo"
          class="w-20 h-20 object-contain transform -rotate-45"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      partners: Array.from({ length: 6 }, () => ({
        logo: "/placeholder.png", // Replace with actual logo URLs
      })),
    };
  },
};
</script>
