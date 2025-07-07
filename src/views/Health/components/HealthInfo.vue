<template>
  <div class="container mx-auto py-10 text-right">
    <h2 class="section-title mb-8">معلومات طبية</h2>

    <div class="flex flex-col md:flex-row items-center justify-between gap-6">
      <!-- Image -->
      <div class="md:w-1/2">
        <img
          :src="info.image"
          alt="medical info"
          class="w-full h-60 object-contain bg-gray-100"
        />
      </div>
      <!-- Text Content -->
      <div class="md:w-1/2 space-y-2">
        <h3 class="text-lg font-bold text-black">{{ info.title }}</h3>
        <p class="text-sm text-gray-700 whitespace-pre-line">
          {{ info.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        title: "معلومة طبية مهمة",
        description: "وصف بسيط عن المعلومة\nيأتي هنا",
        image: "/placeholder.png", // replace with actual medical image
      },
    };
  },
};
</script>
