<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gray-100"
    dir="rtl"
  >
    <div
      class="w-full max-w-sm bg-purple-400 text-white p-6 rounded-lg shadow-md"
    >
      <h2 class="text-center text-lg font-semibold mb-6">تسجيل عضوية جديدة</h2>

      <Toast />

      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">الاسم الكامل</label>
          <InputText
            v-model="data.name"
            placeholder="أدخل الاسم الكامل"
            class="input-field"
            @input="validateForm"
          />
          <p v-if="errors.name" class="text-red-200 text-xs mt-1">
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label class="block text-sm mb-1">رقم الجوال</label>
          <InputText
            v-model="data.phone"
            placeholder="أدخل رقم الجوال (مثال: 9665XXXXXXXX أو 05XXXXXXXX)"
            class="input-field"
            @input="validateForm"
          />
          <p v-if="errors.phone" class="text-red-200 text-xs mt-1">
            {{ errors.phone }}
          </p>
        </div>

        <div>
          <label class="block text-sm mb-1">البريد الإلكتروني</label>
          <InputText
            v-model="data.email"
            type="email"
            placeholder="أدخل البريد الإلكتروني"
            class="input-field"
            @input="validateForm"
          />
          <p v-if="errors.email" class="text-red-200 text-xs mt-1">
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label class="block text-sm mb-1">كلمة المرور</label>
          <InputText
            type="password"
            v-model="data.password"
            placeholder="أدخل كلمة المرور"
            class="input-field"
            @input="validateForm"
          />
          <p v-if="errors.password" class="text-red-200 text-xs mt-1">
            {{ errors.password }}
          </p>
        </div>

        <Button
          type="submit"
          label="تسجيل"
          class="w-full bg-white text-purple-600 font-bold rounded-md hover:bg-purple-100"
          :loading="isSubmitting"
        />

        <div class="text-center text-sm mt-4">
          <p class="text-white">
            لديك عضوية؟
            <a href="/login" class="underline">تسجيل الدخول</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter, useRoute } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from "primevue/toast";
import request from "../../services/request";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const isSubmitting = ref(false);

const data = ref({
  name: "",
  phone: "",
  email: "",
  password: "",
});

const errors = reactive({
  name: "",
  phone: "",
  email: "",
  password: "",
});

// Error messages for query parameter errors
const errorMessages = {
  registration_failed: "فشل التسجيل. يرجى المحاولة مرة أخرى.",
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
  // Validate name
  errors.name = data.value.name
    ? data.value.name.length >= 2
      ? ""
      : "الاسم يجب أن يحتوي على حرفين على الأقل"
    : "يرجى إدخال الاسم الكامل";

  // Validate Saudi phone number
  errors.phone = "";
  if (!data.value.phone) {
    errors.phone = "يرجى إدخال رقم الجوال";
  } else {
    // Saudi numbers start with 9665, 05, or +9665 followed by 8 digits
    const saudiPhoneRegex = /^(05\d{8}$)|(05\d{8}$)|(05\d{8}$)/;
    if (!saudiPhoneRegex.test(data.value.phone)) {
      errors.phone =
        "يرجى إدخال رقم جوال سعودي صالح (مثال: 9665XXXXXXXX أو 05XXXXXXXX)";
    }
  }

  // Validate email
  errors.email = data.value.email
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.value.email)
      ? ""
      : "يرجى إدخال بريد إلكتروني صالح"
    : "يرجى إدخال البريد الإلكتروني";

  // Validate password
  errors.password = data.value.password
    ? data.value.password.length >= 6
      ? ""
      : "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
    : "يرجى إدخال كلمة المرور";

  return !errors.name && !errors.phone && !errors.email && !errors.password;
};

// Register handler
const register = async () => {
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

    const response = await request.post("/users/donor-register", {
      name: data.value.name,
      phone: normalizedPhone,
      email: data.value.email,
      password: data.value.password,
    });

    if (response.status) {
      toast.add({
        severity: "success",
        summary: "نجاح",
        detail: "تم التسجيل بنجاح! يرجى تسجيل الدخول.",
        life: 3000,
      });
      // Reset form
      data.value = {
        name: "",
        phone: "",
        email: "",
        password: "",
      };
      localStorage.setItem("accessToken", response.data.accessToken);
      // Redirect to login page with optional redirect query
      const redirectPath = route.query.redirect || "/";
      router.push(redirectPath);
    } else {
      toast.add({
        severity: "error",
        summary: "خطأ",
        detail: "فشل التسجيل، تحقق من بياناتك",
        life: 3000,
      });
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: error.response?.data?.message || "حدث خطأ أثناء التسجيل",
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
