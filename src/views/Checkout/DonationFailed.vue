<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 p-6"
    dir="rtl"
  >
    <div class="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
      <!-- ❌ أيقونة فشل -->
      <div class="text-red-500 text-5xl mb-4">
        <i class="fas fa-times-circle"></i>
      </div>

      <!-- ❌ العنوان -->
      <h2 class="text-xl font-bold text-red-600 mb-2">فشل في عملية التبرع</h2>
      <p class="text-gray-600 mb-6">
        حدث خطأ أثناء معالجة التبرع. الرجاء المحاولة مرة أخرى لاحقًا.
      </p>

      <!-- ✅ الأزرار -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md w-full sm:w-auto"
        >
          إعادة المحاولة
        </button>
        <button
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md w-full sm:w-auto"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// يمكن لاحقاً ربط الأزرار بالتوجيه عبر vue-router
</script>

<style scoped>
/* تأكد من تضمين Font Awesome */
</style>
