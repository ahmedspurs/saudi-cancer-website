<template>
  <div class="container">
    <h2 class="section-title">إنجازات وأرقام الجمعية</h2>
    <div
      class="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white justify-center"
    >
      <div
        v-for="item in stats"
        :key="item.title"
        class="bg-secondary text-white rounded-xl flex-col-center pb-6 shadow-md"
      >
        <div
          class="text-3xl mb-2 bg-white text-secondary px-5 py-4 rounded-xl -mt-2"
        >
          <i :class="item.icon"> </i>
        </div>
        <h3 class="text-xl font-semibold">{{ item.title }}</h3>
        <p class="text-2xl font-bold">{{ item.value }}</p>
        <p class="text-sm mt-1">{{ item.subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = [
  {
    title: "المستفيدين",
    value: "7800",
    subtitle: "مستفيد",
    icon: "fas fa-users",
  },
  {
    title: "جهاز طبي",
    value: "716",
    subtitle: "جهاز طبي",
    icon: "fas fa-procedures",
  },
  {
    title: "خدمة النقل",
    value: "5124",
    subtitle: "رحلة",
    icon: "fas fa-car-side",
  },
  {
    title: "الكشف المبكر",
    value: "7800",
    subtitle: "عدد المستفيدين",
    icon: "fas fa-hospital",
  },
  {
    title: "التطوع",
    value: "1800",
    subtitle: "ساعة تطوعية",
    icon: "fas fa-hand-holding-heart",
  },
];
</script>
