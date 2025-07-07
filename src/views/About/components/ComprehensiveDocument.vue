<template>
  <div class="container mx-auto py-10">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
      <div
        v-for="(book, index) in books"
        :key="index"
        class="grid-2 items-center border border-purple-400 rounded-xl p-4 w-full max-w-md"
      >
        <!-- Book Image -->
        <div
          class="w-full h-32 bg-gray-100 border border-gray-300 rounded-md bg-center bg-cover"
          :style="`background-image: url('${book.image}')`"
        ></div>

        <!-- Book Info -->
        <div class="flex flex-col justify-between ms-2">
          <h3 class="font-bold text-lg">{{ book.title }}</h3>
          <p class="text-sm text-gray-500">{{ book.description }}</p>
          <button
            class="mt-2 px-4 py-1 w-full rounded-full bg-purple-400 text-white text-sm hover:bg-purple-500"
          >
            كتاب الكتروني
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      books: [
        {
          title: "اسم الكتاب",
          description: "وصف الكتاب",
          image: "/placeholder.png", // replace with actual image or keep placeholder
        },
        {
          title: "اسم الكتاب",
          description: "وصف الكتاب",
          image: "/placeholder.png",
        },
      ],
    };
  },
};
</script>
