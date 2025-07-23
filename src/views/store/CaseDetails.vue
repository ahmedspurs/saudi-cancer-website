<template>
  <div
    class="container mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 transition-colors duration-300"
  >
    <Toast position="top-right" />

    <!-- Case Title -->
    <h2
      class="text-center text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 my-6 sm:my-8"
    >
      {{ project?.title || "تفاصيل الحالة" }}
    </h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <ProgressSpinner class="w-12 h-12" />
    </div>
    <!-- No Data State -->
    <div v-else-if="!project" class="text-center py-12">
      <NoData message="لم يتم العثور على الحالة" />
    </div>
    <!-- Case Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
      <!-- Case Image and Progress -->
      <div class="relative">
        <!-- Case Image -->
        <Image
          :src="
            project?.image_url
              ? `${$store?.state?.baseUrl}${
                  project?.image_url?.split('public/')[1]
                }`
              : placeholder
          "
          imageClass="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-md transition-transform duration-300 hover:scale-[1.02]"
          preview
          alt="صورة الحالة"
          loading="lazy"
        />

        <!-- Green Overlay for Completed Cases -->
        <div
          v-if="project?.progress >= 100 || project.status === 'completed'"
          class="absolute inset-0 bg-green-500/20 flex items-center justify-center rounded-2xl"
        >
          <Image
            src="/images/donation_complete.webp"
            class="w-24 h-24 sm:w-32 sm:h-32 object-contain"
            alt="تم الإكمال"
            loading="lazy"
          />
        </div>

        <!-- Progress Bar -->
        <div class="mt-4 px-4">
          <div
            v-if="project?.progress < 100 && project.status !== 'completed'"
            class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden"
          >
            <div
              :style="`width: ${project.progress}%`"
              class="absolute top-0 right-0 h-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold flex items-center justify-center rounded-full transition-all duration-700 ease-in-out"
            >
              <span class="px-3">{{ project.progress }}%</span>
            </div>
          </div>
          <div
            v-else
            class="w-full bg-green-600 text-white text-sm font-semibold text-center py-2 rounded-full"
          >
            تم إكمال التبرع بنجاح
          </div>
        </div>
      </div>

      <!-- Case Information and Actions -->
      <div class="flex flex-col justify-between gap-6">
        <!-- Case Details -->
        <div class="text-right space-y-3">
          <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            رقم الحالة: #00{{ project.id }}
          </p>
          <p class="text-base text-gray-700 dark:text-gray-300">
            المبلغ المطلوب: {{ project.target_amount.toLocaleString() }} ريال
          </p>
          <p class="text-base text-gray-700 dark:text-gray-300 line-clamp-4">
            {{ project.description || "وصف الحالة غير متوفر" }}
          </p>
        </div>

        <!-- Donation Input and Buttons -->
        <div
          v-if="project?.progress < 100 && project.status !== 'completed'"
          class="space-y-4"
        >
          <InputText
            v-model.number="donationAmount"
            type="number"
            placeholder="أدخل مبلغ التبرع"
            class="w-full text-sm text-right p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors"
            :class="{ 'border-red-500': donationError }"
            @input="validateDonation"
          />
          <p v-if="donationError" class="text-red-500 text-sm text-right">
            يرجى إدخال مبلغ تبرع صالح
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <Button
              label="الدفع الآن"
              severity="primary"
              class="flex-1 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              @click="payNow"
              :disabled="isSubmitting"
            />
            <Button
              label="أضف للسلة"
              severity="secondary"
              class="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors"
              @click="addToCart"
              :disabled="isSubmitting"
            />
          </div>
        </div>

        <!-- Social Media Sharing -->
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6"
        >
          <p class="font-semibold text-gray-900 dark:text-gray-100">
            مشاركة الحالة:
          </p>
          <div class="flex gap-3">
            <a
              v-for="platform in socialPlatforms"
              :key="platform.name"
              :href="platform.href"
              target="_blank"
              class="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              :title="`مشاركة على ${platform.name}`"
            >
              <i :class="platform.icon" class="w-6 h-6"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <ValiditySection class="my-12" />
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";
import request from "../../services/request.js";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Image from "primevue/image";
import ProgressSpinner from "primevue/progressspinner";
import NoData from "../../components/NoData.vue";
import ValiditySection from "../Home/components/ValiditySection.vue";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const placeholder = "/images/main-logo.png";
const isLoading = ref(false);
const project = ref(null);
const donationAmount = ref(0);
const donationError = ref(false);
const isSubmitting = ref(false);

// Social media platforms configuration
const socialPlatforms = computed(() => [
  {
    name: "فيسبوك",
    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      project.value?.url || window.location.href
    )}`,
    icon: "fab fa-facebook-f",
  },
  {
    name: "تويتر",
    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `تبرع الآن لمشروع: ${project.value?.title} | رقم الحالة: ${
        project.value?.id
      } | المبلغ المطلوب: ${project.value?.target_amount.toLocaleString()}`
    )}&url=${encodeURIComponent(project.value?.url || window.location.href)}`,
    icon: "fab fa-x-twitter",
  },
  {
    name: "لينكدإن",
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      project.value?.url || window.location.href
    )}`,
    icon: "fab fa-linkedin-in",
  },
  {
    name: "سناب شات",
    href: `https://www.snapchat.com/share?url=${encodeURIComponent(
      project.value?.url || window.location.href
    )}&text=${encodeURIComponent(`تبرع الآن لمشروع: ${project.value?.title}`)}`,
    icon: "fab fa-snapchat-ghost",
  },
]);

// Fetch case details
const fetchCaseDetails = async () => {
  isLoading.value = true;
  try {
    const response = await request.get(`cases/${route.params.id}`);
    if (response.status) {
      project.value = {
        ...response.data,
        amount: response.data.amount || 0,
        url: window.location.href,
      };
    } else {
      project.value = null;
      toast.add({
        severity: "error",
        summary: "خطأ",
        detail: "لم يتم العثور على الحالة",
        life: 3000,
      });
    }
  } catch (error) {
    project.value = null;
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل في جلب تفاصيل الحالة",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

// Validate donation amount
const validateDonation = () => {
  donationError.value = !donationAmount.value || donationAmount.value <= 0;
};

// Pay Now handler
const payNow = async () => {
  validateDonation();
  if (donationError.value) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى إدخال مبلغ تبرع صالح",
      life: 3000,
    });
    return;
  }

  isSubmitting.value = true;
  try {
    localStorage.removeItem("cart");
    const cart = {
      gifts: [],
      donations: [{ ...project.value, amount: donationAmount.value, qty: 1 }],
    };
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.add({
      severity: "success",
      summary: "نجاح",
      detail: `تم إضافة ${project.value.title} إلى السلة`,
      life: 3000,
    });
    router.push("/checkout");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "حدث خطأ أثناء الدفع",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

// Add to Cart handler
const addToCart = async () => {
  validateDonation();
  if (donationError.value) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى إدخال مبلغ تبرع صالح",
      life: 3000,
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const cart = JSON.parse(
      localStorage.getItem("cart") || '{"gifts":[],"donations":[]}'
    );
    const existingItem = cart.donations.find(
      (item) => item.id === project.value.id
    );
    if (existingItem) {
      existingItem.qty = (existingItem.qty || 1) + 1;
      existingItem.amount = donationAmount.value;
    } else {
      cart.donations.push({
        ...project.value,
        amount: donationAmount.value,
        qty: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.add({
      severity: "success",
      summary: "نجاح",
      detail: `تم إضافة ${project.value.title} إلى السلة`,
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "حدث خطأ أثناء الإضافة إلى السلة",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(fetchCaseDetails);
</script>
