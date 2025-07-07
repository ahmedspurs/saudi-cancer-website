<template>
  <section class="py-10">
    <div class="container">
      <h2 class="section-title mb-6">الفيديوهات</h2>

      <!-- Grid layout -->
      <div class="grid-3 gap-6 rtl">
        <div
          v-for="(video, index) in videoList"
          :key="index"
          class="grid-2 items-center gap-2"
        >
          <div
            class="w-full h-28 aspect-square bg-gray-100 rounded shadow-md flex items-center justify-center"
          >
            <!-- Placeholder for video thumbnail -->
            <svg
              class="w-12 h-12 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm5 4.5l5 3.5-5 3.5v-7z"
              />
            </svg>
          </div>
          <h3 class="text-sm font-bold">عنوان الفيديو</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const videoList = Array.from({ length: 12 });
</script>
