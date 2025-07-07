<template>
  <div>
    <div class="container grid-2 gap-8 items-start">
      <div class="relative p-8">
        <div
          class="border-4 flex flex-col h-[300px] justify-between items-start border-[#866EAF] rounded-lg py-6 px-2"
        >
          <div>
            <h2 class="section-title">معلومات صحية</h2>
            <p class="text-secondary text-lg">
              معاً لمجتمع ينعم بالصحة وجودة الحياة
            </p>
          </div>
          <div
            class="absolute h-[200px] overflow-hidden -end-12 rounded-xl bottom-0"
          >
            <img
              src="/images/services.jpeg"
              class="h-full w-full object-cover"
              alt=""
            />
          </div>
          <button
            class="px-12 py-2 rounded-lg bg-secondary text-white font-semibold"
          >
            المزيد
          </button>
        </div>
      </div>
      <div class="p-8">
        <div v-for="item in 3" class="flex items-center mb-4">
          <div class="h-[150px] overflow-hidden rounded-lg">
            <img
              src="/images/home-banner.jpeg"
              class="w-full h-full object-cover"
              alt=""
            />
          </div>
          <h2 class="font-bold ms-4 text-xl">عنوان المعلومة</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
