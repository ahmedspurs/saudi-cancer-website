<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 p-6"
    dir="rtl"
  >
    <Toast />
    <div
      class="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center"
      v-if="!isLoading"
    >
      <!-- Loading state -->
      <div
        v-if="isProcessing"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        ></div>
      </div>

      <!-- Success state -->
      <template v-if="paymentStatus === 'success'">
        <div class="text-green-500 text-5xl mb-4">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2 class="text-xl font-bold text-purple-700 mb-2">تم التبرع بنجاح!</h2>
        <p class="text-gray-600 mb-6">
          شكرًا لك على مساهمتك الكريمة
          <span v-if="paymentId"> (رقم العملية: {{ paymentId }})</span>
        </p>

        <!-- Receipt and Home buttons -->
        <div class="space-y-4">
          <Button
            label="عرض الإيصال"
            icon="pi pi-file"
            class="p-button w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            :disabled="isProcessing"
            @click="viewReceipt"
          />
          <router-link to="/" custom v-slot="{ navigate }">
            <Button
              label="العودة إلى الرئيسية"
              class="p-button p-button-secondary w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold"
              @click="navigate"
            />
          </router-link>
        </div>

        <!-- Rating section -->
        <div class="mt-8">
          <p class="mb-2 font-medium text-gray-700">ما رأيك في تجربتك؟</p>
          <div class="flex justify-center gap-1">
            <button
              v-for="n in 5"
              :key="n"
              @click="submitRating(n)"
              class="text-2xl transition-colors duration-200"
              :class="n <= rating ? 'text-yellow-400' : 'text-gray-300'"
              :disabled="isProcessing"
            >
              ★
            </button>
          </div>
        </div>
      </template>

      <!-- Error state -->
      <template v-else>
        <div class="text-red-500 text-5xl mb-4">
          <i class="fas fa-times-circle"></i>
        </div>
        <h2 class="text-xl font-bold text-red-700 mb-2">فشل عملية الدفع</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        <router-link to="/cart" custom v-slot="{ navigate }">
          <Button
            label="حاول مرة أخرى"
            icon="pi pi-refresh"
            class="p-button w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            @click="navigate"
          />
        </router-link>
      </template>
    </div>

    <!-- Loading skeleton -->
    <div
      v-else
      class="bg-white shadow-md rounded-lg p-8 w-full max-w-md animate-pulse"
    >
      <div class="h-12 bg-gray-200 rounded-full mb-4"></div>
      <div class="h-6 bg-gray-200 rounded mb-2"></div>
      <div class="h-4 bg-gray-200 rounded mb-6"></div>
      <div class="h-10 bg-gray-200 rounded-md"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import request from "../../services/request";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const rating = ref(0);
const isLoading = ref(true);
const isProcessing = ref(false);
const paymentStatus = ref("success");
const paymentId = ref(null);
const errorMessage = ref("حدث خطأ أثناء معالجة الدفع، يرجى المحاولة مرة أخرى");

const verifyPayment = async () => {
  try {
    isLoading.value = true;
    const response = await request.get(
      `/payments/verify?paymentId=${route.query.id}`
    );

    if (response.status) {
      paymentStatus.value = "success";
      paymentId.value = route.query.id;
    } else {
      paymentStatus.value = "failed";
      errorMessage.value = response.msg || errorMessage.value;
    }
  } catch (error) {
    paymentStatus.value = "failed";
    errorMessage.value = error.response?.msg || errorMessage.value;
  } finally {
    isLoading.value = false;
  }
};

const viewReceipt = async () => {
  try {
    isProcessing.value = true;
    const response = await request.get(`/payment/receipt${paymentId.value}`);
    window.open(response.receiptUrl, "_blank");
    toast.add({
      severity: "success",
      summary: "نجاح",
      detail: "تم عرض الإيصال بنجاح",
      life: 3000,
    });
  } catch (error) {
    console.error("Error fetching receipt:", error);
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل في عرض الإيصال",
      life: 3000,
    });
  } finally {
    isProcessing.value = false;
  }
};

const submitRating = async (value) => {
  try {
    isProcessing.value = true;
    rating.value = value;
    await request.post("/rating", {
      paymentId: paymentId.value,
      rating: value,
    });
    toast.add({
      severity: "success",
      summary: "نجاح",
      detail: "تم إرسال تقييمك بنجاح",
      life: 3000,
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل في إرسال التقييم",
      life: 3000,
    });
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  if (route.query.id) {
    verifyPayment();
  } else {
    paymentStatus.value = "failed";
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Font Awesome needs to be included in your project */
button:disabled {
  cursor: not-allowed;
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Custom styles for PrimeVue buttons to match original design */
.p-button {
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
}
.p-button.bg-purple-600 {
  background-color: #6d28d9;
}
.p-button.bg-purple-600:hover {
  background-color: #5b21b6;
}
.p-button.p-button-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}
.p-button.p-button-secondary:hover {
  background-color: #d1d5db;
}
</style>
