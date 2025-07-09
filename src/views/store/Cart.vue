<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
    <Toast />
    <div
      class="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
    >
      <!-- Header -->
      <header class="text-center">
        <h2
          class="text-2xl sm:text-3xl font-bold text-purple-800 tracking-tight"
        >
          سلة التبرعات
        </h2>
        <p class="text-gray-500 mt-2 text-sm sm:text-base">
          راجع تبرعاتك وهداياك قبل المتابعة للدفع
        </p>
      </header>

      <!-- Donation Cases -->
      <section
        v-if="donationCases.length"
        class="border-t border-gray-200 pt-6"
      >
        <h3
          class="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"
        >
          <i class="pi pi-heart text-purple-600"></i>
          حالات التبرع
        </h3>
        <ul class="space-y-4">
          <li
            v-for="(item, index) in donationCases"
            :key="'case-' + item.id + '-' + index"
            class="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div class="flex items-center gap-4 w-full sm:w-auto">
              <Image
                :src="
                  item?.image_url
                    ? `${$store?.state?.baseUrl}${
                        item?.image_url?.split('public/')[1]
                      }`
                    : placeholder
                "
                alt="صورة حالة التبرع"
                imageClass="w-16 h-16 object-cover rounded-lg"
                preview
                loading="lazy"
              />
              <div class="flex-1">
                <p class="font-semibold text-gray-900 text-base sm:text-lg">
                  {{ item.title }}
                </p>
                <p
                  class="text-purple-600 font-medium text-sm sm:text-base mt-1"
                >
                  المبلغ: {{ (item.amount * item.qty).toLocaleString() }} ريال
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <Button
                    icon="pi pi-minus"
                    severity="secondary"
                    rounded
                    text
                    @click="updateQuantity(index, -1)"
                    :disabled="item.qty <= 1"
                    aria-label="تقليل الكمية"
                  />
                  <InputNumber
                    v-model="item.qty"
                    :min="1"
                    class="w-16 text-center"
                    inputClass="text-center rounded-lg border-gray-300"
                    @input="updateQuantityFromInput(index)"
                    showButtons
                    buttonLayout="horizontal"
                  />
                  <Button
                    icon="pi pi-plus"
                    severity="secondary"
                    rounded
                    text
                    @click="updateQuantity(index, 1)"
                    aria-label="زيادة الكمية"
                  />
                </div>
              </div>
            </div>
            <Button
              icon="pi pi-trash"
              severity="danger"
              rounded
              text
              @click="removeCase(index)"
              aria-label="حذف حالة التبرع"
            />
          </li>
        </ul>
      </section>

      <!-- Donation Gifts -->
      <section
        v-if="donationGifts.length"
        class="border-t border-gray-200 pt-6"
      >
        <h3
          class="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"
        >
          <i class="pi pi-gift text-purple-600"></i>
          هدايا التبرع
        </h3>
        <ul class="space-y-4">
          <li
            v-for="(gift, index) in donationGifts"
            :key="'gift-' + gift.id + '-' + index"
            class="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div class="flex-1">
              <p class="font-semibold text-gray-900 text-base sm:text-lg">
                من {{ gift.giver_name }} إلى {{ gift.receiver_name }}
              </p>
              <p class="text-gray-600 text-sm sm:text-base mt-1">
                الهاتف: {{ gift.receiver_phone }}
              </p>
              <p class="text-purple-600 font-medium text-sm sm:text-base mt-1">
                المبلغ: {{ gift.amount.toLocaleString() }} ريال
              </p>
            </div>
            <Button
              icon="pi pi-trash"
              severity="danger"
              rounded
              text
              @click="removeGift(index)"
              aria-label="حذف هدية التبرع"
            />
          </li>
        </ul>
      </section>

      <!-- Empty Cart -->
      <div
        v-if="!donationCases.length && !donationGifts.length"
        class="text-center py-12"
      >
        <i class="pi pi-shopping-cart text-gray-400 text-4xl mb-4"></i>
        <p class="text-gray-500 text-lg">السلة فارغة حالياً</p>
        <Button
          label="تصفح التبرعات"
          severity="primary"
          class="mt-4"
          @click="router.push('/donations')"
        />
      </div>

      <!-- Summary and Checkout -->
      <footer
        v-if="donationCases.length || donationGifts.length"
        class="border-t border-gray-200 pt-6 mt-auto"
      >
        <div class="flex justify-between items-center mb-6">
          <span class="text-lg sm:text-xl font-semibold text-gray-900"
            >المجموع الكلي:</span
          >
          <span class="text-xl sm:text-2xl font-bold text-purple-700"
            >{{ totalAmount.toLocaleString() }} ريال</span
          >
        </div>
        <Button
          label="الذهاب للدفع"
          icon="pi pi-credit-card"
          class="w-full text-lg py-3"
          severity="primary"
          rounded
          @click="proceedToPayment"
          :disabled="isProcessing"
          :loading="isProcessing"
        />
      </footer>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
const router = useRouter();
const toast = useToast();
const placeholder = "/images/services.jpeg";

// Initialize cart from localStorage
const cart = reactive(
  JSON.parse(localStorage.getItem("cart") || '{"gifts":[],"donations":[]}')
);

// Reactive references for donations and gifts
const donationCases = reactive(cart.donations);
const donationGifts = reactive(cart.gifts);

// Compute total amount
const totalAmount = computed(() => {
  const caseTotal = donationCases.reduce(
    (sum, item) => sum + item.amount * (item.qty || 1),
    0
  );
  const giftTotal = donationGifts.reduce((sum, gift) => sum + gift.amount, 0);
  return caseTotal + giftTotal;
});

// Remove donation case
const removeCase = (index) => {
  donationCases.splice(index, 1);
  updateCart();
  toast.add({
    severity: "success",
    summary: "نجاح",
    detail: "تم حذف حالة التبرع من السلة",
    life: 3000,
  });
};

// Remove donation gift
const removeGift = (index) => {
  donationGifts.splice(index, 1);
  updateCart();
  toast.add({
    severity: "success",
    summary: "نجاح",
    detail: "تم حذف هدية التبرع من السلة",
    life: 3000,
  });
};

// Update quantity for donation case
const updateQuantity = (index, change) => {
  const newQty = (donationCases[index].qty || 1) + change;
  if (newQty < 1) return;
  donationCases[index].qty = newQty;
  updateCart();
  toast.add({
    severity: "success",
    summary: "نجاح",
    detail: `تم تحديث الكمية إلى ${newQty}`,
    life: 3000,
  });
};

// Update quantity from input
const updateQuantityFromInput = (index) => {
  const qty = donationCases[index].qty;
  if (qty < 1 || isNaN(qty)) {
    donationCases[index].qty = 1;
    toast.add({
      severity: "error",
      summary: "خطأ",
      detail: "الكمية يجب أن تكون أكبر من صفر",
      life: 3000,
    });
  }
  updateCart();
};

// Update localStorage
const updateCart = () => {
  localStorage.setItem(
    "cart",
    JSON.stringify({
      gifts: donationGifts,
      donations: donationCases,
    })
  );
};

// Proceed to payment
const proceedToPayment = () => {
  toast.add({
    severity: "info",
    summary: "معلومات",
    detail: "جارٍ الانتقال إلى صفحة الدفع...",
    life: 3000,
  });
  router.push("/checkout");
  // Add your payment logic here
};
</script>

<style scoped>
.Button {
  @apply rounded-lg;
}
.InputText {
  @apply px-3 py-1 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-300;
}
.Image {
  @apply rounded-md;
}
</style>
