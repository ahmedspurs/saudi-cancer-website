<template>
  <div class="max-w-3xl mx-auto py-8 text-right">
    <h2 class="section-title mb-6">المؤسسون</h2>

    <div class="grid grid-cols-2 gap-x-6 gap-y-3">
      <div
        v-for="(founder, index) in founders"
        :key="'right-' + index"
        class="flex items-center justify-between"
      >
        <span
          class="text-purple-600 me-2 w-12 text-center font-bold border border-purple-400 rounded px-3 py-1 text-sm text-gray-700"
          >{{ founder.number }}</span
        >
        <span
          class="border w-full border-purple-400 rounded px-3 py-1 text-sm text-gray-700"
          >{{ founder.name }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const founders = Array.from({ length: 10 }, (_, i) => ({
  number: i + 1,
  name: "اسم المؤسس",
}));
</script>
