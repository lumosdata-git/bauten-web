<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  isMenuOpen: Boolean,
  isInternalPage: Boolean
})

const emit = defineEmits(['toggle-menu', 'home', 'scroll', 'about', 'projects', 'content'])
const isScrolled = ref(false)
function updateScrollState() {
  isScrolled.value = window.scrollY > 24
}
onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', updateScrollState))
</script>

<template>
  <header class="site-header" :class="{ 'menu-open': isMenuOpen, 'detail-header': isInternalPage, scrolled: isScrolled }">
    <div class="shell header-inner">
      <button class="wordmark brand-lockup" aria-label="Bauten, início" @click="isInternalPage ? emit('home') : emit('scroll', 'inicio')"><img class="brand-logo" src="/images/bauten/logo_page-0001.jpg" alt="Bauten" /><span class="brand-subtitle">Construtora</span></button>
      <nav class="desktop-nav" aria-label="Navegação principal"><button @click="emit('home')">Início</button><button @click="emit('about')">A Bauten</button><button @click="emit('projects')">Projetos</button><button @click="emit('content')">Conteúdo</button></nav>
      <a class="header-cta" href="https://wa.me/5583993675767?text=Olá!%20Quero%20saber%20mais%20sobre%20a%20Bauten." target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a>
      <button class="menu-toggle" :aria-expanded="isMenuOpen" aria-label="Abrir menu" @click="emit('toggle-menu')"><span></span><span></span></button>
    </div>
    <nav v-if="isMenuOpen" class="mobile-nav" aria-label="Navegação mobile"><button @click="emit('home')">Início</button><button @click="emit('about')">A Bauten</button><button @click="emit('projects')">Projetos</button><button @click="emit('content')">Conteúdo</button><a class="mobile-nav-cta" href="https://wa.me/5583993675767?text=Olá!%20Quero%20saber%20mais%20sobre%20a%20Bauten." target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a></nav>
  </header>
</template>
