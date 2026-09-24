/**
 * Rotas da aplicação.
 * Mantemos a navegação leve (History API) e centralizamos os caminhos
 * para que novas páginas possam ser adicionadas sem espalhar strings no app.
 */
export const routes = {
  home: '/',
  about: '/sobre',
  projects: '/empreendimentos',
  blog: '/blog',
  content: '/conteudo',
  project: (slug) => `/empreendimentos/${slug}`,
  article: (slug) => `/blog/${slug}`
}

export function getRoute(pathname = '/') {
  const path = pathname.replace(/\/+$/, '') || '/'

  if (path === routes.home) return { name: 'home', path }
  if (path === routes.about) return { name: 'about', path }
  if (path === routes.projects) return { name: 'projects', path }
  if (path === routes.blog) return { name: 'blog', path }
  if (path === routes.content) return { name: 'content', path }
  if (path.startsWith(`${routes.projects}/`)) return { name: 'project-detail', path, slug: getSlug(path) }
  if (path.startsWith(`${routes.blog}/`)) return { name: 'article-detail', path, slug: getSlug(path) }

  return { name: 'not-found', path }
}

export function getSlug(pathname = '/') {
  return pathname.split('/').filter(Boolean).pop() || ''
}
