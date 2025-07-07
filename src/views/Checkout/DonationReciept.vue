<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6"
    dir="rtl"
  >
    <div
      class="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 text-right border-2 border-purple-600"
    >
      <!-- Loading State -->
      <ProgressSpinner v-if="loading" class="flex justify-center mx-auto" />

      <!-- Error State -->
      <Message v-if="error" severity="error" class="mb-6">
        {{ error }}
      </Message>

      <!-- Receipt Content -->
      <div
        v-else-if="receipt"
        class="space-y-4 text-gray-800 text-sm leading-6"
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 relative">
          <div class="h-32">
            <Image
              preview
              src="/images/main-logo.png"
              alt="جمعية السرطان السعودية"
              class="w-full h-full object-contain"
            />
          </div>
          <h2 class="text-center w-full text-xl font-bold text-gray-800">
            إيصال التبرع
          </h2>
        </div>

        <!-- Donor Information -->
        <div>
          <span class="font-semibold text-xl me-3">اسم المتبرع:</span>
          <span>{{
            receipt.donations_commons[0]?.user?.name || "غير متوفر"
          }}</span>
        </div>

        <!-- Total Amount -->
        <div>
          <span class="font-semibold text-xl me-3">إجمالي مبلغ التبرع:</span>
          <span>{{ formatAmount(receipt.amount) }}</span>
        </div>

        <!-- Donation Date -->
        <div>
          <span class="font-semibold text-xl me-3">تاريخ التبرع:</span>
          <span>{{ formatDate(receipt.createdAt) }}</span>
        </div>

        <!-- Transaction ID -->
        <div>
          <span class="font-semibold text-xl me-3">رقم العملية:</span>
          <span>{{ receipt.payment_id || "غير متوفر" }}</span>
        </div>

        <!-- Donation Items -->
        <div class="border-t pt-3">
          <h3 class="font-semibold text-lg mb-2">تفاصيل التبرعات:</h3>
          <div
            v-for="(item, index) in receipt.donations_commons"
            :key="item.id"
            class="mb-4"
          >
            <div>
              <span class="font-semibold me-3">نوع التبرع:</span>
              <span>{{ item.case ? "حالة" : "هدية" }}</span>
            </div>
            <div>
              <span class="font-semibold me-3">اسم الحالة/الهدية:</span>
              <span>{{
                item.case?.title || item.gift?.message || "غير متوفر"
              }}</span>
            </div>
            <div>
              <span class="font-semibold me-3">مبلغ التبرع:</span>
              <span>{{ formatAmount(item.amount) }}</span>
            </div>
            <div v-if="item.gift">
              <span class="font-semibold me-3">اسم المستلم:</span>
              <span>{{ item.gift.receiver_name || "غير متوفر" }}</span>
            </div>
            <hr
              v-if="index < receipt.donations_commons.length - 1"
              class="my-2"
            />
          </div>
        </div>

        <!-- Total Amount in Words -->
        <div class="border-t pt-3">
          <span class="font-semibold text-xl me-3">إجمالي المبلغ:</span>
          <span>{{ amountInWords(receipt.amount) }}</span>
        </div>

        <!-- Print Button -->
        <div class="mt-6 flex justify-center">
          <button
            @click="print"
            class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-md transition-colors duration-200"
          >
            طباعة الإيصال
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !error" class="text-center py-6">
        <p class="text-gray-500">لا توجد بيانات للإيصال.</p>
      </div>

      <!-- Toast -->
      <Toast />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import ProgressSpinner from "primevue/progressspinner";
import Message from "primevue/message";
import Toast from "primevue/toast";
import Image from "primevue/image";
import request from "../../services/request";

const route = useRoute();
const toast = useToast();
const receipt = ref(null);
const loading = ref(false);
const error = ref(null);

// Fetch receipt data
const fetchReceipt = async () => {
  loading.value = true;
  const payment_id = route.query.payment_id;

  try {
    const response = await request.post(`/payments/user/reciept`, {
      payment_id,
    });
    receipt.value = response.data; // Store the entire `data` object
  } catch (err) {
    error.value = "فشل في تحميل بيانات الإيصال. حاول مرة أخرى.";
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: error.value,
      life: 3000,
    });
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Format amount to include currency
const formatAmount = (amount) => {
  return amount
    ? `${parseFloat(amount).toLocaleString("ar-SA")} ريال سعودي`
    : "غير متوفر";
};

// Format date to Arabic format
const formatDate = (dateString) => {
  if (!dateString) return "غير متوفر";
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
};

// Convert amount to words (basic implementation)
const amountInWords = (amount) => {
  if (!amount) return "غير متوفر";
  const numbersInArabic = {
    0: "صفر",
    1: "واحد",
    2: "اثنان",
    3: "ثلاثة",
    4: "أربعة",
    5: "خمسة",
    6: "ستة",
    7: "سبعة",
    8: "ثمانية",
    9: "تسعة",
    10: "عشرة",
  };
  const num = parseInt(amount);
  return num in numbersInArabic
    ? `${numbersInArabic[num]} ريال سعودي فقط لا غير`
    : `${parseFloat(amount).toLocaleString("ar-SA")} ريال سعودي فقط لا غير`;
};

// Print function
const print = () => {
  window.print();
};

// Fetch data on component mount
onMounted(() => {
  fetchReceipt();
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>
