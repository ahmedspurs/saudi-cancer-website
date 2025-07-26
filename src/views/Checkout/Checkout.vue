<template>
  <div class="min-h-screen bg-gray-100 py-8 px-4" dir="rtl">
    <PrimeToast />
    <div class="max-w-4xl mx-auto bg-white rounded-md shadow-md p-6">
      <h2 class="text-2xl font-bold text-purple-700 mb-6 text-center">
        إتمام عملية الدفع
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- بيانات المستخدم -->
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
              @change="initializeForm"
            />
          </div>
        </div>
      </div>

      <!-- Custom Card Payment Form -->
      <div
        class="moyasar-form mt-6"
        v-show="checkout.paymentMethod !== 'apple_pay'"
      >
        <h3 class="text-lg font-semibold text-gray-700 mb-4">تفاصيل البطاقة</h3>
        <form id="card-payment-form" class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium"
              >اسم حامل البطاقة</label
            >
            <InputText
              v-model="cardDetails.name"
              name="card[holder_name]"
              class="w-full text-right"
              placeholder="أدخل اسم حامل البطاقة"
              required
            />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">رقم البطاقة</label>
            <InputText
              v-model="cardDetails.number"
              name="card[number]"
              class="w-full text-right"
              placeholder="1234 5678 9012 3456"
              required
              @input="formatCardNumber"
              :class="{ 'p-invalid': cardErrors.number }"
            />
            <small v-if="cardErrors.number" class="p-error">{{
              cardErrors.number
            }}</small>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 text-sm font-medium"
                >تاريخ الانتهاء</label
              >
              <div class="flex gap-2">
                <InputText
                  v-model="cardDetails.month"
                  name="card[month]"
                  class="w-full text-right"
                  placeholder="MM"
                  maxlength="2"
                  required
                  :class="{ 'p-invalid': cardErrors.month }"
                />
                <InputText
                  v-model="cardDetails.year"
                  name="card[year]"
                  class="w-full text-right"
                  placeholder="YYYY"
                  maxlength="4"
                  required
                  :class="{ 'p-invalid': cardErrors.year }"
                />
              </div>
              <small
                v-if="cardErrors.month || cardErrors.year"
                class="p-error"
                >{{ cardErrors.month || cardErrors.year }}</small
              >
            </div>
            <div>
              <label class="block mb-1 text-sm font-medium"
                >رمز التحقق (CVC)</label
              >
              <InputText
                v-model="cardDetails.cvc"
                name="card[cvc]"
                class="w-full text-right"
                placeholder="123"
                maxlength="4"
                required
                :class="{ 'p-invalid': cardErrors.cvc }"
              />
              <small v-if="cardErrors.cvc" class="p-error">{{
                cardErrors.cvc
              }}</small>
            </div>
          </div>
        </form>
      </div>
      <div
        v-show="checkout.paymentMethod === 'apple_pay' && isApplePayAvailable"
        class="apple-pay-container mt-6"
      >
        <apple-pay-button
          buttonstyle="black"
          type="donate"
          locale="ar-SA"
          @click="onApplePayButtonClicked"
        ></apple-pay-button>
      </div>
      <div
        v-if="checkout.paymentMethod === 'apple_pay' && !isApplePayAvailable"
        class="p-error mt-4"
      >
        Apple Pay غير متاح على هذا الجهاز أو المتصفح. يرجى اختيار طريقة دفع
        أخرى.
      </div>

      <!-- زر الدفع -->
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
            !phoneValid ||
            (checkout.paymentMethod !== 'apple_pay' && !isCardFormValid)
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
  paymentMethod: "apple_pay",
});

// Card details for custom form
const cardDetails = reactive({
  name: "",
  number: "",
  month: "",
  year: "",
  cvc: "",
});

// Card validation errors
const cardErrors = reactive({
  name: "",
  number: "",
  month: "",
  year: "",
  cvc: "",
});

// Phone validation state
const phoneValid = ref(true);

// Apple Pay availability
const isApplePayAvailable = ref(false);

// Card form validity
const isCardFormValid = computed(() => {
  return (
    cardDetails.name.trim() &&
    cardDetails.number.replace(/\s/g, "").length >= 14 &&
    cardDetails.month.length === 2 &&
    cardDetails.year.length === 4 &&
    cardDetails.cvc.length >= 3 &&
    !cardErrors.name &&
    !cardErrors.number &&
    !cardErrors.month &&
    !cardErrors.year &&
    !cardErrors.cvc
  );
});

// Saudi phone number validation function
const validatePhone = () => {
  const rawPhone = checkout.phone.trim().replace(/[\s\-]/g, ""); // حذف المسافات والشرط
  const saudiPhoneRegex = /^(?:\+966|00966|966|0)?5\d{8}$/;
  phoneValid.value = saudiPhoneRegex.test(rawPhone);
};

// Format card number (add spaces every 4 digits)
const formatCardNumber = () => {
  let value = cardDetails.number.replace(/\s/g, "");
  if (value.length > 16) value = value.slice(0, 16);
  cardDetails.number = value.replace(/(.{4})/g, "$1 ").trim();
  validateCardNumber();
};

// Basic card number validation
const validateCardNumber = () => {
  const number = cardDetails.number.replace(/\s/g, "");
  cardErrors.number = number.length < 14 ? "رقم البطاقة غير صالح" : "";
};

// Validate expiry date
const validateExpiry = () => {
  const month = parseInt(cardDetails.month, 10);
  const year = parseInt(cardDetails.year, 10);
  const currentYear = new Date().getFullYear();
  cardErrors.month =
    !/^\d{2}$/.test(cardDetails.month) || month < 1 || month > 12
      ? "شهر الانتهاء غير صالح"
      : "";
  cardErrors.year =
    !/^\d{4}$/.test(cardDetails.year) || year < currentYear
      ? "سنة الانتهاء غير صالحة"
      : "";
};

// Validate CVC
const validateCvc = () => {
  cardErrors.cvc = !/^\d{3,4}$/.test(cardDetails.cvc)
    ? "رمز التحقق غير صالح"
    : "";
};

// Watch card details for validation
watch(
  () => cardDetails.number,
  () => validateCardNumber()
);
watch(
  () => [cardDetails.month, cardDetails.year],
  () => validateExpiry()
);
watch(
  () => cardDetails.cvc,
  () => validateCvc()
);

// Payment methods from backend
const paymentMethods = ref([]);
const isLoadingPaymentMethods = ref(false);
const isLoadingUser = ref(false);

// Moyasar configuration
const moyasarConfig = {
  publishable_api_key: import.meta.env.VITE_MOYASAR_API_KEY,
  callback_url: window.location.origin + "/payment-callback",
  display_name: "Saudi Cancer", // Must match your store name
  domain_name: window.location.hostname, // Must match registered domain
};

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
      checkout.name = user.name || "";
      checkout.phone = user.phone || "";
      checkout.email = user.email || "";
      validatePhone();
      if (!user.phone) {
        toast.add({
          severity: "error",
          summary: "خطأ",
          detail: "رقم الجوال مطلوب. يرجى تحديث ملفك الشخصي.",
          life: 3000,
        });
        router.push("/profile");
      }
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

// Fetch payment methods from backend
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
    } else if (isApplePayAvailable.value) {
      const applePayMethod = paymentMethods.value.find(
        (method) => method.code === "apple_pay"
      );
      if (applePayMethod) {
        checkout.paymentMethod = "apple_pay";
      }
    }
  } catch (error) {
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
  if (isLoggedIn.value) return;

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

// Initialize form
const initializeForm = () => {
  cardDetails.name = "";
  cardDetails.number = "";
  cardDetails.month = "";
  cardDetails.year = "";
  cardDetails.cvc = "";
  Object.keys(cardErrors).forEach((key) => (cardErrors[key] = ""));
};

// Handle Apple Pay button click
const onApplePayButtonClicked = async () => {
  if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "Apple Pay غير متاح على هذا الجهاز أو المتصفح.",
      life: 3000,
    });
    return;
  }

  const paymentRequest = {
    countryCode: "SA",
    currencyCode: "SAR",
    supportedNetworks: ["visa", "mastercard", "amex", "mada"],
    merchantCapabilities: ["supports3DS"],
    total: {
      label: moyasarConfig.display_name,
      amount: (totalAmount.value / 100).toFixed(2),
    },
  };

  const session = new ApplePaySession(6, paymentRequest);

  session.onvalidatemerchant = async (event) => {
    try {
      const body = {
        validation_url: event.validationURL,
        display_name: moyasarConfig.display_name,
        domain_name: moyasarConfig.domain_name,
        publishable_api_key: moyasarConfig.publishable_api_key,
      };
      const response = await fetch(
        "https://api.moyasar.com/v1/applepay/initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const merchantSession = await response.json();
      session.completeMerchantValidation(merchantSession);
    } catch (error) {
      session.abort();
      toast.add({
        severity: "error",
        summary: "خطأ",
        detail: "فشل التحقق من التاجر. حاول مرة أخرى.",
        life: 3000,
      });
    }
  };

  session.onpaymentauthorized = async (event) => {
    const paymentToken = event.payment.token;
    const description = `Donation: ${donationCases
      .map((item) => `${item.title} x${item.qty || 1}`)
      .join(", ")}${
      donationGifts.length > 0
        ? `; Gifts: ${donationGifts
            .map((gift) => gift.receiver_name)
            .join(", ")}`
        : ""
    }`;

    try {
      const response = await fetch("https://api.moyasar.com/v1/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(
            moyasarConfig.publishable_api_key + ":"
          )}`,
        },
        body: JSON.stringify({
          amount: totalAmount.value,
          currency: "SAR",
          description,
          callback_url: moyasarConfig.callback_url,
          source: {
            type: "applepay",
            token: paymentToken,
          },
          metadata: {
            order_id: `order_${Date.now()}`, // Optional: Add unique identifier
          },
        }),
      });
      const payment = await response.json();

      if (!payment.id) {
        session.completePayment({
          status: ApplePaySession.STATUS_FAILURE,
          errors: [payment.message || "فشل معالجة الدفع."],
        });
        toast.add({
          severity: "error",
          summary: "خطأ",
          detail: payment.message || "فشل معالجة الدفع.",
          life: 3000,
        });
        return;
      }
      await savePaymentOnBackend(payment);

      if (payment.status !== "paid") {
        session.completePayment({
          status: ApplePaySession.STATUS_FAILURE,
          errors: [payment.source?.message || "فشل الدفع."],
        });
        toast.add({
          severity: "error",
          summary: "خطأ",
          detail: payment.source?.message || "فشل معالجة الدفع.",
          life: 3000,
        });
        return;
      }

      session.completePayment(ApplePaySession.STATUS_SUCCESS);
      toast.add({
        severity: "success",
        summary: "نجاح",
        detail: "تمت عملية الدفع بنجاح!",
        life: 3000,
      });
      window.location.href = moyasarConfig.callback_url + `?id=${payment.id}`;
    } catch (error) {
      session.completePayment({
        status: ApplePaySession.STATUS_FAILURE,
        errors: [error.message || "فشل معالجة الدفع."],
      });
      toast.add({
        severity: "error",
        summary: "خطأ",
        detail: "فشل معالجة الدفع. حاول مرة أخرى.",
        life: 3000,
      });
    }
  };

  session.oncancel = () => {
    toast.add({
      severity: "info",
      summary: "إلغاء",
      detail: "تم إلغاء عملية الدفع بواسطة Apple Pay.",
      life: 3000,
    });
  };

  session.begin();
};

// Save payment details to backend
const savePaymentOnBackend = async (payment) => {
  try {
    const description = `Donation: ${donationCases
      .map((item) => `${item.title} x${item.qty || 1}`)
      .join(", ")}${
      donationGifts.length > 0
        ? `; Gifts: ${donationGifts
            .map((gift) => gift.receiver_name)
            .join(", ")}`
        : ""
    }`;
    await request.post("/payments/checkout", {
      payment_id: payment.id,
      status: payment.status,
      amount: totalAmount.value / 100,
      currency: "SAR",
      description,
      donations: donationCases,
      gifts: donationGifts,
      user: isLoggedIn.value
        ? null
        : { name: checkout.name || "Guest", phone: checkout.phone },
    });
  } catch (error) {
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

  if (checkout.paymentMethod === "apple_pay") {
    await onApplePayButtonClicked();
    return;
  }

  if (!isCardFormValid.value) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى إدخال تفاصيل البطاقة بشكل صحيح.",
      life: 3000,
    });
    return;
  }

  try {
    const tokenData = {
      name: cardDetails.name,
      number: cardDetails.number.replace(/\s/g, ""),
      month: cardDetails.month,
      year: cardDetails.year,
      cvc: cardDetails.cvc,
      callback_url: moyasarConfig.callback_url,
      publishable_api_key: moyasarConfig.publishable_api_key,
    };

    let response = await fetch("https://api.moyasar.com/v1/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(moyasarConfig.publishable_api_key + ":")}`,
      },
      body: JSON.stringify(tokenData),
    });

    const tokenResponse = await response.json();

    if (!response.ok || !tokenResponse.id) {
      toast.add({
        severity: "error",
        summary: "خطأ",
        detail: tokenResponse.message || "فشل إنشاء رمز البطاقة.",
        life: 3000,
      });
      return;
    }

    const description = `Donation: ${donationCases
      .map((item) => `${item.title} x${item.qty || 1}`)
      .join(", ")}${
      donationGifts.length > 0
        ? `; Gifts: ${donationGifts
            .map((gift) => gift.receiver_name)
            .join(", ")}`
        : ""
    }`;

    const paymentResponse = await request.post("/payments/moyasar", {
      amount: totalAmount.value,
      currency: "SAR",
      description,
      token: tokenResponse.id,
      source: {
        type: checkout.paymentMethod,
        token: tokenResponse.id,
      },
      tokenData,
      callback_url: moyasarConfig.callback_url,
    });

    const payment = paymentResponse;
    await savePaymentOnBackend(payment);
    if (payment.status != "failed") {
      window.location.href = payment.transaction_url; // Redirect for 3D Secure
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: error.message || "فشل معالجة الدفع.",
      life: 3000,
    });
  }
};

// Watch for payment method changes
watch(
  () => checkout.paymentMethod,
  () => initializeForm()
);

onMounted(async () => {
  if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
    isApplePayAvailable.value = true;
  } else {
    paymentMethods.value = paymentMethods.value.filter(
      (method) => method.code !== "apple_pay"
    );
  }
  await fetchUserData();
  await fetchPaymentMethods();
});
</script>
<style scoped>
.moyasar-form,
.apple-pay-container {
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
apple-pay-button {
  --apple-pay-button-width: 100%;
  --apple-pay-button-height: 40px;
  --apple-pay-button-border-radius: 8px;
  --apple-pay-button-padding: 0;
  --apple-pay-button-box-sizing: border-box;
  display: inline-block;
  min-width: 150px;
}
</style>
