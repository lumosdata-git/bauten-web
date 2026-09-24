# Bauten — Site Institucional

Site institucional da Bauten, desenvolvido para apresentar a construtora, seus empreendimentos, conteúdos editoriais e canais de contato.

## Visão geral

O projeto foi construído com Vue 3 e Vite, seguindo uma identidade visual sóbria, elegante e responsiva.

Principais áreas:

- Home institucional;
- apresentação da Bauten;
- portfólio e páginas individuais dos empreendimentos;
- blog e páginas individuais dos artigos;
- formulário “Vamos conversar”;
- integração com Supabase para armazenamento dos leads;
- VLibras e controles de acessibilidade;
- mapas do Google para localização dos empreendimentos.

## Tecnologias

- Vue 3;
- Vite;
- JavaScript ES Modules;
- Supabase;
- Supabase Edge Functions (estrutura preparada para envio de emails);
- CSS responsivo;
- VLibras;
- Google Maps;
- imagens locais em `public/images`.

## Requisitos

- Node.js 18 ou superior;
- npm;
- uma conta no Supabase.

## Clonar o projeto

```bash
git clone git@github.com:lumosdata-git/bauten-web.git
cd bauten-web
```

Alternativa via HTTPS:

```bash
git clone https://github.com/lumosdata-git/bauten-web.git
cd bauten-web
```

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie `.env.local` na raiz:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-publishable-key
```

Os valores estão no painel do Supabase em **Settings → API Keys** e **Settings → Data API**.

Use a chave **Publishable** ou a chave legada `anon`. Nunca utilize `service_role` no frontend e nunca publique `.env.local`.

As configurações de ambiente do Supabase ficam disponíveis no Discord da Lumos, no canal ou espaço destinado aos colaboradores autorizados. Solicite acesso à equipe responsável e nunca publique essas credenciais em commits, issues ou mensagens públicas.

## Configuração do Supabase

1. Crie um projeto no Supabase.
2. Abra o **SQL Editor**.
3. Execute `supabase/schema.sql`.

O script cria a tabela `leads`, valida os campos, habilita RLS e permite inserções controladas pelo formulário.

O formulário salva nome, email, celular, interesse e data de criação. Os dados são normalizados antes da gravação: espaços extras são removidos, email e interesse ficam em lowercase e o telefone é salvo com 11 dígitos.

## Desenvolvimento local

```bash
npm run dev
```

O projeto normalmente estará disponível em `http://localhost:5173`.

## Scripts

```bash
npm run dev       # servidor de desenvolvimento
npm run build     # build de produção em dist/
npm run preview   # visualização do build
```

Valide antes de publicar:

```bash
npm run build
```

## Estrutura

```text
.
├── public/images/            imagens públicas
├── src/components/           componentes reutilizáveis
├── src/lib/                  integrações externas
├── src/router/               definição das rotas
├── src/App.vue               composição principal
├── src/blogData.js           dados dos artigos
├── src/main.js               inicialização do Vue e VLibras
├── src/styles.css            estilos globais
├── supabase/schema.sql       estrutura do banco
├── supabase/service/         serviço de leads
├── supabase/functions/       Edge Functions
├── .env.local                configurações locais, não versionado
└── vite.config.js
```

## Rotas principais

```text
/                         Home
/sobre                    Página institucional
/empreendimentos          Portfólio completo
/empreendimentos/:slug    Detalhes de um empreendimento
/blog                     Lista de artigos
/blog/:slug               Artigo individual
```

As rotas ficam centralizadas em `src/router/index.js`.

## Imagens

As imagens usadas no deploy ficam em `public/images` e são referenciadas por caminhos iniciados em `/images`.

As versões utilizadas estão organizadas principalmente em pastas `site-optimized`. Imagens brutas e pesadas devem permanecer fora do Git.

Ao adicionar uma imagem:

1. prefira WebP, AVIF ou JPG otimizado;
2. redimensione para o tamanho necessário;
3. use a pasta correspondente ao empreendimento ou seção;
4. atualize a referência no código;
5. execute `npm run build`.

## Edge Function

Existe uma Edge Function preparada em `supabase/functions/send-lead-email/index.ts`.

No momento, o formulário salva os leads diretamente no Supabase. A função está preparada para uma etapa futura de envio de email por Resend.

Para publicar posteriormente:

```bash
npx supabase login
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase functions deploy send-lead-email
```

As chaves do Resend devem ser configuradas como secrets no Supabase, nunca no frontend.

## Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com).
2. Clique em **Add New Project**.
3. Importe `lumosdata-git/bauten-web`.
4. Configure:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

5. Adicione na Vercel:

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

6. Clique em **Deploy**.

## Segurança

- Nunca commite `.env.local`;
- nunca use `service_role` no navegador;
- mantenha RLS ativo;
- não coloque chaves privadas em `public`;
- valide dados no frontend e no banco;
- use secrets do Supabase para integrações de backend;
- evite imagens originais muito pesadas no repositório.

## Fluxo de contribuição

```bash
npm run build
git status
git add arquivos-alterados
git commit -m "Descreve a alteração"
git push origin main
```

Mantenha commits objetivos e não inclua arquivos gerados, credenciais ou imagens não utilizadas.

## Status atual

O site está preparado para avaliação visual inicial pela equipe da Bauten. O formulário já grava leads no Supabase. O envio automático de emails será ativado posteriormente, após a configuração do domínio e do serviço de email.
