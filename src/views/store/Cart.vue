<template>
  <div class="min-h-screen my-20 bg-gray-50 p-6" dir="rtl">
    <Toast />
    <div
      class="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 flex flex-col"
    >
      <h2
        class="text-3xl font-extrabold text-purple-700 mb-8 text-center tracking-wide"
      >
        سلة التبرعات
      </h2>

      <!-- حالات التبرع -->
      <section v-if="donationCases.length" class="mb-8">
        <h3
          class="text-lg font-semibold text-gray-800 mb-4 border-b border-purple-300 pb-2"
        >
          حالات التبرع
        </h3>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="(item, index) in donationCases"
            :key="'case-' + item.id + '-' + index"
            class="flex justify-between items-center py-4"
          >
            <div class="flex items-center gap-4">
              <Image
                :src="item.image_url || placeholder"
                alt="case image"
                class="w-16 h-16 object-cover rounded-md"
                preview
              />
              <div>
                <p class="font-semibold text-gray-900 text-lg">
                  {{ item.title }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <p class="text-purple-600 font-medium">
                    المبلغ: {{ (item.amount * item.qty).toLocaleString() }} ريال
                  </p>
                  <div class="flex items-center gap-1">
                    <Button
                      icon="pi pi-minus"
                      severity="secondary"
                      text
                      @click="updateQuantity(index, -1)"
                      :disabled="item.qty <= 1"
                    />
                    <InputText
                      v-model="item.qty"
                      type="number"
                      class="w-16 text-center"
                      @input="updateQuantityFromInput(index)"
                    />
                    <Button
                      icon="pi pi-plus"
                      severity="secondary"
                      text
                      @click="updateQuantity(index, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              @click="removeCase(index)"
              aria-label="حذف حالة التبرع"
            >
              <span class="mr-1 text-sm font-semibold">حذف</span>
            </Button>
          </li>
        </ul>
      </section>

      <section v-if="donationGifts.length" class="mb-8">
        <h3
          class="text-lg font-semibold text-gray-800 mb-4 border-b border-purple-300 pb-2"
        >
          هدايا التبرع
        </h3>
        <ul class="divide-y divide-gray-200">
          <li
            v-for="(gift, index) in donationGifts"
            :key="'gift-' + index"
            class="flex justify-between items-center py-4"
          >
            <div>
              <p class="font-semibold text-gray-900 text-lg">
                من {{ gift.giver_name }} الى {{ gift.receiver_name }}
              </p>
              <p class="font-semibold text-gray-900 text-lg">
                الهاتف : {{ gift.receiver_phone }}
              </p>
              <p class="text-purple-600 font-medium mt-1">
                المبلغ: {{ gift.amount.toLocaleString() }} ريال
              </p>
            </div>
            <Button
              icon="pi pi-trash"
              severity="danger"
              text
              @click="removeGift(index)"
              aria-label="حذف هدية التبرع"
            >
              <span class="mr-1 text-sm font-semibold">حذف</span>
            </Button>
          </li>
        </ul>
      </section>

      <!-- لا توجد عناصر -->
      <div
        v-if="!donationCases.length && !donationGifts.length"
        class="text-center text-gray-400 text-lg py-16"
      >
        السلة فارغة حالياً.
      </div>

      <!-- المجموع وزر الدفع -->
      <div
        v-if="donationCases.length || donationGifts.length"
        class="border-t border-gray-300 pt-6 mt-auto"
      >
        <div
          class="flex justify-between items-center mb-6 text-xl font-bold text-gray-900"
        >
          <span>المجموع الكلي:</span>
          <span class="text-purple-700"
            >{{ totalAmount.toLocaleString() }} ريال</span
          >
        </div>

        <Button
          label="الذهاب للدفع"
          icon="pi pi-credit-card"
          class="w-full"
          severity="primary"
          @click="proceedToPayment"
        />
      </div>
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
