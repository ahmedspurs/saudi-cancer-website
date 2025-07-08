<template>
  <div class="container mx-auto p-6" dir="rtl">
    <!-- Loading State -->
    <ProgressSpinner v-if="loading" class="flex justify-center mx-auto" />

    <!-- Error State -->
    <Message v-if="error" severity="error" class="mb-4">
      {{ error }}
    </Message>
    <Toast />

    <!-- Card Grid -->
    <div
      v-if="accounts.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <Card v-for="account in accounts" :key="account.id" class="shadow-lg">
        <template #content>
          <div class="">
            <!-- Image with Fallback -->
            <div class="h-32 mb-4 w-full">
              <Image
                :src="
                  account?.image
                    ? `${$store?.state?.baseUrl}${
                        account?.image?.split('public/')[1]
                      }`
                    : fallbackImage
                "
                preview
                alt="صورة الحساب"
                imageClass="w-full h-full object-cover"
              />
            </div>

            <!-- Account Details -->
            <div class="text-right w-full p-4">
              <p class="font-bold text-lg flex items-center justify-between">
                رقم الحساب: {{ account.account_number }}

                <Button
                  label="نسخ"
                  @click="copyToClipboard(account.account_number)"
                  class="text-sm text-purple-600 hover:underline mt-2"
                />
              </p>
              <p class="text-gray-600">
                اسم الحامل: {{ account.account_holder_name }}
              </p>
              <p class="text-gray-600">الآيبان: {{ account.iban }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && !error" class="text-center py-6">
      <NoData />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Card from "primevue/card";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import request from "../../services/request";
import Image from "primevue/image";
import NoData from "../../components/NoData.vue";
import { useToast } from "primevue/usetoast";

const accounts = ref([]);
const loading = ref(false);
const error = ref(null);
const fallbackImage = "/images/main-logo.png";
const toast = useToast();

const fetchAccounts = async () => {
  loading.value = true;
  try {
    const response = await request.get("/bank-accounts");
    accounts.value = response.data;
  } catch (err) {
    error.value = "فشل في تحميل الحسابات المصرفية. حاول مرة أخرى.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
  toast.add({
    severity: "success",
    summary: "نجاح",
    detail: `تم النسخ بنجاح`,
    life: 3000,
  });
};

onMounted(() => {
  fetchAccounts();
});
</script>

<style scoped>
:deep(.p-card) {
  direction: rtl;
  @apply border border-gray-200 rounded-lg;
}

:deep(.p-progress-spinner) {
  @apply w-12 h-12;
}

:deep(.p-message) {
  @apply font-sans;
}
</style>
