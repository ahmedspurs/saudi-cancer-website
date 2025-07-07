<template>
  <div class="container mx-auto py-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="(employee, index) in employees"
        :key="index"
        class="border border-purple-300 rounded-lg p-4 text-center"
      >
        <div
          class="w-24 h-24 mx-auto rounded-full border border-gray-400 bg-gray-100 bg-[url('/your-placeholder.png')] bg-center bg-cover"
        ></div>
        <h3 class="font-semibold mt-4">{{ employee.name }}</h3>
        <p class="text-sm text-gray-500">{{ employee.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      employees: [
        { name: "اسم الموظف", title: "مسمي الوظيفة" },
        { name: "اسم الموظف", title: "مسمي الوظيفة" },
        { name: "اسم الموظف", title: "مسمي الوظيفة" },
        { name: "اسم الموظف", title: "مسمي الوظيفة" },
        { name: "اسم الموظف", title: "مسمي الوظيفة" },
        { name: "اسم الموظف", title: "مسمي الوظيفة" },
      ],
    };
  },
};
</script>

<style scoped>
/* Optional: add checkered background with CSS if you don't want to use a real image */
.bg-placeholder {
  background-image: repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%);
  background-size: 20px 20px;
}
</style>
