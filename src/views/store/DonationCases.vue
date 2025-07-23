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

    <!-- No Results Message -->
    <div v-if="projects.length === 0">
      <NoData />
    </div>

    <!-- Cases Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-secondary text-white rounded-lg p-4 shadow-md flex flex-col justify-between"
      >
        <!-- صورة المشروع -->
        <div
          class="w-full flex flex-col items-center bg-white rounded-2xl shadow-md overflow-hidden relative"
        >
          <!-- صورة المشروع -->
          <router-link :to="`/donation-cases-details/${project.id}`">
            <Image
              :src="
                project?.image_url
                  ? `${$store?.state?.baseUrl}${
                      project?.image_url?.split('public/')[1]
                    }`
                  : placeholder
              "
              imageClass="w-full h-56 object-cover transition-all duration-500"
              preview
              alt="صورة المشروع"
              class="w-full h-56 object-contain object-center"
            />
          </router-link>

          <!-- غطاء أخضر عند الاكتمال -->
          <div
            v-if="project?.progress >= 100 || project.status == 'completed'"
            class="absolute inset-0 bg-green-500/10 flex items-center justify-center"
          >
            <Image
              src="/images/donation_complete.webp"
              class="w-32 h-32 object-contain"
            />
          </div>

          <!-- Progress Bar -->
          <div class="w-full px-4 py-3">
            <div
              v-if="project?.progress < 100 && project.status != 'completed'"
              class="w-full bg-purple-300 rounded-full h-5 relative overflow-hidden"
            >
              <div
                :style="`width: ${project.progress}%`"
                class="absolute top-0 right-0 h-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs font-bold flex items-center justify-center rounded-full transition-all duration-700 ease-in-out"
              >
                <span class="ms-12 relative z-40">
                  {{ project.progress }}%
                </span>
              </div>
            </div>

            <!-- تم الاكتمال -->
            <div
              v-else
              class="w-full bg-green-600 text-white text-xs font-bold text-center py-1 rounded-full transition-all duration-500"
            >
              تم إكمال التبرع بنجاح
            </div>
          </div>
        </div>

        <div class="">
          <div class="w-full grid-2 gap-4 text-right mt-4">
            <!-- Project Title with Link -->
            <router-link
              :to="`/case/${project.id}`"
              class="text-sm hover:underline"
            >
              {{ project.title }}
            </router-link>

            <!-- Target Amount -->
            <div class="text-center">
              <p class="text-xs text-white/90 mt-1">المبلغ المطلوب:</p>
              <p class="font-semibold text-white/90 mt-1">
                {{ project.target_amount.toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- إدخال مبلغ (only if not completed) -->
          <InputText
            v-if="project?.progress < 100 && project.status != 'completed'"
            v-model.number="project.amount"
            type="number"
            placeholder="مبلغ التبرع"
            class="mt-3 w-full text-sm text-right"
          />

          <!-- الأزرار (only if not completed) -->
          <div
            v-if="project?.progress < 100 && project.status != 'completed'"
            class="flex justify-between gap-2 mt-4 w-full"
          >
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

        <!-- Social Media Sharing and Copy URL -->
        <div class="flex justify-between items-center gap-2 mt-4">
          <!-- Case Number with Copy Button -->
          <div class="flex items-center gap-2">
            <p class="font-semi-bold text-white/90">
              رقم الحالة: #00{{ project.id }}
            </p>
            <button
              @click="copyCaseUrl(getProjectUrl(project.id))"
              class="text-white hover:text-white"
              title="نسخ رابط الحالة"
            >
              <i class="fas fa-link w-5 h-5"></i>
            </button>
          </div>
          <div class="">
            <div class="flex gap-2 items-center">
              <!-- Facebook -->
              <a
                :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  getProjectUrl(project.id)
                )}`"
                target="_blank"
                class="text-white hover:text-white"
                title="مشاركة على فيسبوك"
              >
                <i class="fab fa-facebook-f w-5 h-5"></i>
              </a>
              <!-- Twitter/X -->
              <a
                :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  'تبرع الآن لمشروع: ' +
                    project.title +
                    ' | رقم الحالة: #00' +
                    project.id +
                    ' | المبلغ المطلوب: ' +
                    project.target_amount.toLocaleString()
                )}&url=${encodeURIComponent(getProjectUrl(project.id))}`"
                target="_blank"
                class="text-white hover:text-white"
                title="مشاركة على تويتر"
              >
                <i class="fab fa-x-twitter w-5 h-5"></i>
              </a>
              <!-- LinkedIn -->
              <a
                :href="`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  getProjectUrl(project.id)
                )}`"
                target="_blank"
                class="text-white hover:text-white"
                title="مشاركة على لينكدإن"
              >
                <i class="fab fa-linkedin-in w-5 h-5"></i>
              </a>
              <!-- Snapchat -->
              <a
                :href="`https://www.snapchat.com/share?url=${encodeURIComponent(
                  getProjectUrl(project.id)
                )}&text=${encodeURIComponent(
                  'تبرع الآن لمشروع: ' + project.title
                )}`"
                target="_blank"
                class="text-white hover:text-white"
                title="مشاركة على سناب شات"
              >
                <i class="fab fa-snapchat-ghost w-5 h-5"></i>
              </a>
            </div>
          </div>
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
function copyCaseUrl(url) {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "نجاح",
        detail: `تم نسخ رابط الحالة بنجاح`,
        life: 3000,
      });
    })
    .catch(() => {
      alert("فشل في نسخ رابط الحالة، حاول مرة أخرى.");
    });
}
// Fetch cases from the API
const fetchCases = async () => {
  isLoading.value = true;
  try {
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
    projects.value = [];
    pagination.total = 0;
    pagination.current_page = 1;
    pagination.last_page = 1;
  } finally {
    isLoading.value = false;
  }
};

// Function to generate project details page URL
const getProjectUrl = (projectId) => {
  return `${window.location.origin}/donation-cases-details/${projectId}`;
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
  window.scrollTo(0, 0);
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
