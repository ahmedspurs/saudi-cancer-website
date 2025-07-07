<template>
  <div
    class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4"
    dir="rtl"
  >
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <!-- PrimeVue Icon -->
      <i
        class="pi pi-exclamation-circle text-red-500 text-6xl mb-4"
        style="font-size: 75px"
      ></i>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">خطأ</h1>
      <p class="text-gray-600 mb-6">
        {{ errorMessage }}
      </p>
      <Button
        label="العودة إلى الصفحة الرئيسية"
        icon="pi pi-home"
        class="p-button-raised p-button-primary"
        @click="goHome"
      />
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import Button from "primevue/button";
import { computed } from "vue";

// Get route and router instances
const route = useRoute();
const router = useRouter();

// Map error codes to Arabic messages
const errorMessages = {
  not_authenticated: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة.",
  session_expired: "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.",
  server_error: "حدث خطأ في الخادم. يرجى المحاولة لاحقًا.",
  default: "حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.",
};

// Compute error message based on query parameter
const errorMessage = computed(() => {
  const errorCode = route.query.error || "default";
  return errorMessages[errorCode] || errorMessages.default;
});

// Navigate to home page
const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
/* Ensure RTL text alignment */
</style>
