<template>
  <div
    class="flex flex-col justify-center items-center pb-12 container"
    dir="rtl"
  >
    <div class="w-full max-w-xl rounded-lg">
      <h2
        class="text-center text-2xl text-secondary font-semibold my-6 section-divider-lg"
      >
        الإهداءات
      </h2>

      <Toast />

      <form class="gap-4">
        <!-- Giver Name -->
        <div class="w-full">
          <label class="block text-sm mb-1">اسم المهدي (اختياري)</label>
          <InputText
            v-model="form.giverName"
            class="input-field"
            placeholder="أدخل اسمك (اختياري)"
          />
        </div>

        <!-- Message -->
        <div class="col-span-2">
          <label class="block text-sm mb-1">نص الرسالة (اختياري)</label>
          <Textarea
            :invalid="form.message.length > 150"
            v-model="form.message"
            class="input-field"
            placeholder="أدخل رسالة الإهداء (اختياري)"
          />
        </div>

        <!-- Receiver Name and Phone -->
        <div class="w-full">
          <label class="block text-sm mb-1">اسم المهدي إليه</label>
          <InputText
            v-model="form.receiverName"
            class="input-field"
            placeholder="أدخل اسم المهدي إليه"
            @input="validateForm"
          />
          <p v-if="errors.receiverName" class="text-red-200 text-xs mt-1">
            {{ errors.receiverName }}
          </p>
        </div>
        <div class="w-full">
          <label class="block text-sm mb-1">رقم جوال المهدي إليه</label>
          <InputText
            v-model="form.receiverPhone"
            class="input-field"
            placeholder="أدخل رقم الجوال"
            @input="validateForm"
          />
          <p v-if="errors.receiverPhone" class="text-red-200 text-xs mt-1">
            {{ errors.receiverPhone }}
          </p>
        </div>

        <!-- Donation Amount -->
        <div class="col-span-2">
          <label class="block text-sm mb-1">مبلغ التبرع</label>
          <InputText
            type="number"
            v-model.number="form.amount"
            class="input-field"
            placeholder="أدخل مبلغ التبرع"
            @input="validateForm"
          />
          <p v-if="errors.amount" class="text-red-200 text-xs mt-1">
            {{ errors.amount }}
          </p>
        </div>

        <!-- Buttons -->
        <div class="mt-6 space-y-2 col-span-2 w-1/2 mx-auto">
          <Button
            severity="primary"
            label="تبرع الآن"
            class="w-full bg-primary-500 text-purple-600 font-bold rounded-md hover:bg-purple-100"
            :loading="isSubmitting"
            @click="donateNow"
          />
          <Button
            variant="outlined"
            label="أضف للسلة"
            class="w-full bg-transparent border border-white font-bold rounded-md hover:bg-purple-100 hover:text-purple-600"
            :loading="isSubmitting"
            @click="addToCart"
          />
        </div>
      </form>
    </div>
    <ValiditySection class="my-12" />
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from "primevue/toast";
import request from "../../services/request.js";
import Textarea from "primevue/textarea";
import { useRouter } from "vue-router";
import ValiditySection from "../Home/components/ValiditySection.vue";
const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const form = reactive({
  giverName: "",
  message: "",
  receiverName: "",
  receiverPhone: "",
  amount: "",
});
const errors = reactive({
  receiverName: "",
  receiverPhone: "",
  amount: "",
});

// Form validation
const validateForm = () => {
  errors.receiverName = form.receiverName ? "" : "يرجى إدخال اسم المهدي إليه";
  errors.receiverPhone = form.receiverPhone
    ? /^[0-9]{10}$/.test(form.receiverPhone)
      ? ""
      : "يرجى إدخال رقم جوال صالح (10 أرقام)"
    : "يرجى إدخال رقم جوال المهدي إليه";
  errors.amount =
    form.amount && form.amount > 0 ? "" : "يرجى إدخال مبلغ تبرع صالح";
  return !errors.receiverName && !errors.receiverPhone && !errors.amount;
};

// Donate Now handler
const donateNow = async () => {
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
    const cartItem = {
      amount: form.amount,
      giver_name: form.giverName,
      receiver_name: form.receiverName,
      receiver_phone: form.receiverPhone,
      message: form.message,
    };
    localStorage.removeItem("cart");

    // Add to localStorage
    const cart = JSON.parse(
      localStorage.getItem("cart") || '{"gifts":[],"donations":[]}'
    );
    cart.gifts.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    // Reset form
    Object.assign(form, {
      giverName: "",
      message: "",
      receiverName: "",
      receiverPhone: "",
      amount: "",
    });
    router.push("/checkout");
  } catch (error) {
    console.error("Error adding to cart:", error);
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

// Add to Cart handler
const addToCart = () => {
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
    const cartItem = {
      amount: form.amount,
      giver_name: form.giverName,
      receiver_name: form.receiverName,
      receiver_phone: form.receiverPhone,
      message: form.message,
    };

    // Add to localStorage
    const cart = JSON.parse(
      localStorage.getItem("cart") || "{gifts:[],donations:[]}"
    );
    cart.gifts.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    toast.add({
      severity: "success",
      summary: "نجاح",
      detail: "تمت الإضافة إلى السلة!",
      life: 3000,
    });
    // Reset form
    Object.assign(form, {
      giverName: "",
      message: "",
      receiverName: "",
      receiverPhone: "",
      amount: "",
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
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
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300;
}
</style>
