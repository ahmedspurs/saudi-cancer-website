<template>
  <div class="container">
    <div class="flex-center mb-8">
      <h2 class="main-title text-center">الخدمات والبرامج</h2>
    </div>
    <div class="grid-3 gap-8">
      <div
        class="rounded-lg bg-secondary overflow-hidden"
        v-for="item in 3"
        :key="item"
      >
        <div class="h-64">
          <img
            src="/images/services.jpeg"
            class="h-full object-cover w-full"
            alt=""
          />
        </div>
        <div class="py-6 px-3">
          <h3 class="text-white text-lg mb-3">اسم الخدمة</h3>
          <p class="text-white">وصف الخدمة</p>
          <button
            class="text-primary bg-white rounded mt-3 py-2 font-semibold px-3 w-full"
          >
            التفاصيل
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
