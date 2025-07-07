<template>
  <div class="my-28">
    <div class="carousel-wrapper">
      <div class="carousel">
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-item"
          :class="getPositionClass(index)"
        >
          <img class="bg-white" :src="slide.image" :alt="slide.alt" />
        </div>
      </div>
      <div class="controls">
        <button @click="prev">Prev</button>
        <button @click="next">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const slides = [
  { image: "/images/ceo.png", alt: "Slide 1" },
  { image: "/images/services.jpeg", alt: "Slide 1" },
  { image: "/images/home-banner.jpeg", alt: "Slide 1" },
  { image: "/images/main-logo.png", alt: "Slide 1" },
  { image: "/images/services.jpeg", alt: "Slide 1" },
  { image: "/images/services.jpeg", alt: "Slide 1" },
  { image: "/images/services.jpeg", alt: "Slide 1" },
  { image: "/images/services.jpeg", alt: "Slide 1" },
  { image: "/images/services.jpeg", alt: "Slide 1" },
  { image: "/images/services.jpeg", alt: "Slide 1" },
];

const activeIndex = ref(0);

const prev = () => {
  activeIndex.value = (activeIndex.value - 1 + slides.length) % slides.length;
};

const next = () => {
  activeIndex.value = (activeIndex.value + 1) % slides.length;
};

const getPositionClass = (index) => {
  const diff = (index - activeIndex.value + slides.length) % slides.length;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === 2) return "far-right";
  if (diff === slides.length - 1) return "left";
  if (diff === slides.length - 2) return "far-left";
  return "hidden";
};
</script>

<style scoped>
.carousel-wrapper {
  width: 100%;
  max-width: 800px;
  margin: auto;
  perspective: 1200px;
  position: relative;
  height: 400px;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 50%;
  width: 60%;
  height: 100%;
  transform-origin: center center;
  transition: transform 0.5s ease, opacity 0.5s ease;
  opacity: 0;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.carousel-item.center {
  transform: translateX(-50%) scale(1) rotateY(0deg);
  opacity: 1;
  z-index: 3;
}

.carousel-item.right {
  transform: translateX(calc(-50% + 200px)) scale(0.8) rotateY(-20deg);
  opacity: 1;
  z-index: 2;
}

.carousel-item.far-right {
  transform: translateX(calc(-50% + 350px)) scale(0.6) rotateY(-40deg);
  opacity: 1;
  z-index: 1;
}

.carousel-item.left {
  transform: translateX(calc(-50% - 200px)) scale(0.8) rotateY(20deg);
  opacity: 1;
  z-index: 2;
}

.carousel-item.far-left {
  transform: translateX(calc(-50% - 350px)) scale(0.6) rotateY(40deg);
  opacity: 1;
  z-index: 1;
}

.carousel-item.hidden {
  opacity: 0;
  z-index: 0;
}

.controls {
  text-align: center;
  margin-top: 20px;
}

.controls button {
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 16px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.controls button:hover {
  background-color: #0056b3;
}
</style>
