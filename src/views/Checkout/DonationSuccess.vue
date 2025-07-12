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
      <!-- Processing overlay -->
      <div
        v-if="isProcessing"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
        ></div>
      </div>

      <!-- pending state -->
      <template v-if="paymentStatus == 'pending'">
        <div class="text-yellow-500 text-5xl mb-4">
          <i class="fas fa-hourglass-half fa-spin"></i>
        </div>
        <h2 class="text-xl font-bold text-yellow-700 mb-2">
          جاري معالجة الدفع
        </h2>
        <p class="text-gray-600 mb-6">
          يرجى الانتظار بينما تتم معالجة عملية الدفع الخاصة بك...
          <span v-if="paymentId"> (رقم العملية: {{ paymentId }})</span>
        </p>
        <!-- Optional cancel button (uncomment if needed) -->
        <!--
        <Button
          label="إلغاء العملية"
          icon="pi pi-times"
          class="p-button w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
          :disabled="isProcessing"
          @click="cancelPayment"
        />
        -->
      </template>

      <!-- Success state -->
      <template v-else-if="paymentStatus == 'success'">
        <div class="text-green-500 text-5xl mb-4">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2 class="text-xl font-bold text-purple-700 mb-2">تم التبرع بنجاح!</h2>
        <p class="text-gray-600 mb-6">
          شكرًا لك على مساهمتك الكريمة
          <span v-if="paymentId"> (رقم العملية: {{ paymentId }})</span>
        </p>
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
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import request from "../../services/request";

const router = useRouter();
const route = useRoute();
const toast = useToast();
const rating = ref(0);
const isLoading = ref(true);
const isProcessing = ref(false);
const paymentStatus = ref(null);
const paymentId = ref(null);
const errorMessage = ref("حدث خطأ أثناء معالجة الدفع، يرجى المحاولة مرة أخرى");
const pollingInterval = ref(null);

const verifyPayment = async () => {
  try {
    isLoading.value = true;
    const response = await request.get(
      `/payments/verify?paymentId=${route.query.id}`
    );

    if (response.status) {
      if (response.payment_status == "pending") {
        paymentStatus.value = "pending";
        paymentId.value = route.query.id;

        startPolling();
      } else if (response.payment_status == "success") {
        paymentStatus.value = "success";
        paymentId.value = route.query.id;
      } else {
        paymentStatus.value = "failed";
        errorMessage.value = response.msg || errorMessage.value;
      }
    } else {
      paymentStatus.value = "pending";
      errorMessage.value = response.msg || errorMessage.value;
      startPolling();
    }
  } catch (error) {
    paymentStatus.value = "pending";
    errorMessage.value = error.response?.msg || errorMessage.value;
    startPolling();
  } finally {
    isLoading.value = false;
    isProcessing.value = false;
  }
};

const startPolling = () => {
  // Clear any existing polling
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
  }

  // Poll every 5 seconds
  pollingInterval.value = setInterval(async () => {
    try {
      const response = await request.get(
        `/payments/verify?paymentId=${route.query.id}`
      );
      paymentStatus.value = response.payment_status;

      if (response.status) {
        if (response.payment_status == "success") {
          paymentStatus.value = "success";
          paymentId.value = route.query.id;
          clearInterval(pollingInterval.value);
          isLoading.value = false;
        } else if (response.payment_status == "failed") {
          paymentStatus.value = "failed";
          errorMessage.value = response.msg || errorMessage.value;
          clearInterval(pollingInterval.value);
          isLoading.value = false;
        }
        // Continue polling if still pending
      } else {
        paymentStatus.value = "pending";
        errorMessage.value = response.msg || errorMessage.value;
        isLoading.value = false;
      }
    } catch (error) {
      paymentStatus.value = "pending";
      errorMessage.value = error.response?.msg || errorMessage.value;
      isLoading.value = false;
    }
  }, 5000); // Poll every 5 seconds
};

/*
const cancelPayment = async () => {
  try {
    isProcessing.value = true;
    await request.post(`/payments/cancel?paymentId=${paymentId.value}`);
    paymentStatus.value = "failed";
    errorMessage.value = "تم إلغاء عملية الدفع";
    clearInterval(pollingInterval.value);
    isLoading.value = false;
    toast.add({
      severity: "info",
      summary: "إلغاء",
      detail: "تم إلغاء عملية الدفع بنجاح",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل في إلغاء عملية الدفع",
      life: 3000,
    });
  } finally {
    isProcessing.value = false;
  }
};
*/

const viewReceipt = async () => {
  try {
    isProcessing.value = true;
    router.push({
      path: "/donation-reciept/",
      query: { paymentId: paymentId.value },
    });
  } catch (error) {
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
  verifyPayment();
});

onUnmounted(() => {
  // Clean up polling interval when component is unmounted
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
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
.p-button.bg-red-600 {
  background-color: #dc2626;
}
.p-button.bg-red-600:hover {
  background-color: #b91c1c;
}
.p-button.p-button-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}
.p-button.p-button-secondary:hover {
  background-color: #d1d5db;
}
</style>
