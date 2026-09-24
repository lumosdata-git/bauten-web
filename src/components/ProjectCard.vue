<script setup>
defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['open'])
</script>

<template>
  <article class="project-card" role="link" tabindex="0" @click="emit('open', project)" @keydown.enter="emit('open', project)" @keydown.space.prevent="emit('open', project)"><div class="project-image"><img :src="project.image" :alt="`Perspectiva do ${project.name}`" loading="lazy" /><!-- A tag de status permanece disponível nos dados para reativação futura. --><!-- <span class="project-status" :class="project.type.toLowerCase().replace(' ', '-')">{{ project.status }}</span> --></div><div class="project-info"><div><p class="project-location">{{ project.location }}</p><h3>{{ project.name }}</h3><p>{{ project.detail }}</p></div><div class="project-meta"><span>{{ project.meta }}</span><span class="arrow">↗</span></div></div></article>
</template>
