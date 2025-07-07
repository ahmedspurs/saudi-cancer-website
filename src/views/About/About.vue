<template>
  <div class="container mx-auto py-6 px-4 text-right font-sans">
    <!-- Two-Line Centered Tab Layout -->
    <div class="max-w-4xl mx-auto">
      <ul class="grid-3 gap-4 justify-items-center mb-4">
        <li
          v-for="(tab, index) in tabs.slice(0, 3)"
          :key="index"
          @click="activeTab = index"
          :class="[
            'cursor-pointer pb-1 border-b-2 transition duration-300',
            activeTab === index
              ? 'border-teal-800'
              : 'border-transparent hover:border-teal-400',
          ]"
        >
          {{ tab.label }}
        </li>
      </ul>
      <ul class="grid-4 gap-4 justify-items-center">
        <li
          v-for="(tab, index) in tabs.slice(3)"
          :key="index + 3"
          @click="activeTab = index + 3"
          :class="[
            'cursor-pointer pb-1 border-b-2 transition duration-300',
            activeTab === index + 3
              ? 'border-teal-800'
              : 'border-transparent hover:border-teal-400',
          ]"
        >
          {{ tab.label }}
        </li>
      </ul>
    </div>

    <!-- Tab Content -->
    <div class="mt-8 text-gray-800 leading-relaxed space-y-4">
      <div v-if="activeTab === 0">
        <h2 class="text-purple-700 text-xl font-bold">استراتيجيتنا</h2>
        <AboutSection />
      </div>
      <div v-else-if="activeTab === 1">
        <AboutSection />
      </div>
      <div v-else-if="activeTab === 2">
        <FoundersSection />
      </div>
      <div v-else-if="activeTab === 3">
        <EmployeesSection />
      </div>
      <div v-else-if="activeTab === 4">
        <GeneralAssembly />
      </div>
      <div v-else-if="activeTab === 5">
        <ComprehensiveDocument />
      </div>
      <div v-else-if="activeTab === 6">
        <h2 class="text-purple-700 text-xl font-bold">الهيكل التنظيمي</h2>
        <p>هنا يمكنك وضع محتوى الهيكل التنظيمي.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AboutSection from "./components/AboutSection.vue";
import FoundersSection from "./components/FoundersSection.vue";
import EmployeesSection from "./components/EmployeesSection.vue";
import GeneralAssembly from "./components/GeneralAssembly.vue";
import ComprehensiveDocument from "./components/ComprehensiveDocument.vue";

const activeTab = ref(0);
const tabs = [
  { label: "استراتيجيتنا" },
  { label: "من نحن" },
  { label: "المؤسسون" },
  { label: "مجلس الإدارة" },
  { label: "الجمعية العمومية" },
  { label: "الوثيقة الشاملة" },
  { label: "الهيكل التنظيمي" },
];
</script>

<style scoped>
/* Tailwind handles layout */
</style>
