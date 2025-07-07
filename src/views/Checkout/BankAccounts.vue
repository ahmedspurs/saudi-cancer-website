<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4" dir="rtl">
    <div class="max-w-4xl mx-auto bg-white rounded-md shadow-md p-6">
      <h2 class="text-2xl font-bold text-purple-700 mb-6 text-center">
        الحسابات البنكية
      </h2>

      <div
        v-for="(bank, index) in banks"
        :key="index"
        class="border p-4 rounded-md mb-4 bg-gray-50"
      >
        <div class="mb-2">
          <span class="font-semibold text-gray-700">البنك:</span>
          {{ bank.name }}
        </div>

        <div class="mb-2">
          <span class="font-semibold text-gray-700">اسم الحساب:</span>
          {{ bank.accountName }}
        </div>

        <div class="mb-2 flex justify-between items-center gap-2">
          <div>
            <span class="font-semibold text-gray-700">رقم الحساب:</span>
            {{ bank.accountNumber }}
          </div>
          <button
            @click="copyToClipboard(bank.accountNumber)"
            class="text-sm text-purple-600 hover:underline"
          >
            نسخ
          </button>
        </div>

        <div class="mb-2 flex justify-between items-center gap-2">
          <div>
            <span class="font-semibold text-gray-700">رقم الآيبان:</span>
            {{ bank.iban }}
          </div>
          <button
            @click="copyToClipboard(bank.iban)"
            class="text-sm text-purple-600 hover:underline"
          >
            نسخ
          </button>
        </div>

        <!-- QR Code اختياري -->
        <div v-if="bank.qr" class="mt-4">
          <img
            :src="bank.qr"
            alt="QR Code"
            class="w-32 h-32 object-contain mx-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const banks = [
  {
    name: "مصرف الراجحي",
    accountName: "جمعية خيرية",
    accountNumber: "1234567890",
    iban: "SA12345678901234567890",
    qr: "", // يمكن وضع رابط صورة QR هنا إن وُجد
  },
  {
    name: "البنك الأهلي السعودي",
    accountName: "جمعية الخير",
    accountNumber: "9876543210",
    iban: "SA09876543210987654321",
    qr: "",
  },
];

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  alert("تم نسخ الرقم بنجاح!");
};
</script>
