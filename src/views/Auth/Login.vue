<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gray-100"
    dir="rtl"
  >
    <div
      class="w-full max-w-sm bg-purple-400 text-white p-6 rounded-lg shadow-md"
    >
      <h2 class="text-center text-lg font-semibold mb-6">تسجيل الدخول</h2>

      <Toast />

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">رقم الجوال</label>
          <div class="relative">
            <InputText
              v-model="data.phone"
              placeholder="أدخل رقم الجوال (05XXXXXXXX أو 05XXXXXXXX)"
              class="input-field pr-10"
              @input="validateForm"
            />
          </div>
          <p v-if="errors.phone" class="text-red-200 text-xs mt-1">
            {{ errors.phone }}
          </p>
        </div>

        <div>
          <label class="block text-sm mb-1">كلمة المرور</label>
          <div class="relative">
            <InputText
              type="password"
              v-model="data.password"
              placeholder="أدخل كلمة المرور الخاصة بك"
              class="input-field pr-10"
              @input="validateForm"
            />
          </div>
          <p v-if="errors.password" class="text-red-200 text-xs mt-1">
            {{ errors.password }}
          </p>
        </div>

        <Button
          severity="secondary"
          type="submit"
          label="تسجيل دخول"
          class="w-full bg-white text-purple-600 font-bold rounded-md hover:bg-purple-100"
          :loading="isSubmitting"
        />

        <div class="text-center text-sm mt-4">
          <p class="text-white">
            لا تملك عضوية؟
            <router-link to="/register" class="underline">سجل الآن</router-link>
          </p>
          <a href="#" class="underline text-white text-xs">نسيت كلمة المرور؟</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from "primevue/toast";
import request from "../../services/request";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const data = ref({
  phone: "",
  password: "",
});
const errors = reactive({
  phone: "",
  password: "",
});

// Error messages for query parameter errors
const errorMessages = {
  not_authenticated: "يرجى تسجيل الدخول للوصول إلى هذه الصفحة.",
  session_expired: "انتهت جلسة تسجيل الدخول. يرجى تسجيل الدخول مرة أخرى.",
  server_error: "حدث خطأ في الخادم. يرجى المحاولة لاحقًا.",
};

// Display error message from query parameter on mount
onMounted(() => {
  const errorCode = route.query.error;
  if (errorCode && errorMessages[errorCode]) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: errorMessages[errorCode],
      life: 5000,
    });
  }
});

// Form validation
const validateForm = () => {
  // Validate Saudi phone number
  errors.phone = "";
  if (!data.value.phone) {
    errors.phone = "يرجى إدخال رقم الجوال";
  } else {
    // Remove any non-digit characters for validation
    const cleanedPhone = data.value.phone.replace(/[^\d]/g, "");
    // Saudi numbers start with 9665 or 05 followed by 8 digits
    const saudiPhoneRegex = /^(05\d{8}$)|(05\d{8}$)|(05\d{8}$)/;
    if (!saudiPhoneRegex.test(data.value.phone)) {
      errors.phone =
        "يرجى إدخال رقم جوال سعودي صالح (مثال: 9665XXXXXXXX أو 05XXXXXXXX)";
    }
  }

  // Validate password
  errors.password = data.value.password
    ? data.value.password.length >= 6
      ? ""
      : "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    : "يرجى إدخال كلمة المرور";

  return !errors.phone && !errors.password;
};

// Login handler
const login = async () => {
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى تصحيح الأخطاء في النموذج",
      life: 3000,
    });
    return;
  }

  isSubmitting.value = true;
  try {
    // Normalize phone number to +9665xxxxxxxx format for backend
    let normalizedPhone = data.value.phone;
    if (normalizedPhone.startsWith("05")) {
      normalizedPhone = "+966" + normalizedPhone.slice(1);
    } else if (normalizedPhone.startsWith("9665")) {
      normalizedPhone = "+966" + normalizedPhone.slice(3);
    } else if (normalizedPhone.startsWith("+9665")) {
      normalizedPhone = data.value.phone; // Already in correct format
    }

    const response = await request.post("/users/login", {
      phone: normalizedPhone,
      password: data.value.password,
    });

    if (response.status) {
      toast.add({
        severity: "success",
        summary: "نجاح",
        detail: "تم تسجيل الدخول بنجاح!",
        life: 3000,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      // Reset form
      data.value = {
        phone: "",
        password: "",
      };
      // Redirect to the 'redirect' query parameter or home
      const redirectPath = route.query.redirect || "/";
      router.push(redirectPath);
    } else {
      toast.add({
        severity: "error",
        summary: "خطأ",
        detail: "فشل في تسجيل الدخول، تحقق من بياناتك",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "حدث خطأ أثناء تسجيل الدخول",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300;
}
</style>
