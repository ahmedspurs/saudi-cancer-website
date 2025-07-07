<template>
  <div>
    <div class="grid-3 bg-secondary gap-8">
      <div class="h-[400px] rounded-tl-[70%] overflow-hidden">
        <img
          src="/images/home-banner.jpeg"
          class="w-full h-full object-cover"
          alt=""
        />
      </div>
      <div class="col-span-2">
        <h2 class="text-white text-2xl font-semibold my-6">
          رعاية صحية متكاملة لتحقيق رؤية المملكة
        </h2>
        <p class="w-1/2 text-lg text-white">
          تسعى الجمعية إلى تحقيق رؤية المملكة 2030 عبر خدماتها وبرامجها والتي
          تهدف إلى تحسين الوصول إلى الخدمات الصحية من خلال التغطية المثلى
          والتوزيع الجغرافي الشامل والعادل، وتوسيع تقديم خدمات الصحة، فضلاَ عن
          تحسين جودة الخدمات الصحية واتباع أفضل المعايير الدولية.
        </p>
      </div>
    </div>
    <div class="grid-3 gap-8 items-end -mt-32">
      <div class="flex justify-between px-8">
        <router-link to="#" class="text-secondary font-bold text-xl">
          المؤسسون
        </router-link>
        <router-link to="#" class="text-secondary font-bold text-xl">
          رؤيتنا
        </router-link>
        <router-link to="#" class="text-secondary font-bold text-xl">
          رسالتنا
        </router-link>
      </div>
      <div class="col-span-2">
        <div class="grid-3">
          <div
            class="bg-secondary rounded-full flex-center border-8 border-white p-4 w-[200px] h-[200px]"
          >
            <p class="text-lg text-white text-center">
              تسهيل الحصول على خدمات الرعاية الصحية
            </p>
          </div>

          <div
            class="bg-secondary rounded-full flex-center border-8 border-white p-4 w-[200px] h-[200px]"
          >
            <p class="text-lg text-white text-center">
              تحسين جودة وكفاءة الخدمات الصحية
            </p>
          </div>

          <div
            class="bg-secondary rounded-full flex-center border-8 border-white p-4 w-[200px] h-[200px]"
          >
            <p class="text-lg text-white text-center">
              تعزيز الوقاية ضد المخاطر الصحية
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>
