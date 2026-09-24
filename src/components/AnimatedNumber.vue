<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  target: { type: Number, required: true },
  decimals: { type: Number, default: 0 },
  suffix: { type: String, required: true },
  description: { type: String, required: true }
})

const currentValue = ref(0)
const counterElement = ref(null)
let observer
let animationFrame

function formatValue(value) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals
  }).format(value)
}

function animateNumber() {
  const startedAt = performance.now()
  const duration = 1500
  const animate = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1)
    const easedProgress = 1 - Math.pow(1 - progress, 3)
    currentValue.value = props.target * easedProgress
    if (progress < 1) animationFrame = requestAnimationFrame(animate)
  }
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    animateNumber()
    observer.disconnect()
  }, { threshold: 0.35 })
  observer.observe(counterElement.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (animationFrame) cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <div ref="counterElement"><strong>{{ formatValue(currentValue) }}</strong><span class="number-suffix">{{ suffix }}</span><p>{{ description }}</p></div>
</template>
