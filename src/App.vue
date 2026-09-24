<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { blogArticles } from './blogData'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import ProjectCard from './components/ProjectCard.vue'
import AboutPage from './components/AboutPage.vue'
import AnimatedNumber from './components/AnimatedNumber.vue'
import { getRoute, getSlug, routes } from './router'
import { submitLead } from '../supabase/service/index.js'
import { supabase } from './lib/supabase'

const isMenuOpen = ref(false)
const activeFilter = ref('Todos')
const formSent = ref(false)
const formSubmitting = ref(false)
const formError = ref('')
const formName = ref('')
const formEmail = ref('')
const formPhone = ref('')
const formInterest = ref('Conhecer um lançamento')
const galleryVisibleCount = ref(3)
const textScale = ref(1)
const activeHero = ref(0)
const activePortfolioHero = ref(0)
const currentPath = ref(window.location.pathname)
let heroTimer
let portfolioHeroTimer
let formResetTimer
let revealObserver

const heroSlides = [
  { eyebrow: 'Bauten · Desde 1998', title: 'Construir é deixar', emphasis: 'um legado.', copy: 'Uma trajetória feita de solidez, cuidado e visão de longo prazo.', image: '/images/hero/b.jpg' },
  { eyebrow: 'Bauten · Liderança', title: 'Pessoas que', emphasis: 'constroem juntos.', copy: 'Uma empresa conduzida por experiência, proximidade e decisões responsáveis.', image: '/images/hero/socios.jpg' },
  
]

const projects = [
  { slug: 'bauten-parque', name: 'Bauten Parque', location: 'João Pessoa · Jardim Oceania', status: 'Lançamento', type: 'Lançamentos', detail: 'Entre o parque e o mar', meta: '2–4 quartos · 65–144 m²', image: '/images/bauten-parque/site-optimized/fachada-BpQ__qjF.jpg' },
  { slug: 'tekoa', name: 'Tekoá', location: 'Bananeiras · Paraíba', status: 'Lançamento', type: 'Lançamentos', detail: 'Natureza, lugar bom de se viver', meta: '2–3 suítes · 26–43 m²', image: '/images/teoka/site-optimized/tekoa-B-Pj1ja0.png' },
  { slug: 'flow', name: 'Flow', location: 'João Pessoa · Manaíra', status: 'Lançamento', type: 'Lançamentos', detail: 'A cidade no seu ritmo', meta: '1 quarto · 29–36 m²', image: '/images/flow/site-optimized/fachada-DT5G_ZjS.jpg' },
  { slug: 'ceety', name: 'Ceety', location: 'João Pessoa · Paraíba', status: 'Em obra', type: 'Em obra', detail: 'Compacto urbano inteligente', meta: 'Studios, 1 e 2 quartos · 23–49 m²', image: '/images/ceety/site-optimized/ceety-Ba2FLlB2.png' },
  { slug: 'arcos', name: 'Arcos', location: 'João Pessoa · Cabo Branco', status: 'Em obra', type: 'Em obra', detail: 'Arquitetura dos sentidos', meta: '1–2 suítes · 32–119 m²', image: '/images/arcos/site-optimized/arcos-CBoiKWfa.png' },
  { slug: 'reserva-da-mata', name: 'Reserva da Mata', location: 'João Pessoa · Cabo Branco', status: 'Em obra', type: 'Em obra', detail: 'Onde a vida respira', meta: 'Flats · 15–42 m²', image: '/images/reserva-da-mata/site-optimized/reserva-da-mata-CftyKNH6.png' },
  { slug: 'farol-137', name: 'Farol 137', location: 'Cabedelo · Praia de Formosa', status: 'Lançamento', type: 'Lançamentos', detail: 'A 80 metros do mar', meta: '1–3 quartos · 29–86 m²', image: '/images/farol137/site-optimized/farol134-D3atx8Cf.png' },
  { slug: 'aurea', name: 'Áurea', location: 'João Pessoa · Cabo Branco', status: 'Entregue', type: 'Entregues', detail: 'Identidade e regionalismo', meta: '3 quartos · 80–120 m²', image: '/images/aurea/site-optimized/aurea-HGW2l4zH.png' }
]

const projectDetails = {
  'bauten-parque': { description: 'O Bauten Parque convida você a viver o hábito de viver bem, tendo o Parque Parahyba I como extensão natural da sua casa. Um projeto que aproxima família, natureza e cidade no Jardim Oceania.', address: 'R. Antônio de Souza Leão, S/N, Jardim Oceania, João Pessoa-PB', specs: [['Estrutura', '01 torre com 34 pavimentos'], ['Distribuição', 'Apartamentos a partir do 5º andar'], ['Garagem', '4 pavimentos (térreo + 3 subsolos)'], ['Tipologias', '2 a 4 quartos (até 3 suítes + reversível)'], ['Área privativa', '65,27 m² a 144,85 m²'], ['Arquitetura', 'Venâncio Toscano'], ['Paisagismo e interiores', 'Bia Campelo · Georgia Suassuna']], highlights: ['A 150 m do Parque Parahyba I e 800 m da Praia do Bessa', 'Horta vertical colaborativa com plantas medicinais e orgânicas', 'Registro de Incorporação R-4-170.310', 'Obra assegurada e empresa auditada pela Deloitte'], amenities: ['Piscina adulto e infantil', 'Deck molhado e pool lounge', 'Academia com área externa', 'Espaço cross e mini quadra', 'Salão de festas e salão de jogos', 'Terraço gourmet e espaço gourmet interno', 'Brinquedoteca e playground', 'Horta colaborativa', 'Lobby receptivo', 'Minimercado', 'Pet place', 'Bicicletário'], gallery: ['/images/bauten-parque/site-optimized/insercao-CrGh4Sho.jpg', '/images/bauten-parque/site-optimized/piscina-01-BLW_9r4F.jpg', '/images/bauten-parque/site-optimized/piscina-04-BLeUnJIE.jpg', '/images/bauten-parque/site-optimized/lobby-BxsZKGKa.jpg', '/images/bauten-parque/site-optimized/market-jpk0rnZ3.jpg', '/images/bauten-parque/site-optimized/apto-sala-DQKpOmq8.jpg', '/images/bauten-parque/site-optimized/apto-varanda-BShQv7bI.jpg', '/images/bauten-parque/site-optimized/penthouse-cozinha-Cqmbja6-.jpg'] },
  tekoa: { description: 'Tekoá — natureza, lugar bom de se viver — é um condomínio boutique que equilibra design contemporâneo, paisagem e a riqueza histórica de Bananeiras. O primeiro empreendimento do Nordeste com Spa L’Occitane au Brésil.', address: 'Av. Empresário Erlie Antonio Amorim Pessoa, Divina Graça, Bananeiras-PB', specs: [['Localização', 'Área exclusiva em Bananeiras, a 1,3 km do centro'], ['Terreno', '17.230,21 m² (9.000 m² de área verde + 4.005 m² de preservação)'], ['Tipologias', 'Casas (2 ou 3 suítes) e apartamentos (2 blocos, 4 pavimentos)'], ['Área dos apartamentos', '26 m² a 43 m²'], ['Infraestrutura', 'Rede elétrica subterrânea, LED, intertravado e acesso biométrico'], ['Conforto', 'Isolamento térmico, tratamento acústico, fechadura digital e mobília opcional']], highlights: ['1º Spa L’Occitane au Brésil do Nordeste', 'App Tekoá para reservas e concierge', 'Alameda centenária exclusiva', 'Paisagismo sustentável e passeios humanizados'], amenities: ['Spa L’Occitane au Brésil', 'Wine bar e adega', 'Piscinas aquecidas e hidromassagem', 'Lounge gourmet interno e externo', 'Praça do fogo e lago contemplativo', 'Brinquedoteca e playground', 'Casa da árvore e escalada', 'Horta, pomar e bosque de frutíferas', 'Trilhas, piquenique e bird watch', 'Concierge, minimarket e lavanderia', 'Academia', 'Bicicletário e pet place'], gallery: ['/images/teoka/site-optimized/fachada-entrada-6Bvf_I56.jpg', '/images/teoka/site-optimized/fachada-blocos-pUA4Q5tQ.jpg', '/images/teoka/site-optimized/lobby-01-td2x6umU.jpg', '/images/teoka/site-optimized/lobby-04-CV3DRwqY.jpg', '/images/teoka/site-optimized/espaco-gourmet-DvLYXLz_.jpg', '/images/teoka/site-optimized/wine-bar-01-DPxIorr6.jpg', '/images/teoka/site-optimized/wine-bar-02-DoBGvmNC.jpg', '/images/teoka/site-optimized/hidromassagem-spa-Ki17fxVs.jpg', '/images/teoka/site-optimized/academia-DpIAws7Y.jpg', '/images/teoka/site-optimized/brinquedoteca-CqJ532MG.jpg'] },
  flow: { description: 'O Flow acompanha o ritmo da vida urbana com apartamentos compactos, localização estratégica e infraestrutura para morar, investir ou ter uma segunda residência em Manaíra.', address: 'R. Antonio Monteiro Gomes de Oliveira, 243-115 - Manaíra, João Pessoa-PB', specs: [['Unidades', '163 unidades'], ['Pavimentos', '23 pavimentos'], ['Tipologia', 'Apartamentos de 1 quarto'], ['Área privativa', '29 m² a 36 m²'], ['Estacionamento', 'Subsolo, térreo e 1º pavimento dedicados a vagas'], ['Registro de incorporação', 'R-3-172.166 (2026)'], ['Arquitetura', 'Juliano Silva de Vasconcelos Leite'], ['Interiores e paisagismo', 'Georgia Suassuna · Caroline Cavalcante']], highlights: ['A 300 m — 3 minutos a pé — do Manaíra Shopping', 'Cercado por faculdades, farmácias e supermercados', 'Ideal para moradia, segunda moradia ou investimento', 'Empresa auditada pela Deloitte e obra com seguro garantido'], amenities: ['Coworking e sala de reunião', 'Academia', 'Piscina', 'Salão de festas', 'Espaço gourmet e churrasqueira', 'Lavanderia compartilhada', 'Minimercado', 'Brinquedoteca', 'Espaço delivery', 'Portaria'], gallery: ['/images/flow/site-optimized/acesso-Dx4fR4DI.jpg', '/images/flow/site-optimized/lobby-tYK1EUpZ.jpg', '/images/flow/site-optimized/salao-_ESf5mV7.jpg', '/images/flow/site-optimized/academia-ofTlU7hh.jpg', '/images/flow/site-optimized/coworking-DAkHmpsg.jpg', '/images/flow/site-optimized/kids-DidHWexo.jpg', '/images/flow/site-optimized/apto-C8GpEan_.jpg'] },
  ceety: { description: 'O Ceety traduz o novo morar urbano em apartamentos compactos e inteligentes, projetados para quem valoriza localização, praticidade e design contemporâneo.', address: 'R. Ver. José Alberto Barroca Falcão, 50, Miramar, João Pessoa-PB', specs: [['Unidades', 'Aproximadamente 128 apartamentos (8 por andar, 16 pavimentos tipo)'], ['Tipologias', 'Studios e apartamentos de 1 e 2 quartos'], ['Área privativa', '23 m² a 49,76 m²'], ['Vagas', '60 vagas totais (térreo + 2 subsolos), maioria rotativa e 16 privativas'], ['Andares', '18 andares (pavimentos tipo do 3º ao 18º andar)']], highlights: ['Design compacto inteligente', 'Localização central', 'Conceito smart living', 'Fachada contemporânea'], amenities: ['Coworking e sala de leitura', 'Lavanderia compartilhada', 'Pet place', 'Academia', 'Rooftop com piscina aquecida', 'Sky pub e sky lounge', 'Duas áreas gourmet climatizadas', 'Minimercado', 'Sala de jogos', 'Bicicletário'], gallery: ['/images/ceety/site-optimized/insercao-DKlgBTti.jpg', '/images/ceety/site-optimized/fachada-DbINraBf.jpg', '/images/ceety/site-optimized/acesso-D0FtFAdn.jpg', '/images/ceety/site-optimized/gourmet-vista-CSW5Gock.jpg', '/images/ceety/site-optimized/lobby-coworking-CVGGk5I7.jpg', '/images/ceety/site-optimized/fitness-t_3-ZnDt.jpg', '/images/ceety/site-optimized/lobby-ZwgE7P17.jpg', '/images/ceety/site-optimized/corredor-DYvUJKXf.jpg', '/images/ceety/site-optimized/pet-B05xZoQ-.jpg'] },
  arcos: { description: 'O Arcos é um empreendimento de longevidade ativa à beira-mar do Cabo Branco. Uma arquitetura dos sentidos que preserva a memória afetiva do bairro e cria novas formas de cuidado, autonomia e encontro.', address: 'Av. Cabo Branco, Cabo Branco, 1630, João Pessoa-PB', specs: [['Unidades', '55 apartamentos'], ['Tipologias', '1 ou 2 quartos com suíte'], ['Área privativa', '32 m² a 119 m²'], ['Pavimentos', '5 pavimentos'], ['Arquitetura', 'Sandra Moura'], ['Paisagismo', 'Bia Campelo']], highlights: ['1º empreendimento de longevidade ativa da Paraíba', 'Beira-mar do Cabo Branco', 'Métodos e materiais bioconstrutivos', 'Pavimentos temáticos com identidade própria'], amenities: ['Restaurante e minimercado', 'Espaço Physio, Capillus, Curare e Salus', 'Ateliê de arte e espaço Literary', 'Auditorium e espaço Vinum', 'Academia, pilates, spinning e espaço Ludo', 'Piscina aquecida e hidromassagem', 'Terraço contemplação', 'Espaço gourmet com adega', 'Praça com fogo e pet place', 'Horta, compostagem e lavanderia', 'Bicicletário e pet care', 'Guarderia e itens de praia'], gallery: ['/images/arcos/site-optimized/cobertura-piscina-C7pcCms8.jpg', '/images/arcos/site-optimized/pilates-BOiunxsx.jpg', '/images/arcos/site-optimized/curare-BYfrCp1I.jpg', '/images/arcos/site-optimized/perspectiva-curare-C2xZXXyj.jpg', '/images/arcos/site-optimized/atelier-BH0Lt1f-.jpg', '/images/arcos/site-optimized/cobertura-piscina-vista-C5FTloar.jpg', '/images/arcos/site-optimized/physio-kQGWPjSP.jpg', '/images/arcos/site-optimized/espaco-compostagem-Bzcst9dZ.jpg'] },
  'reserva-da-mata': { description: 'Um refúgio revigorante no “pulmão” do Cabo Branco, concebido para integrar-se à Mata Atlântica e permitir uma reconexão mais leve, funcional e pura com a vida.', address: 'Rua Edvaldo Bezerra Cavalcanti Pinho, 342 - Cabo Branco, João Pessoa-PB', specs: [['Unidades', '61 unidades'], ['Tipologias', 'Flats lineares e compactos'], ['Área privativa', '15 m² a 42 m²'], ['Localização', 'Rua Edvaldo Bezerra Cavalcanti Pinho, Cabo Branco'], ['Estacionamento', 'Vagas rotativas'], ['Elevadores', '2 elevadores']], highlights: ['Fachada integrada à Mata Atlântica', 'A poucos passos do mar', 'Eficiência hídrica e energética', 'Coleta seletiva e irrigação automatizada'], amenities: ['Piscina com deck', 'Academia', 'Área gourmet', 'Garden', 'Espaço relax', 'Pet place', 'Espaço kids', 'Minimercado', 'Coworking', 'Lavanderia compartilhada', 'Bicicletário'], gallery: ['/images/reserva-da-mata/site-optimized/fachada-CLpLMTYY.jpg', '/images/reserva-da-mata/site-optimized/recepcao-7B-ztyv1.jpg', '/images/reserva-da-mata/site-optimized/piscina-CtJ57S5T.jpg', '/images/reserva-da-mata/site-optimized/restaurante-BtaKZfwv.jpg', '/images/reserva-da-mata/site-optimized/market-CLNkHpS4.jpg', '/images/reserva-da-mata/site-optimized/lavanderia-LrsMXWmH.jpg', '/images/reserva-da-mata/site-optimized/espaco-relax-CWgm1srC.jpg', '/images/reserva-da-mata/site-optimized/espaco-kids-DyEhfdFp.jpg'] },
  'farol-137': { description: 'A 80 metros do mar, o Farol 137 combina praticidade, lazer completo e vistas privilegiadas em uma única torre na Praia de Formosa, em Cabedelo.', address: 'R. Antônio Leandro de Sousa, S/N, Formosa, Cabedelo-PB', specs: [['Unidades', '52 apartamentos'], ['Tipologias', '1, 2 e 3 quartos (incluindo suítes)'], ['Área privativa', '29,73 m² a 86,55 m²'], ['Vagas', '1 a 2 vagas'], ['Estrutura', '1 torre com 2 elevadores'], ['Andares', 'Térreo + 7 pavimentos tipo + cobertura (rooftop)']], highlights: ['A 80 metros da praia', 'Vistas privilegiadas — nascente, norte e sul', 'Studios de 29 m² a apartamentos de 86 m²', 'Infraestrutura operacional completa'], amenities: ['Rooftop com vista mar', 'Piscina com hidromassagem', 'Academia com vista mar', 'Espaço gourmet interno e externo', 'Minimercado', 'Pet place', 'Playground', 'Guarderia numerada e ducha', 'Hall de entrada', 'Praça de convivência'], gallery: ['/images/farol137/site-optimized/implantacao-C6DZwvYC.jpg', '/images/farol137/site-optimized/fachada-CVKFFUyo.jpg', '/images/farol137/site-optimized/cobertura-BfEWxfWX.jpg', '/images/farol137/site-optimized/lobby-DHMENO_5.jpg', '/images/farol137/site-optimized/gourmet-DCxQla-I.jpg', '/images/farol137/site-optimized/praca-rqIQMW8d.jpg', '/images/farol137/site-optimized/academia-DHyLFTS9.jpg', '/images/farol137/site-optimized/market-BJ-fAKRO.jpg', '/images/farol137/site-optimized/playground-CFoyFVXl.jpg', '/images/farol137/site-optimized/pet-place-DoK6OnIA.jpg'] },
  aurea: { description: 'O Áurea celebra a identidade nordestina através da arquitetura. Cada elemento foi inspirado na cultura, nas cores e nas texturas da região, em um projeto autoral que já foi entregue.', address: 'Rua Áurea, 103, Cabo Branco, João Pessoa-PB', specs: [['Unidades', '72 apartamentos'], ['Tipologias', '3 quartos'], ['Área privativa', '80 m² a 120 m²'], ['Vagas', '2 vagas'], ['Andares', '20 andares']], highlights: ['Design autoral regional', '100% vendido', 'Entrega antecipada', 'Valorização acima da média'], amenities: ['Piscina com deck', 'Salão de festas', 'Fitness center', 'Espaço gourmet', 'Brinquedoteca', 'Jardim'], gallery: ['/images/aurea/site-optimized/fachada-lateral-CwAroip4.jpg', '/images/aurea/site-optimized/piscina-9xPS_iaI.jpg', '/images/aurea/site-optimized/relax-DrT8XelK.jpg', '/images/aurea/site-optimized/relax-2-paGH-eSr.jpg', '/images/aurea/site-optimized/restaurante-bar-BEXOx9pK.jpg', '/images/aurea/site-optimized/office-DoRmeuNW.jpg', '/images/aurea/site-optimized/lavanderia---_JOKef.jpg', '/images/aurea/site-optimized/brinquedoteca-64byV0Ag.jpg', '/images/aurea/site-optimized/subsolo-CPyalds5.jpg'] }
}

const filters = ['Todos', 'Lançamentos']
const visibleProjects = computed(() => activeFilter.value === 'Todos' ? projects : projects.filter(project => project.type === activeFilter.value))
const currentRoute = computed(() => getRoute(currentPath.value))
const isDetailPage = computed(() => currentRoute.value.name === 'project-detail')
const isPortfolioPage = computed(() => currentRoute.value.name === 'projects')
const isAboutPage = computed(() => currentRoute.value.name === 'about')
const isBlogPage = computed(() => currentRoute.value.name === 'blog')
const isArticlePage = computed(() => currentRoute.value.name === 'article-detail')
const selectedProject = computed(() => {
  const slug = currentRoute.value.slug || getSlug(currentPath.value)
  const project = projects.find(item => item.slug === slug)
  return project ? { ...project, ...projectDetails[slug] } : null
})
const visibleGalleryImages = computed(() => {
  const gallery = selectedProject.value?.gallery || []
  return gallery.slice(0, galleryVisibleCount.value)
})
const selectedArticle = computed(() => {
  const slug = currentRoute.value.slug || getSlug(currentPath.value)
  return blogArticles.find(article => article.slug === slug) || null
})
const orderedArticles = computed(() => [...blogArticles].sort((a, b) => new Date(b.date) - new Date(a.date)))
const relatedArticles = computed(() => selectedArticle.value ? blogArticles.filter(article => article.slug !== selectedArticle.value.slug && article.category === selectedArticle.value.category).slice(0, 3) : [])
const articleBlocks = computed(() => selectedArticle.value ? selectedArticle.value.content.split(/\n\n+/).map((text, index) => ({ text, type: getArticleBlockType(text, index) })) : [])

function setHeroSlide(index) {
  activeHero.value = (index + heroSlides.length) % heroSlides.length
}

function nextHero() {
  setHeroSlide(activeHero.value + 1)
}

function previousHero() {
  setHeroSlide(activeHero.value - 1)
}

function resetHeroTimer() {
  window.clearInterval(heroTimer)
  heroTimer = window.setInterval(nextHero, 7000)
}

function setPortfolioHero(index) {
  activePortfolioHero.value = (index + projects.length) % projects.length
}

function resetPortfolioHeroTimer() {
  window.clearInterval(portfolioHeroTimer)
  portfolioHeroTimer = window.setInterval(() => setPortfolioHero(activePortfolioHero.value + 1), 6500)
}

function scrollProjects(distance) {
  document.querySelector('.project-grid')?.scrollBy({ left: distance, behavior: 'smooth' })
}

function scrollToSection(id) {
  isMenuOpen.value = false
  if (currentPath.value !== routes.home) {
    window.history.pushState({}, '', routes.home)
    currentPath.value = routes.home
    nextTick(() => {
      observeRevealElements()
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function openAbout() {
  isMenuOpen.value = false
  window.history.pushState({}, '', routes.about)
  currentPath.value = routes.about
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function openProject(project) {
  galleryVisibleCount.value = 3
  window.history.pushState({}, '', routes.project(project.slug))
  currentPath.value = routes.project(project.slug)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openPortfolio() {
  isMenuOpen.value = false
  window.history.pushState({}, '', routes.projects)
  currentPath.value = routes.projects
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function returnToHome() {
  formSent.value = false
  window.history.pushState({}, '', routes.home)
  currentPath.value = routes.home
  nextTick(() => {
    observeRevealElements()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function openBlog() {
  isMenuOpen.value = false
  window.history.pushState({}, '', routes.blog)
  currentPath.value = routes.blog
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function openArticle(article) {
  isMenuOpen.value = false
  window.history.pushState({}, '', routes.article(article.slug))
  currentPath.value = routes.article(article.slug)
  nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function returnToBlog() {
  isMenuOpen.value = false
  window.history.pushState({}, '', routes.blog)
  currentPath.value = routes.blog
  nextTick(() => {
    observeRevealElements()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function returnToPortfolio() {
  isMenuOpen.value = false
  galleryVisibleCount.value = 3
  window.history.pushState({}, '', routes.projects)
  currentPath.value = routes.projects
  nextTick(() => {
    observeRevealElements()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function toggleGallery() {
  const total = selectedProject.value?.gallery?.length || 0
  galleryVisibleCount.value = galleryVisibleCount.value >= total ? 3 : Math.min(galleryVisibleCount.value + 3, total)
}

function changeTextScale(amount) {
  textScale.value = Math.min(1.2, Math.max(0.9, Number((textScale.value + amount).toFixed(1))))
  document.documentElement.style.setProperty('--text-scale', textScale.value)
}

function resetTextScale() {
  textScale.value = 1
  document.documentElement.style.setProperty('--text-scale', '1')
}

function formatArticleDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`))
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits ? `(${digits}` : ''
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function updatePhone(event) {
  formPhone.value = formatPhone(event.target.value)
}

function getArticleBlockType(text, index) {
  const trimmedText = text.trim()
  if (trimmedText.startsWith('"') || trimmedText.startsWith('“')) return 'quote'
  if (index > 0 && trimmedText.length < 90 && !/[.!?]$/.test(trimmedText)) return 'heading'
  return 'paragraph'
}

function shareArticle() {
  const article = selectedArticle.value
  if (!article) return
  const shareText = `${article.title}\n\n${article.excerpt}\n\n${window.location.href}`
  window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer')
}

function openProjectOnMap(address) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  window.open(mapUrl, '_blank', 'noopener,noreferrer')
}

async function submitForm() {
  if (formPhone.value.replace(/\D/g, '').length !== 11 || formSubmitting.value) return
  formSubmitting.value = true
  formError.value = ''
  try {
    await submitLead(supabase, { name: formName.value, email: formEmail.value, phone: formPhone.value, interest: formInterest.value })
    formSent.value = true
  } catch (error) {
    formError.value = error.validationErrors ? 'Confira os dados preenchidos e tente novamente.' : 'Não foi possível enviar agora. Tente novamente em instantes.'
  } finally {
    formSubmitting.value = false
  }
  window.clearTimeout(formResetTimer)
  formResetTimer = window.setTimeout(() => {
    formSent.value = false
    formName.value = ''
    formEmail.value = ''
    formPhone.value = ''
    formInterest.value = 'Conhecer um lançamento'
    formError.value = ''
  }, 7000)
}

function observeRevealElements() {
  if (!revealObserver) return
  document.querySelectorAll('.reveal:not(.is-visible)').forEach(element => revealObserver.observe(element))
}

onMounted(() => {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible')
    })
  }, { threshold: 0.12 })
  observeRevealElements()
  resetHeroTimer()
  resetPortfolioHeroTimer()
  window.addEventListener('popstate', () => {
    currentPath.value = window.location.pathname
    nextTick(() => {
      observeRevealElements()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })
})

onUnmounted(() => {
  window.clearInterval(heroTimer)
  window.clearInterval(portfolioHeroTimer)
  window.clearTimeout(formResetTimer)
  revealObserver?.disconnect()
})
</script>

<template>
  <div vw class="enabled" aria-label="VLibras — acessibilidade em Libras">
    <div vw-access-button class="active"></div>
    <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
  </div>
  <div class="accessibility-controls" aria-label="Controles de tamanho do texto">
    <button type="button" aria-label="Aumentar tamanho do texto" @click="changeTextScale(0.1)">A+</button>
    <button type="button" aria-label="Diminuir tamanho do texto" @click="changeTextScale(-0.1)">A−</button>
    <button type="button" aria-label="Redefinir tamanho do texto" @click="resetTextScale">A</button>
  </div>
  <SiteHeader :is-menu-open="isMenuOpen" :is-internal-page="isDetailPage || isPortfolioPage || isAboutPage || isBlogPage || isArticlePage" @toggle-menu="isMenuOpen = !isMenuOpen" @home="returnToHome" @scroll="scrollToSection" @about="openAbout" @projects="openPortfolio" @content="openBlog" />

  <main id="inicio" v-if="!isDetailPage && !isPortfolioPage && !isAboutPage && !isBlogPage && !isArticlePage">
    <section class="hero">
      <div v-for="(slide, index) in heroSlides" :key="slide.title" class="hero-image" :class="{ active: activeHero === index }" :style="{ backgroundImage: `url(${slide.image})`, backgroundPosition: slide.position || 'center' }" role="img" :aria-label="`Perspectiva do ${slide.title}`"></div>
      <div class="hero-shade"></div>
      <div class="shell hero-content">
        <p class="eyebrow light">{{ heroSlides[activeHero].eyebrow }}</p>
        <h1>{{ heroSlides[activeHero].title }}<br /><em>{{ heroSlides[activeHero].emphasis }}</em></h1>
        <p class="hero-copy">{{ heroSlides[activeHero].copy }}</p>
        <div class="hero-actions">
          <button class="button button-light" @click="scrollToSection('contato')">Falar com um consultor <span>↗</span></button>
          <button class="text-link light" @click="scrollToSection('projetos')">Conhecer projetos <span>↗</span></button>
        </div>
      </div>
      <div class="hero-controls" aria-label="Controles dos lançamentos"><button aria-label="Lançamento anterior" @click="previousHero(); resetHeroTimer()">←</button><button v-for="(_, index) in heroSlides" :key="index" :class="{ active: activeHero === index }" :aria-label="`Ir para lançamento ${index + 1}`" @click="setHeroSlide(index); resetHeroTimer()"></button><button aria-label="Próximo lançamento" @click="nextHero(); resetHeroTimer()">→</button></div>
      <!-- <button class="hero-scroll" aria-label="Explorar conteúdo" @click="scrollToSection('projetos')"><span>Explorar</span><i>↓</i></button> -->
    </section>

    <section id="sobre" class="intro section shell reveal section-tint">
      <div class="section-kicker"><span></span> Uma visão de longo prazo</div>
      <div class="intro-grid">
        <h2>A solidez que <br /><em>constrói projetos únicos.</em></h2>
        <div class="intro-copy"><p>A Bauten é uma desenvolvedora imobiliária que transforma paisagens urbanas no Nordeste através de projetos que unem arquitetura autoral, inovação construtiva e compromisso com as pessoas.</p><button class="text-link dark" @click="openAbout">Conheça nosso jeito de fazer <span>→</span></button></div>
      </div>
    </section>

    <section class="leadership section shell reveal"><div class="section-heading"><div><div class="section-kicker"><span></span> Quem lidera cada decisão</div><h2>Uma empresa<br /><em>com rosto.</em></h2></div><p>A Bauten nasceu em Natal pela visão de Meiry França e Esaú Magalhães. Hoje, segue crescendo sem perder a proximidade.</p></div><div class="leaders"><article><img src="https://bauten.cc/assets/meiry-BbqGsf1e.png" alt="Meiry França, fundadora e CEO da Bauten" loading="lazy" /><div><span>Fundadora & CEO</span><h3>Meiry França</h3><blockquote>“Construir é deixar legado.”</blockquote><p>Engenheira civil com mais de 28 anos liderando projetos que redefinem o morar no Nordeste.</p></div></article><article><img src="https://bauten.cc/assets/esau-Du89lpO0.png" alt="Esaú Magalhães, cofundador da Bauten" loading="lazy" /><div><span>Co-fundador & Diretor de Novos Negócios</span><h3>Esaú Magalhães</h3><blockquote>“Visão estratégica gera valor real.”</blockquote><p>Mais de 20 anos em gestão financeira, fundos de investimento e estruturação de negócios imobiliários.</p></div></article></div></section>
    <section class="numbers section-dark reveal"><div class="shell"><div class="numbers-intro"><div class="section-kicker light"><span></span> Bauten em números</div><p>Uma trajetória construída com consistência.</p></div><div class="number-grid"><AnimatedNumber :target="28" suffix="anos" description="de experiência no desenvolvimento imobiliário" /><AnimatedNumber :target="8896" suffix="unidades" description="entregues com excelência e pontualidade" /><AnimatedNumber :target="1.5" :decimals="1" suffix="mi m²" description="de área desenvolvida no Nordeste" /><AnimatedNumber :target="780" suffix="milhões+" description="em valor geral de vendas acumulado" /></div></div></section>


    <section class="trust reveal"><div class="shell trust-inner"><div><div class="section-kicker"><span></span> Transparência que se comprova</div><h2>Confiança não se<br /><em>promete. Se constrói.</em></h2></div><div class="trust-copy"><p>Na Bauten, qualidade e credibilidade não são diferenciais, mas compromissos sustentados por certificações , auditorias e práticas reconhecidas.</p><div class="trust-logos"><span>PBQP-H<br /><small>Nível A</small></span><span>Deloitte<br /><small>Auditoria</small></span><span>FGV<br /><small>Parceiro</small></span><span>OBRA<br /><small>Assegurada</small></span></div></div></div></section>
    <section id="projetos" class="projects section section-tint"><div class="shell reveal"><div class="section-heading"><div><div class="section-kicker"><span></span> Portfólio</div><h2>Projetos que<br /><em>permanecem.</em></h2></div><p>Empreendimentos pensados para a vida real, com arquitetura autoral e planejamento de longo prazo.</p></div><div class="filter-row" role="tablist" aria-label="Filtrar projetos"><button v-for="filter in filters" :key="filter" :class="{ active: activeFilter === filter }" @click="activeFilter = filter">{{ filter }}</button></div><div class="project-carousel"><button v-if="visibleProjects.length > 4" class="project-carousel-arrow project-carousel-arrow-prev" aria-label="Projetos anteriores" @click="scrollProjects(-320)">←</button><div class="project-grid"><ProjectCard v-for="project in visibleProjects" :key="project.name" :project="project" @open="openProject" /></div><button v-if="visibleProjects.length > 4" class="project-carousel-arrow project-carousel-arrow-next" aria-label="Próximos projetos" @click="scrollProjects(320)">→</button></div><div class="projects-footer"><span>{{ visibleProjects.length }} projetos em destaque</span><button class="text-link dark" @click="openPortfolio">Ver portfólio completo <span>→</span></button></div></div></section>

    <section id="conteudo" class="editorial section shell reveal"><div class="section-heading"><div><div class="section-kicker"><span></span> Ideias e território</div><h2>O que estamos<br /><em>construindo.</em></h2></div><button class="text-link dark" @click="openBlog">Bauten na mídia <span>→</span></button></div><div class="editorial-grid"><article v-if="orderedArticles[0]" class="editorial-feature" role="link" tabindex="0" @click="openArticle(orderedArticles[0])" @keydown.enter="openArticle(orderedArticles[0])"><img :src="orderedArticles[0].image" :alt="orderedArticles[0].title" loading="lazy" /><div><span>{{ orderedArticles[0].category }} · {{ orderedArticles[0].readTime }}</span><h3>{{ orderedArticles[0].title }}</h3><button class="text-link light" @click.stop="openArticle(orderedArticles[0])">Ler história <span>→</span></button></div></article><div class="editorial-side"><article v-for="article in orderedArticles.slice(1, 3)" :key="article.slug" role="link" tabindex="0" @click="openArticle(article)" @keydown.enter="openArticle(article)"><span>{{ article.category }} · {{ article.readTime }}</span><h3>{{ article.title }}</h3><button class="text-link dark" @click.stop="openArticle(article)">Ler artigo <span>→</span></button></article></div></div></section>

    <section id="contato" class="contact section-dark reveal"><div class="shell contact-inner"><div><div class="section-kicker light"><span></span> Vamos conversar</div><h2>Seu próximo capítulo<br /><em>começa aqui.</em></h2><p>Conte o que você procura. Nossa equipe está pronta para encontrar o projeto certo para o seu momento.</p></div><form @submit.prevent="submitForm"><template v-if="!formSent"><label>Seu nome<input v-model="formName" required type="text" placeholder="Como podemos chamar você?" /></label><label>Seu e-mail<input v-model="formEmail" required type="email" placeholder="voce@email.com" /></label><label>Seu celular<input :value="formPhone" @input="updatePhone" required type="tel" inputmode="numeric" autocomplete="tel" maxlength="15" pattern="\(\d{2}\) \d{5}-\d{4}" placeholder="(83) 99999-9999" /></label><label>O que você procura?<select v-model="formInterest"><option>Conhecer um lançamento</option><option>Investir em um empreendimento</option><option>Agendar uma visita</option><option>Falar sobre parcerias</option></select></label><p v-if="formError" class="form-error" role="alert">{{ formError }}</p><button class="button button-light" type="submit" :disabled="formSubmitting">{{ formSubmitting ? 'Enviando…' : 'Enviar mensagem' }} <span>↗</span></button></template><div v-else class="success-message"><span>✓</span><h3>Mensagem enviada.</h3><p>Recebemos seus dados. Nossa equipe entrará em contato em breve.</p></div></form></div></section>
  </main>

  <AboutPage v-else-if="isAboutPage" @home="returnToHome" @portfolio="openPortfolio" />

  <main v-else-if="isPortfolioPage" class="portfolio-page">
    <section class="portfolio-hero"><div v-for="(project, index) in projects" :key="project.slug" class="portfolio-hero-image" :class="{ active: activePortfolioHero === index }" :style="{ backgroundImage: `url(${project.image})` }"></div><div class="portfolio-hero-shade"></div><div class="shell portfolio-hero-content"><a class="back-link light" href="/" @click.prevent="returnToHome">← Voltar para a Home</a><div><span class="project-detail-status">Portfólio completo</span><p class="eyebrow light">{{ projects[activePortfolioHero].location }}</p><h1>{{ projects[activePortfolioHero].name }}</h1><p>{{ projects[activePortfolioHero].detail }}</p><a class="button button-light hero-contact-button" href="https://wa.me/5583993675767?text=Olá!%20Quero%20conhecer%20o%20portfólio%20da%20Bauten." target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a></div></div><div class="portfolio-hero-controls"><button aria-label="Empreendimento anterior" @click="setPortfolioHero(activePortfolioHero - 1)">←</button><button v-for="(_, index) in projects" :key="index" :class="{ active: activePortfolioHero === index }" :aria-label="`Ver ${projects[index].name}`" @click="setPortfolioHero(index)"></button><button aria-label="Próximo empreendimento" @click="setPortfolioHero(activePortfolioHero + 1)">→</button></div></section>
    <section class="section shell portfolio-listing"><div class="section-heading"><div><div class="section-kicker"><span></span> Todos os empreendimentos</div><h2>Projetos que<br /><em>permanecem.</em></h2></div><p>Conheça cada projeto Bauten em detalhes: arquitetura, localização e experiências pensadas para a vida real.</p></div><div class="portfolio-grid"><ProjectCard v-for="project in projects" :key="project.slug" :project="project" @open="openProject" /></div></section>
  </main>

  <main v-else-if="isBlogPage" class="blog-page">
    <section class="blog-hero"><div class="shell"><button type="button" class="back-link light" @click="returnToHome">← Voltar para a Home</button><div class="section-kicker light"><span></span> Conteúdo Bauten</div><h1>Ideias que<br /><em>constroem.</em></h1><p>Arquitetura, território e os movimentos que transformam a forma de viver.</p><a class="button button-light hero-contact-button" href="https://wa.me/5583993675767?text=Olá!%20Quero%20falar%20com%20a%20Bauten." target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a></div></section>
    <section class="section shell blog-listing"><article v-if="orderedArticles[0]" class="blog-feature" role="link" tabindex="0" @click="openArticle(orderedArticles[0])" @keydown.enter="openArticle(orderedArticles[0])" @keydown.space.prevent="openArticle(orderedArticles[0])"><div class="blog-feature-image"><img :src="orderedArticles[0].image" :alt="orderedArticles[0].title" loading="eager" /></div><div class="blog-feature-content"><div class="blog-card-meta"><span>{{ orderedArticles[0].category }}</span><span>{{ formatArticleDate(orderedArticles[0].date) }} · {{ orderedArticles[0].readTime }}</span></div><h2>{{ orderedArticles[0].title }}</h2><p>{{ orderedArticles[0].excerpt }}</p><span class="blog-card-link">Ler artigo <span>↗</span></span></div></article><div class="blog-grid-secondary"><article v-for="article in orderedArticles.slice(1)" :key="article.slug" class="blog-card" role="link" tabindex="0" @click="openArticle(article)" @keydown.enter="openArticle(article)" @keydown.space.prevent="openArticle(article)"><div class="blog-card-image"><img :src="article.image" :alt="article.title" loading="lazy" /></div><div class="blog-card-content"><div class="blog-card-meta"><span>{{ article.category }}</span><span>{{ formatArticleDate(article.date) }} · {{ article.readTime }}</span></div><h2>{{ article.title }}</h2><p>{{ article.excerpt }}</p><span class="blog-card-link">Ler artigo <span>↗</span></span></div></article></div></section>
  </main>

  <main v-else-if="isArticlePage" class="article-page">
    <template v-if="selectedArticle">
      <section class="article-hero"><img :src="selectedArticle.image" :alt="selectedArticle.title" /><div class="article-hero-shade"></div><div class="shell article-hero-content"><a class="back-link light" href="/blog" @click="returnToBlog">← Voltar para o Blog</a><div><span class="article-category">{{ selectedArticle.category }}</span><p class="article-date">{{ formatArticleDate(selectedArticle.date) }} · {{ selectedArticle.readTime }}</p><h1>{{ selectedArticle.title }}</h1><p class="article-excerpt">{{ selectedArticle.excerpt }}</p><a class="button button-light hero-contact-button" :href="'https://wa.me/5583993675767?text=' + encodeURIComponent('Olá! Quero saber mais sobre o artigo ' + selectedArticle.title + '.')" target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a></div></div></section>
      <section class="section shell article-layout"><article class="article-body"><template v-for="(block, index) in articleBlocks" :key="index"><blockquote v-if="block.type === 'quote'">{{ block.text }}</blockquote><h2 v-else-if="block.type === 'heading'">{{ block.text }}</h2><p v-else>{{ block.text }}</p></template></article><aside class="article-sidebar"><div class="article-sidebar-block"><span class="section-kicker"><span></span> Sobre este artigo</span><dl><div><dt>Autor</dt><dd>{{ selectedArticle.author }}</dd></div><div><dt>Publicado em</dt><dd>{{ formatArticleDate(selectedArticle.date) }}</dd></div><div><dt>Leitura</dt><dd>{{ selectedArticle.readTime }}</dd></div></dl></div><button class="button button-dark article-share" @click="shareArticle">Compartilhar artigo <span>↗</span></button></aside></section>
      <section v-if="relatedArticles.length" class="section-tint related-section"><div class="shell"><div class="section-heading"><div><div class="section-kicker"><span></span> Continue lendo</div><h2>Artigos<br /><em>relacionados.</em></h2></div></div><div class="related-grid"><article v-for="article in relatedArticles" :key="article.slug" class="related-card" @click="openArticle(article)"><img :src="article.image" :alt="article.title" loading="lazy" /><div><span>{{ article.category }} · {{ article.readTime }}</span><h3>{{ article.title }}</h3><b>Ler artigo ↗</b></div></article></div></div></section>
    </template>
    <section v-else class="project-not-found section shell"><div class="section-kicker"><span></span> Bauten</div><h1>Artigo não encontrado.</h1><button class="button button-dark" @click="returnToBlog">Voltar para o Blog <span>↗</span></button></section>
  </main>

  <main v-else-if="isDetailPage" class="project-detail-page">
    <template v-if="selectedProject">
      <section class="project-detail-hero">
        <img :src="selectedProject.image" :alt="`Perspectiva do ${selectedProject.name}`" />
        <div class="project-detail-hero-shade"></div>
        <div class="shell project-detail-hero-content">
          <button class="back-link light" @click="returnToPortfolio">← Voltar para empreendimentos</button>
          <div class="project-detail-hero-copy">
<!-- A tag de status permanece disponível nos dados para reativação futura. -->
<!-- <span class="project-detail-status">{{ selectedProject.status }}</span> -->
            <p class="eyebrow light">{{ selectedProject.location }}</p>
            <h1>{{ selectedProject.name }}</h1>
            <p>{{ selectedProject.detail }}</p>
            <a class="button button-light hero-contact-button" :href="'https://wa.me/5583993675767?text=' + encodeURIComponent('Olá! Quero conhecer o empreendimento ' + selectedProject.name + '.')" target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a>
          </div>
        </div>
      </section>
      <section class="project-detail-intro section shell">
        <div class="project-detail-intro-heading"><div class="section-kicker"><span></span> Sobre o projeto</div><h2>Um lugar para<br /><em>viver com intenção.</em></h2></div>
        <div class="project-detail-intro-copy"><p>{{ selectedProject.description }}</p><p class="project-detail-address">{{ selectedProject.address }}</p><button class="button button-dark" @click="openProjectOnMap(selectedProject.address)">Ver localização no Google Maps <span>↗</span></button></div>
        <div class="project-detail-map"><iframe :src="`https://www.google.com/maps?q=${encodeURIComponent(selectedProject.address)}&output=embed`" :title="`Mapa da localização do ${selectedProject.name}`" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
      </section>
      <section class="project-detail-facts section-tint"><div class="shell project-detail-facts-grid"><div><div class="section-kicker"><span></span> Informações essenciais</div><h2>Feito para<br /><em>permanecer.</em></h2></div><div class="project-spec-grid"><div v-for="spec in selectedProject.specs" :key="spec[0]"><span>{{ spec[0] }}</span><strong>{{ spec[1] }}</strong></div></div></div></section>
      <section class="project-detail-highlights section shell"><div class="section-heading"><div><div class="section-kicker"><span></span> O que diferencia</div><h2>Detalhes que<br /><em>fazem sentido.</em></h2></div><p>Uma experiência pensada para valorizar a rotina, a localização e a relação com o território.</p></div><div class="highlight-grid"><div v-for="(highlight, index) in selectedProject.highlights" :key="highlight"><span>{{ String(index + 1).padStart(2, '0') }}</span><p>{{ highlight }}</p></div></div><div class="amenities-block"><div class="section-kicker"><span></span> Áreas comuns</div><div class="amenities-list"><span v-for="amenity in selectedProject.amenities" :key="amenity">{{ amenity }}</span></div></div></section>
      <section class="project-detail-gallery section-tint"><div class="shell"><div class="section-kicker"><span></span> Galeria</div><div class="detail-gallery-grid"><img v-for="(image, index) in visibleGalleryImages" :key="image" :src="image" :alt="`${selectedProject.name} — imagem ${index + 1}`" loading="lazy" /></div><button v-if="selectedProject.gallery.length > 3" class="button button-dark gallery-toggle" @click="toggleGallery">{{ galleryVisibleCount >= selectedProject.gallery.length ? 'Mostrar menos' : 'Ver mais fotos' }} <span>↗</span></button></div></section>
      <section class="project-detail-contact section-dark"><div class="shell project-detail-contact-inner"><div><div class="section-kicker light"><span></span> Próximo passo</div><h2>Quer conhecer<br /><em>{{ selectedProject.name }}?</em></h2></div><div><p>Fale com um consultor Bauten e descubra todos os detalhes, plantas e condições disponíveis.</p><a class="button button-light" :href="'https://wa.me/5583993675767?text=' + encodeURIComponent('Olá! Quero conhecer o projeto ' + selectedProject.name + '.')" target="_blank" rel="noreferrer">Falar pelo WhatsApp <span>↗</span></a></div></div></section>
    </template>
    <section v-else class="project-not-found section shell"><div class="section-kicker"><span></span> Bauten</div><h1>Projeto não encontrado.</h1><button class="button button-dark" @click="returnToHome">Voltar para a Home <span>↗</span></button></section>
  </main>

  <SiteFooter :is-internal-page="isDetailPage || isPortfolioPage || isAboutPage || isBlogPage || isArticlePage" :is-blog-page="isBlogPage" :is-article-page="isArticlePage" @home="returnToHome" @scroll="scrollToSection" @blog="openBlog" />
</template>
