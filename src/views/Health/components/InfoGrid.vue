<template>
  <div class="container mx-auto py-10 text-right">
    <h2 class="section-title mb-8">معلومات</h2>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
      <div
        v-for="(info, index) in infos"
        :key="index"
        class="flex flex-col items-center text-center space-y-2"
      >
        <div class="w-full h-52 overflow-hidden">
          <img
            :src="info.image"
            alt="معلومة"
            class="w-full h-full object-cover rounded-lg bg-gray-100"
          />
        </div>

        <div>
          <h3 class="font-bold text-xl mb-4">{{ info.title }}</h3>
          <p class="text-gray-600">{{ info.description }}</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 section-divider-lg">
      <div
        v-for="(info, index) in infos"
        :key="index"
        class="grid-2 gap-4 items-center space-x-4 rtl:space-x-reverse bg-white p-4 rounded-lg shadow-sm"
      >
        <div class="w-full h-36 overflow-hidden">
          <img
            :src="info.image"
            alt="معلومة"
            class="w-full h-full rounded-lg object-cover bg-gray-100"
          />
        </div>
        <div>
          <h3 class="font-bold text-base">{{ info.title }}</h3>
          <p class="text-gray-600">{{ info.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      infos: Array.from({ length: 4 }, () => ({
        title: "عنوان المعلومة",
        description: "الوصف يُكتب هنا",
        image: "/placeholder.png", // replace with actual image paths
      })),
    };
  },
};
</script>
