<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4" dir="rtl">
    <PrimeToast />
    <div class="max-w-4xl mx-auto bg-white rounded-md shadow-md p-6">
      <h2 class="text-2xl font-bold text-purple-700 mb-6 text-center">
        إتمام عملية الدفع
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4">
            معلومات الفاتورة
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block mb-1 text-sm font-medium"
                >الاسم (اختياري)</label
              >
              <InputText
                v-model="checkout.name"
                :disabled="isLoadingUser || isLoggedIn"
                class="w-full text-right"
                :readonly="isLoggedIn"
              />
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium"
                >رقم الجوال (مطلوب)</label
              >
              <InputText
                v-model="checkout.phone"
                :disabled="isLoadingUser || isLoggedIn"
                class="w-full text-right"
                :class="{ 'p-invalid': !phoneValid && checkout.phone }"
                :readonly="isLoggedIn"
                required
                @input="validatePhone"
              />
              <small v-if="!phoneValid && checkout.phone" class="p-error">
                يرجى إدخال رقم جوال سعودي صالح (مثال: +966501234567 أو
                0501234567)
              </small>
            </div>
            <!-- Show email field only for logged-in users -->
            <div v-if="isLoggedIn">
              <label class="block mb-1 text-sm font-medium"
                >البريد الإلكتروني</label
              >
              <InputText
                v-model="checkout.email"
                :disabled="isLoadingUser"
                type="email"
                class="w-full text-right"
                readonly
              />
            </div>
          </div>
        </div>

        <!-- ملخص السلة -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-4">ملخص السلة</h3>
          <div class="bg-gray-50 p-4 rounded-md space-y-3 text-sm">
            <div
              v-for="(item, index) in donationCases"
              :key="'case-' + item.id + '-' + index"
              class="flex justify-between"
            >
              <span>{{ item.title }} (الكمية: {{ item.qty || 1 }})</span>
              <span
                >{{
                  (item.amount * (item.qty || 1)).toLocaleString()
                }}
                ريال</span
              >
            </div>
            <div
              v-for="(gift, index) in donationGifts"
              :key="'gift-' + index"
              class="flex justify-between"
            >
              <span>هدية لـ {{ gift.receiver_name }}</span>
              <span>{{ gift.amount.toLocaleString() }} ريال</span>
            </div>
            <hr class="my-2" />
            <div class="flex justify-between font-bold text-gray-800">
              <span>المجموع الكلي:</span>
              <span>{{ totalAmountMajor.toLocaleString() }} ريال</span>
            </div>
          </div>

          <div class="mt-6">
            <label class="block mb-1 text-sm font-medium">طريقة الدفع</label>
            <Dropdown
              v-model="checkout.paymentMethod"
              :options="paymentMethods"
              option-label="name"
              option-value="code"
              placeholder="اختر طريقة الدفع"
              class="w-full"
              :loading="isLoadingPaymentMethods"
              :disabled="isLoadingPaymentMethods || paymentMethods.length === 0"
              @change="initializeMoyasarForm"
            />
          </div>
        </div>
      </div>

      <!-- Moyasar Form Container -->
      <div
        class="moyasar-form"
        v-show="checkout.paymentMethod != 'apple_pay'"
      ></div>
      <div
        class="apple-form"
        v-show="checkout.paymentMethod == 'apple_pay'"
      ></div>

      <div class="mt-8">
        <Button
          label="تأكيد الدفع"
          severity="primary"
          class="w-full"
          :disabled="
            isLoadingPaymentMethods ||
            isLoadingUser ||
            !checkout.paymentMethod ||
            !checkout.phone ||
            !phoneValid
          "
          @click="submitPayment"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import request from "../../services/request";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import PrimeToast from "primevue/toast";

const toast = useToast();
const router = useRouter();

// Check if user is logged in
const isLoggedIn = ref(!!localStorage.getItem("accessToken"));

// Initialize cart from localStorage
const cart = reactive(
  JSON.parse(localStorage.getItem("cart") || '{"gifts":[],"donations":[]}')
);

// Reactive references for donations and gifts
const donationCases = reactive(cart.donations);
const donationGifts = reactive(cart.gifts);

// Checkout form data
const checkout = reactive({
  name: "",
  phone: "",
  email: "",
  paymentMethod: "",
});

// Phone validation state
const phoneValid = ref(true);

// Saudi phone number validation function
const validatePhone = () => {
  const saudiPhoneRegex = /^(?:\+9665|05)\d{8}$/;
  phoneValid.value = saudiPhoneRegex.test(checkout.phone);
};

// Payment methods from backend
const paymentMethods = ref([]);
const isLoadingPaymentMethods = ref(false);
const isLoadingUser = ref(false);

// Moyasar configuration
const moyasarConfig = {
  publishable_api_key: import.meta.env.VITE_MOYASAR_API_KEY,
  callback_url: window.location.origin + "/payment-callback",
  element: ".moyasar-form",
  apple_element: ".apple-form",
};

// Reference to store Moyasar instance
const moyasarInstance = ref(null);

// Fetch user data from /tokens/me for logged-in users
const fetchUserData = async () => {
  if (!isLoggedIn.value) {
    isLoadingUser.value = false;
    return;
  }

  isLoadingUser.value = true;
  try {
    if (localStorage.getItem("accessToken")) {
      const response = await request.get("/tokens/me");
      const user = response.data;
      checkout的名字 = user.name || "";
      checkout.phone = user.phone || "";
      checkout.email = user.email || "";
      validatePhone(); // Validate phone number if fetched
      if (!user.phone) {
        toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "رقم الجوال مطلوب. يرجى تحديث ملفك الشخصي.",
          life: 3000,
        });
        router.push("/profile");
      }
    } else {
      isLoadingUser.value = false;
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل تحميل بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.",
      life: 3000,
    });
    localStorage.removeItem("accessToken");
    isLoggedIn.value = false;
    router.push({
      path: "/login",
      query: {
        redirect: router.currentRoute.value.fullPath,
        error: "session_expired",
      },
    });
  } finally {
    isLoadingUser.value = false;
  }
};

// Fetch payment methods from backend and set Apple Pay as default
const fetchPaymentMethods = async () => {
  isLoadingPaymentMethods.value = true;
  try {
    const response = await request.get("/payment-methods");
    paymentMethods.value = response.data;
    if (paymentMethods.value.length === 0) {
      toast.add({
        severity: "warn",
        summary: "تحذير",
        detail: "لا توجد طرق دفع متاحة حاليًا.",
        life: 3000,
      });
    } else {
      // Set Apple Pay as default if available
      const applePayMethod = paymentMethods.value.find(
        (method) => method.code === "apple_pay"
      );
      if (applePayMethod) {
        checkout.paymentMethod = "apple_pay";
        initializeMoyasarForm();
      }
    }
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل تحميل طرق الدفع. حاول مرة أخرى لاحقًا.",
      life: 3000,
    });
    paymentMethods.value = [];
  } finally {
    isLoadingPaymentMethods.value = false;
  }
};

// Save guest user data to backend
const saveGuestUserData = async () => {
  if (isLoggedIn.value) return; // Skip for logged-in users

  if (!checkout.phone || !phoneValid.value) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى إدخال رقم جوال سعودي صالح.",
      life: 3000,
    });
    return false;
  }

  try {
    await request.post("/guest-users", {
      name: checkout.name || "Guest",
      phone: checkout.phone,
    });
    toast.add({
      severity: "success",
      summary: "نجاح",
      detail: "تم حفظ بيانات المستخدم بنجاح.",
      life: 3000,
    });
    return true;
  } catch (error) {
    console.error("Error saving guest user data:", error);
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل حفظ بيانات المستخدم. حاول مرة أخرى.",
      life: 3000,
    });
    return false;
  }
};

// Compute total amount
const totalAmount = computed(() => {
  const caseTotal = donationCases.reduce(
    (sum, item) => sum + item.amount * (item.qty || 1),
    0
  );
  const giftTotal = donationGifts.reduce(
    (sum, gift) => sum + (gift.amount || 0),
    0
  );
  return (caseTotal + giftTotal) * 100; // Convert to minor units for Moyasar
});

// Display total in major units for UI
const totalAmountMajor = computed(() => totalAmount.value / 100);

// Clear previous Moyasar form
const clearMoyasarForm = () => {
  if (moyasarInstance.value) {
    const element = document.querySelector(moyasarConfig.element);
    const appleElement = document.querySelector(moyasarConfig.apple_element);
    if (element) element.innerHTML = "";
    if (appleElement) appleElement.innerHTML = "";
    moyasarInstance.value = null;
  }
};

// Initialize Moyasar form
const initializeMoyasarForm = () => {
  clearMoyasarForm();

  const description = `Donation: ${donationCases
    .map((item) => `${item.title} x${item.qty || 1}`)
    .join(", ")}${
    donationGifts.length > 0
      ? `; Gifts: ${donationGifts.map((gift) => gift.receiver_name).join(", ")}`
      : ""
  }`;

  try {
    if (checkout.paymentMethod !== "apple_pay") {
      moyasarInstance.value = Moyasar.init({
        element: moyasarConfig.element,
        amount: totalAmount.value,
        currency: "SAR",
        description,
        publishable_api_key: moyasarConfig.publishable_api_key,
        callback_url: moyasarConfig.callback_url,
        methods: ["creditcard", "mada", "visa"],
        on_completed: async function (payment) {
          await savePaymentOnBackend(payment);
        },
      });
    } else {
      moyasarInstance.value = window.Moyasar.init({
        element: moyasarConfig.apple_element,
        amount: totalAmount.value,
        currency: "SAR",
        description,
        publishable_api_key: moyasarConfig.publishable_api_key,
        callback_url: moyasarConfig.callback_url,
        methods: ["applepay"],
        apple_pay: {
          country: "SA",
          label: "Saudi Cancer",
          validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
        },
        on_completed: async function (payment) {
          await savePaymentOnBackend(payment);
        },
      });
    }
  } catch (error) {
    console.error("Error initializing Moyasar:", error);
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل تهيئة بوابة الدفع. حاول مرة أخرى لاحقًا.",
      life: 3000,
    });
  }
};

// Watch for payment method changes
watch(
  () => checkout.paymentMethod,
  () => {
    initializeMoyasarForm();
  }
);

// Save payment details to backend
const savePaymentOnBackend = async (payment) => {
  try {
    await request.post("/payments/checkout", {
      payment_id: payment.id,
      status: payment.status,
      amount: payment.amount / 100,
      currency: payment.currency,
      donations: donationCases,
      gifts: donationGifts,
      user: isLoggedIn.value
        ? null
        : { name: checkout.name || "Guest", phone: checkout.phone },
    });
  } catch (error) {
    console.error("Error saving payment details:", error);
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل حفظ تفاصيل الدفع.",
      life: 3000,
    });
  }
};

// Submit payment
const submitPayment = async () => {
  if (!checkout.phone || !phoneValid.value || !checkout.paymentMethod) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى إدخال رقم جوال سعودي صالح واختيار طريقة دفع.",
      life: 3000,
    });
    return;
  }

  // Save guest user data if not logged in
  if (!isLoggedIn.value) {
    const saved = await saveGuestUserData();
    if (!saved) return;
  }

  // Ensure Moyasar form is initialized
  if (!moyasarInstance.value) {
    initializeMoyasarForm();
  }
};

// Fetch user data and payment methods on component mount
onMounted(async () => {
  await fetchUserData();
  await fetchPaymentMethods();
});
</script>

<style scoped>
.moyasar-form,
.apple-form {
  display: block;
  margin-top: 1rem;
}
.p-invalid {
  border-color: #ef4444 !important;
}
.p-error {
  color: #ef4444;
  font-size: 0.875rem;
}
</style>
