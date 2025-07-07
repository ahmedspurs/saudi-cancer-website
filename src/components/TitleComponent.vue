<template>
  <div class="flex items-center">
    <span class="w-16 h-8 me-2 bg-purple-400 rounded-e-full"></span>
    <span class="main-title-b">{{ title }}</span>
  </div>
</template>

<script setup>
defineProps({
  title: String, // تمرير العنوان كـ prop
});
</script>
