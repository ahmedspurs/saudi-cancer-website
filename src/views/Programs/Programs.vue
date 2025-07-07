<template>
  <div class="container mx-auto py-10 text-right">
    <h2 class="text-2xl font-bold text-purple-700 mb-6">برامجنا</h2>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <div
        v-for="(program, index) in programs"
        :key="index"
        class="relative border rounded-lg overflow-hidden shadow-sm"
      >
        <!-- Custom Ribbon -->
        <div class="absolute top-0 end-0 w-6 h-10 bg-purple-500">
          <div
            class="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[10px] border-t-white absolute bottom-0 left-0 rotate-180"
          ></div>
        </div>

        <!-- Program Image -->
        <div
          class="w-full h-40 bg-gray-100 bg-center bg-cover"
          :style="`background-image: url('${program.image}')`"
        ></div>

        <!-- Info Box -->
        <div class="bg-gray-100 p-4">
          <h3 class="font-bold text-sm">{{ program.title }}</h3>
          <p class="text-xs text-gray-600 mt-1">{{ program.description }}</p>
        </div>
        <div class="flex justify-end bg-gray-100">
          <div
            class="bg-white w-1/2 rounded-xl rounded-b-none rounded-tl-none overflow-hidden p-1 pb-0 pe-0 flex-center"
          >
            <button
              class="bg-purple-500 w-full text-white text-sm py-2 rounded-lg px-4 hover:bg-purple-600 transition"
            >
              تبرع الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      programs: Array.from({ length: 8 }, () => ({
        title: "اسم البرنامج",
        description: "وصف البرنامج المختصر هنا",
        image: "/placeholder.png", // replace with your image path
      })),
    };
  },
};
</script>
