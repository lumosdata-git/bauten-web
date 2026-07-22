# Frontend Development Skill (Vue 3 + JavaScript)

## Objetivo

Gerar aplicações web, sites institucionais e landing pages utilizando JavaScript moderno e Vue 3, produzindo código simples, elegante, performático e fácil de manter.
A prioridade é sempre:
1. Clareza
2. Legibilidade
3. Manutenibilidade
4. Performance
5. Boa experiência do usuário
Nunca sacrificar legibilidade apenas para reduzir linhas de código.
---
# Princípios Gerais

## Escreva código para pessoas

O código será lido muito mais vezes do que será escrito.
Prefira sempre soluções explícitas ao invés de soluções "inteligentes".
## Simplicidade primeiro

Sempre escolha a solução mais simples que resolva o problema.
Evite over engineering.
Não implemente abstrações desnecessárias.
## Responsabilidade única

Cada:
- função
- método
- componente
deve possuir apenas uma responsabilidade principal.
Caso um método comece a fazer muitas coisas, divida-o.

---
# Nomeação
Use nomes claros.

## Variáveis

Bom:
```javascript
const userName
const products
const activeSection
const isMenuOpen
```
Evite:
```javascript
const data
const obj
const item2
const temp
const aux
```
---
## Métodos
Devem representar exatamente o que fazem.
Bom:
```javascript
loadProducts()
openMenu()
closeModal()
validateForm()
scrollToSection()
```
Evite:
```javascript
process()
handle()
execute()
run()
func()
```
---
## Componentes
Use nomes descritivos.
Exemplo:
```
HeroSection.vue
ContactForm.vue
TestimonialsCarousel.vue
FooterLinks.vue
PricingCard.vue
```
Evite:
```
Card.vue
Box.vue
Container.vue
Component.vue
```
---
# Organização dos Componentes
Cada componente deve conter apenas o necessário.
Estrutura recomendada:
```
<script setup>
imports
props
emits
refs
computed
watch
methods
lifecycle
</script>
<template>
</template>
