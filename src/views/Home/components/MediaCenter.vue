<template>
  <div class="container rounded-xl bg-secondary p-8 items-center">
    <h2 class="!text-white section-title mb-6">المركز الاعلامي</h2>
    <div class="grid-2 gap-4 items-center">
      <div class="p-4 rounded-xl bg-white">
        <div class="h-[200px] w-full overflow-hidden rounded-lg">
          <img
            src="/images/main-logo.png"
            class="w-full h-full object-cover"
            alt=""
          />
        </div>
        <h2 class="text-xl font-semibold my-3">عنوان الخبر</h2>
        <p class="text-gray-600">تفاصيل الخبر هنا تكتب في هذا النص ادناه</p>
      </div>

      <div>
        <div
          v-for="item in 2"
          :key="item"
          class="p-4 rounded-xl bg-white flex flex-col md:flex-row md:items-center mb-4"
        >
          <div class="h-[100px] md:w-1/2 w-full overflow-hidden rounded-lg">
            <img
              src="/images/main-logo.png"
              class="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div class="ms-2 w-full">
            <h2 class="text-xl font-semibold my-3">عنوان الخبر</h2>
            <p class="text-gray-600">تفاصيل الخبر هنا تكتب في هذا النص ادناه</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
