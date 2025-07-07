<template>
  <div
    class="min-h-screen bg-gray-100 flex items-center justify-center p-6"
    dir="rtl"
  >
    <div class="bg-white w-full max-w-xl rounded-lg shadow-lg p-8">
      <h2 class="text-center text-2xl font-bold text-purple-600 mb-6">
        اتصل بنا
      </h2>

      <Toast />
      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- الاسم -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >الاسم الكامل</label
          >
          <InputText
            v-model="form.name"
            type="text"
            class="w-full"
            :class="{ 'p-invalid': errors.name }"
            placeholder="اكتب اسمك الكامل"
          />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>

        <!-- البريد -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >البريد الإلكتروني</label
          >
          <InputText
            v-model="form.email"
            type="email"
            class="w-full"
            :class="{ 'p-invalid': errors.email }"
            placeholder="example@email.com"
          />
          <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
        </div>

        <!-- رقم الهاتف -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >رقم الجوال</label
          >
          <InputText
            v-model="form.phone"
            type="text"
            class="w-full"
            :class="{ 'p-invalid': errors.phone }"
            placeholder="مثال: 9665xxxxxxx"
          />
          <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
        </div>

        <!-- الرسالة -->
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700"
            >رسالتك</label
          >
          <Textarea
            v-model="form.message"
            rows="4"
            class="w-full"
            :class="{ 'p-invalid': errors.message }"
            placeholder="اكتب رسالتك هنا"
          />
          <small v-if="errors.message" class="p-error">{{
            errors.message
          }}</small>
        </div>

        <!-- زر الإرسال -->
        <Button
          type="submit"
          label="إرسال الرسالة"
          :loading="formState"
          class="w-full bg-purple-600 hover:bg-purple-700"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Toast from "primevue/toast";
import request from "../../services/request";

const toast = useToast();
const form = reactive({
  name: "",
  email: "",
  phone: "",
  message: "",
});
const errors = reactive({
  name: "",
  email: "",
  phone: "",
  message: "",
});
const formState = ref(false);

const validateForm = () => {
  let isValid = true;
  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  // Name validation (at least 2 characters)
  if (!form.name || form.name.length < 2) {
    errors.name = "الاسم يجب أن يكون حرفين على الأقل";
    isValid = false;
  }

  // Email validation (basic email format)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = "البريد الإلكتروني غير صحيح";
    isValid = false;
  }

  // Phone validation (optional, but if provided, must match Saudi format: 9665xxxxxxxx)
  if (form.phone && !/^9665[0-9]{8}$/.test(form.phone)) {
    errors.phone = "رقم الجوال يجب أن يكون بالصيغة: 9665xxxxxxxx";
    isValid = false;
  }

  // Message validation (at least 10 characters)
  if (!form.message || form.message.length < 10) {
    errors.message = "الرسالة يجب أن تكون 10 أحرف على الأقل";
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى تصحيح الحقول المطلوبة",
      life: 3000,
    });
    return;
  }

  formState.value = true;
  try {
    const response = await request.post("/contact-messages", form);

    if (response.status) {
      toast.add({
        severity: "success",
        summary: "نجاح",
        detail: "تم إرسال رسالتك بنجاح!",
        life: 3000,
      });
      // Reset form
      Object.keys(form).forEach((key) => (form[key] = ""));
    } else {
      throw new Error("فشل في إرسال الرسالة");
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "حدث خطأ أثناء إرسال الرسالة",
      life: 3000,
    });
  } finally {
    formState.value = false;
  }
};
</script>

<style scoped>
:deep(.p-button) {
  @apply font-bold py-2 rounded-md;
}
:deep(.p-inputtext) {
  @apply border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300;
}
:deep(.p-textarea) {
  @apply border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none;
}
:deep(.p-invalid) {
  @apply border-red-500;
}
.p-error {
  @apply text-red-500 text-sm mt-1 block;
}
</style>
