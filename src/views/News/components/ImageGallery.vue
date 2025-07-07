<template>
  <section class="py-12">
    <div class="container mx-auto text-right rtl">
      <h2 class="section-title mb-6">الصور</h2>

      <!-- Masonry Layout -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[100px]">
        <div
          v-for="(img, index) in images"
          :key="index"
          :class="img.class"
          class="bg-gray-100 rounded-lg overflow-hidden"
        >
          <!-- Placeholder content or actual image -->
          <div class="w-full h-full bg-white/30"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Sample layout variations
const images = [
  { class: "col-span-2 row-span-1" },
  { class: "col-span-1 row-span-2" },
  { class: "col-span-1 row-span-2" },
  { class: "col-span-2 row-span-2" },
  { class: "col-span-1 row-span-1" },
  { class: "col-span-1 row-span-1" },
  { class: "col-span-1 row-span-1" },
  { class: "col-span-1 row-span-1" },
  { class: "col-span-2 row-span-2" },
];
</script>
