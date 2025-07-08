<template>
  <div class="p-6 bg-white container" dir="rtl">
    <Toast />

    <h2
      v-if="type == 'major'"
      class="text-center text-xl font-semibold text-purple-600 my-8"
    >
      حالات كبري
    </h2>
    <h2
      v-if="type == 'minor'"
      class="text-center text-xl font-semibold text-purple-600 my-8"
    >
      حالات صغرى
    </h2>
    <h2
      v-if="type == 'urgent'"
      class="text-center text-xl font-semibold text-purple-600 my-8"
    >
      حالات عاجلة
    </h2>

    <!-- Search Input -->
    <div class="mb-6 flex items-center justify-center gap-2">
      <InputText
        v-model="options.search"
        placeholder="ابحث عن حالة تبرع..."
        class="w-full sm:w-1/2 text-right"
        @input="debouncedSearch"
      />
      <Button
        v-if="options.search"
        label="إلغاء"
        severity="secondary"
        @click="clearSearch"
      />
    </div>

    <!-- Loading State -->

    <!-- No Results Message -->
    <div v-if="projects.length === 0">
      <NoData />
    </div>

    <!-- Cases Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-secondary text-white rounded-lg p-4 shadow-md flex flex-col"
      >
        <!-- صورة المشروع -->
        <div
          class="w-full h-40 flex-col-center bg-white rounded-md overflow-hidden relative"
        >
          <Image
            :src="
              project?.image_url
                ? `${$store?.state?.baseUrl}${
                    project?.image_url?.split('public/')[1]
                  }`
                : placeholder
            "
            imageClass="w-full h-full object-cover"
            preview
            alt="صورة الحساب"
            class="w-full h-full !object-cover !object-center"
          />
        </div>
        <div
          :style="`width: ${project.progress}%`"
          class="text-xs -mt-3 mb-6 z-40 font-semibold bg-white text-black p-1 rounded-3xl"
        >
          {{ project.progress }}%
        </div>

        <!-- التفاصيل -->
        <div class="w-full grid-2 gap-4 text-right">
          <p class="text-sm">{{ project.title }}</p>
          <div class="text-center">
            <p class="text-xs text-white/90 mt-1">المبلغ المطلوب:</p>
            <p class="text-xs text-white/90 mt-1">
              {{ project.target_amount.toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- إدخال مبلغ -->
        <InputText
          v-model.number="project.amount"
          type="number"
          placeholder="مبلغ التبرع"
          class="mt-3 w-full text-sm text-right"
        />

        <!-- الأزرار -->
        <div class="flex justify-between gap-2 mt-4 w-full">
          <Button
            label="الدفع الآن"
            severity="secondary"
            class="flex-1"
            @click="payNow(project)"
          />
          <Button
            label="أضف للسلة"
            severity="secondary"
            class="flex-1"
            @click="addToCart(project)"
          />
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="pagination.last_page > 1" class="flex justify-center gap-2 mt-6">
      <Button
        label="السابق"
        :disabled="pagination.current_page === 1"
        @click="changePage(pagination.current_page - 1)"
      />
      <Button
        v-for="page in visiblePages"
        :key="page"
        :label="page.toString()"
        :severity="pagination.current_page === page ? 'primary' : 'secondary'"
        @click="changePage(page)"
      />
      <Button
        label="التالي"
        :disabled="pagination.current_page === pagination.last_page"
        @click="changePage(pagination.current_page + 1)"
      />
    </div>

    <ValiditySection class="my-12" />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { debounce } from "lodash";
import request from "../../services/request.js";
import InputText from "primevue/inputtext";
import { useRoute, useRouter } from "vue-router";
import NoData from "../../components/NoData.vue";
import ValiditySection from "../Home/components/ValiditySection.vue";

const route = useRoute();
const router = useRouter();
const type = route.params.type;
const toast = useToast();
const placeholder = "/images/main-logo.png";
const isLoading = ref(false);
const projects = ref([]);
const options = reactive({
  col: "title",
  search: "",
  type: route.params.type,
  page: 1,
  limit: 12,
});
const pagination = reactive({
  total: 0,
  current_page: 1,
  last_page: 1,
});

// Compute total amount in cart
const totalAmount = computed(() => {
  return cart.donations.reduce((sum, item) => sum + item.amount * item.qty, 0);
});

// Compute last_page based on total and limit
const lastPage = computed(() => {
  return Math.ceil(pagination.total / options.limit) || 1;
});

// Compute visible page numbers for compact pagination
const visiblePages = computed(() => {
  const pages = [];
  const maxPages = 5;
  let start = Math.max(1, pagination.current_page - Math.floor(maxPages / 2));
  let end = Math.min(lastPage.value, start + maxPages - 1);

  if (end === lastPage.value) {
    start = Math.max(1, end - maxPages + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Fetch cases from the API
const fetchCases = async () => {
  isLoading.value = true;
  try {
    console.log({ type: route.params.type });

    const response = await request.post("cases/by-type", options);
    if (response.status) {
      projects.value = response.data.map((project) => ({
        ...project,
        amount: project.amount || 0,
      }));
      pagination.total = response.tot || 0;
      pagination.current_page = options.page;
      pagination.last_page = lastPage.value;
    } else {
      projects.value = [];
      pagination.total = 0;
      pagination.current_page = 1;
      pagination.last_page = 1;
    }
  } catch (error) {
    console.error("Error fetching cases:", error);
    projects.value = [];
    pagination.total = 0;
    pagination.current_page = 1;
    pagination.last_page = 1;
  } finally {
    isLoading.value = false;
  }
};

// Debounced search
const debouncedSearch = debounce(() => {
  options.page = 1;
  pagination.current_page = 1;
  fetchCases();
}, 500);

// Clear search
const clearSearch = () => {
  options.search = "";
  options.page = 1;
  pagination.current_page = 1;
  fetchCases();
};

// Change page
const changePage = (page) => {
  if (page < 1 || page > lastPage.value) return;
  options.page = page;
  pagination.current_page = page;
  fetchCases();
};

// Pay Now button handler
const payNow = (project) => {
  if (!project.amount || project.amount <= 0) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى إدخال مبلغ تبرع صالح",
      life: 3000,
    });
    return;
  }

  localStorage.removeItem("cart");

  // Add to localStorage
  const cart = JSON.parse(
    localStorage.getItem("cart") || '{"gifts":[],"donations":[]}'
  );
  cart.donations.push({ ...project, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));

  toast.add({
    severity: "success",
    summary: "نجاح",
    detail: `تم إضافة ${project.title} إلى السلة`,
    life: 3000,
  });

  router.push("/checkout");
};

// Add to Cart button handler
const addToCart = (project) => {
  // Add to localStorage
  const cart = JSON.parse(
    localStorage.getItem("cart") || '{"gifts":[],"donations":[]}'
  );
  if (!project.amount || project.amount <= 0) {
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "يرجى إدخال مبلغ تبرع صالح",
      life: 3000,
    });
    return;
  }

  const existingItem = cart.donations.find((item) => item.id === project.id);
  if (existingItem) {
    existingItem.qty = (existingItem.qty || 1) + 1;
    existingItem.amount = project.amount; // Update amount if changed
  } else {
    cart.donations.push({ ...project, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  toast.add({
    severity: "success",
    summary: "نجاح",
    detail: `تم إضافة ${project.title} إلى السلة`,
    life: 3000,
  });
};

// Fetch cases when the component is mounted
onMounted(fetchCases);

// watch(
//   () => route.params.type,
//   (newType) => {
//     const validTypes = ["major", "minor", "urgent", "all", ""];
//     const type = validTypes.includes(newType)
//       ? newType === "all"
//         ? ""
//         : newType
//       : "";
//     if (type !== options.type) {
//       options.type = type;
//       options.page = 1;
//       pagination.current_page = 1;
//       fetchCases();
//     }
//   },
//   { immediate: true }
// );
</script>

<style scoped>
.Button {
  @apply rounded-lg;
}
.p-inputtext {
  @apply px-3 py-1 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300;
}
</style>
