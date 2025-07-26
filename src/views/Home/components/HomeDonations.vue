<template>
  <div class="container">
    <!-- العنوان -->
    <h2 class="section-title mb-4">فرص التبرع</h2>

    <!-- البطاقات -->
    <div class="grid-4 gap-8">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-white rounded-xl flex flex-col justify-between"
      >
        <!-- صورة أو محتوى وهمي -->
        <div
          class="bg-gray-100 h-60 rounded-t-lg flex items-end justify-end"
          style="
            background-image: url(/images/main-logo.png);
            background-size: cover;
          "
        >
          <div
            class="bg-white rounded-xl rounded-b-none rounded-tl-none overflow-hidden p-1 pb-0 pe-0 flex-center"
          >
            <button
              class="bg-purple-500 text-white text-sm py-2 rounded-lg px-4 hover:bg-purple-600 transition"
            >
              تبرع الآن
            </button>
          </div>
        </div>

        <!-- زر التبرع -->
      </div>
    </div>
  </div>
</template>
