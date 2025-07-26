<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
      <!-- Profile Header -->
      <div class="flex flex-col items-center mb-8">
        <h2 class="text-3xl font-bold text-purple-700 mb-4">الملف الشخصي</h2>
        <div
          class="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4"
        >
          <i class="pi pi-user text-4xl text-purple-600"></i>
        </div>
      </div>

      <!-- Loading State -->
      <ProgressSpinner v-if="loading" class="flex justify-center mx-auto" />

      <!-- Error State -->
      <Message v-if="error" severity="error" class="mb-6">
        {{ error }}
      </Message>

      <!-- User Profile -->
      <div v-else-if="user" class="space-y-6">
        <!-- User Details -->
        <div class="bg-gray-50 p-6 rounded-lg shadow-sm text-right">
          <p class="text-lg font-semibold text-gray-800">
            الاسم: {{ user.name }}
          </p>
          <p class="text-gray-600 mt-2">البريد الإلكتروني: {{ user.email }}</p>
          <p class="text-gray-600 mt-2">
            رقم الهاتف: {{ user.phone || "غير متوفر" }}
          </p>
          <div class="flex items-center mt-4">
            <Button
              label="تعديل الملف الشخصي"
              icon="pi pi-pencil"
              class="bg-purple-600 me-4 hover:bg-purple-700 transition-colors duration-200"
              @click="openEditDialog"
            />

            <Button
              label="تسجيل الخروج"
              icon="pi pi-sign-out"
              severity="danger"
              @click="logout"
            />
          </div>
        </div>

        <!-- Tabs for Donations and Payments -->
        <TabView>
          <!-- Donations Tab -->
          <TabPanel header="تبرعاتي">
            <div class="mt-6">
              <div v-if="donationsLoading" class="flex justify-center">
                <ProgressSpinner class="w-8 h-8" />
              </div>
              <Message v-else-if="donationsError" severity="error" class="mb-4">
                {{ donationsError }}
              </Message>
              <div v-else-if="user.donations.length" class="space-y-4">
                <div
                  v-for="donation in user.donations"
                  :key="donation.id"
                  class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <p><strong>المبلغ:</strong> {{ donation.amount }} ريال</p>
                  <p>
                    <strong>الحالة:</strong>
                    <span
                      :class="
                        donation.status === 'paid'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      "
                    >
                      {{
                        donation.status === "paid" ? "مدفوع" : "قيد الانتظار"
                      }}
                    </span>
                  </p>
                  <p>
                    <strong>التاريخ:</strong>
                    {{ formatDate(donation.createdAt) }}
                  </p>
                  <p v-if="donation.case_id">
                    <strong>نوع التبرع:</strong> تبرع لحالة
                    {{ donation.case?.title }}
                  </p>
                  <p v-if="donation.gift">
                    <strong>نوع التبرع:</strong> اهداء الى
                    {{ donation.gift?.receiver_name }}
                  </p>
                </div>
              </div>
              <p v-else class="text-gray-500 text-center">
                لا توجد تبرعات مسجلة.
              </p>
            </div>
          </TabPanel>

          <!-- Payments Tab -->
          <TabPanel header="مدفوعاتي">
            <div class="mt-6">
              <div v-if="paymentsLoading" class="flex justify-center">
                <ProgressSpinner class="w-8 h-8" />
              </div>
              <Message v-else-if="paymentsError" severity="error" class="mb-4">
                {{ paymentsError }}
              </Message>
              <div v-else-if="user.payments.length" class="space-y-4">
                <div
                  v-for="payment in user.payments"
                  :key="payment.id"
                  class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <p><strong>المبلغ:</strong> {{ payment.amount }} ريال</p>
                  <p>
                    <strong>الحالة:</strong>
                    <span
                      :class="{
                        'text-green-600': payment.payment_status === 'success',
                        'text-red-600': payment.payment_status === 'failed',
                        'text-yellow-600': payment.payment_status === 'pending',
                      }"
                    >
                      {{
                        payment.payment_status === "success"
                          ? "ناجح"
                          : payment.payment_status === "failed"
                          ? "فاشل"
                          : "قيد الانتظار"
                      }}
                    </span>
                  </p>
                  <p>
                    <strong>التاريخ:</strong>
                    {{ formatDate(payment.createdAt) }}
                  </p>
                  <p v-if="payment.payment_status == 'success'">
                    <router-link
                      :to="`/donation-reciept?payment_id=${payment.payment_id}`"
                      target="_blank"
                      class="text-purple-600 hover:underline"
                    >
                      عرض الإيصال
                    </router-link>
                  </p>
                </div>
              </div>
              <p v-else class="text-gray-500 text-center">
                لا توجد مدفوعات مسجلة.
              </p>
            </div>
          </TabPanel>
        </TabView>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && !error" class="text-center py-6">
        <p class="text-gray-500">لا توجد بيانات للملف الشخصي.</p>
      </div>

      <!-- Toast -->
      <Toast />

      <!-- Edit Profile Dialog -->
      <Dialog
        v-model:visible="showDialog"
        header="تعديل الملف الشخصي"
        :modal="true"
        class="w-full max-w-md"
      >
        <form @submit.prevent="saveProfile" class="space-y-6">
          <!-- Name -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700"
              >الاسم</label
            >
            <InputText
              v-model="form.name"
              type="text"
              class="w-full"
              :class="{ 'p-invalid': errors.name }"
              placeholder="أدخل اسمك"
              required
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <!-- Email -->
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
              required
            />
            <small v-if="errors.email" class="p-error">{{
              errors.email
            }}</small>
          </div>

          <!-- Phone -->
          <div>
            <label class="block mb-1 text-sm font-medium text-gray-700"
              >رقم الهاتف</label
            >
            <InputText
              v-model="form.phone"
              type="text"
              class="w-full"
              :class="{ 'p-invalid': errors.phone }"
              placeholder="مثال: 9665xxxxxxxx"
            />
            <small v-if="errors.phone" class="p-error">{{
              errors.phone
            }}</small>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-2 space-x-reverse">
            <Button
              label="إلغاء"
              icon="pi pi-times"
              class="p-button-text p-button-secondary"
              @click="showDialog = false"
            />
            <Button
              type="submit"
              label="حفظ التعديلات"
              icon="pi pi-check"
              class="bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
              :loading="formState"
            />
          </div>
        </form>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import Message from "primevue/message";
import ProgressSpinner from "primevue/progressspinner";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import request from "../../services/request"; // Your custom request service
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();
const user = ref(null);
const loading = ref(false);
const error = ref(null);
const showDialog = ref(false);
const formState = ref(false);
const donationsLoading = ref(false);
const donationsError = ref(null);
const paymentsLoading = ref(false);
const paymentsError = ref(null);

const form = reactive({
  name: "",
  email: "",
  phone: "",
});

const errors = reactive({
  name: "",
  email: "",
  phone: "",
});

const fetchUser = async () => {
  loading.value = true;
  try {
    const response = await request.get("/tokens/profile");
    user.value = response.data;

    Object.assign(form, {
      name: user.value.name || "",
      email: user.value.email || "",
      phone: user.value.phone || "",
    });
  } catch (err) {
    error.value = "فشل في تحميل بيانات الملف الشخصي. حاول مرة أخرى.";
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  if (!form.name || form.name.length < 2) {
    errors.name = "الاسم يجب أن يكون حرفين على الأقل";
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = "البريد الإلكتروني غير صحيح";
    isValid = false;
  }

  if (form.phone && !/^9665[0-9]{8}$/.test(form.phone)) {
    errors.phone = "رقم الهاتف يجب أن يكون بالصيغة: 9665xxxxxxxx";
    isValid = false;
  }

  return isValid;
};

const openEditDialog = () => {
  showDialog.value = true;
};

const saveProfile = async () => {
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
    await request.put(`/users/profile/${user?.value.id}`, form);
    toast.add({
      severity: "success",
      summary: "نجاح",
      detail: "تم تحديث الملف الشخصي بنجاح!",
      life: 3000,
    });
    user.value = { ...user.value, ...form };
    showDialog.value = false;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "فشل في تحديث الملف الشخصي",
      life: 3000,
    });
  } finally {
    formState.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const logout = async () => {
  await request.post("tokens/logout");
  localStorage.removeItem("accessToken");
  toast.add({
    severity: "success",
    summary: "نجاح",
    detail: "تم تسجيل الخروج بنجاح!",
    life: 3000,
  });
  router.push("/");
};

onMounted(() => {
  fetchUser();
});
</script>
