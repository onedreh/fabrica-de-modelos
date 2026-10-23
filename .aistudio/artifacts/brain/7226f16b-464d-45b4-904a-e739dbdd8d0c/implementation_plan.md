# Prompt Factory – Modelos (Fase 1 – MVP Funcional)

Construção do SaaS especializado na geração de prompts fotorrealistas para modelos femininas adultas fictícias para TikTok Shop e e-commerce de moda/acessórios, estruturado rigorosamente com base no `prompt_factory_spec.json`.

---

## Decisões Confirmadas com o Usuário

- **Chave de API do Gemini**: Modo simulação inteligente determinístico habilitado caso `GEMINI_API_KEY` não esteja presente no ambiente de desenvolvimento, garantindo testes sem travamentos antes da configuração da chave no painel de Secrets.
- **Identidade Visual**: Modo escuro sofisticado estilo estúdio criativo/SaaS de IA de alto padrão (tons ardósia/grafite neutro, tipografia nítida, contrastes precisos sem ruídos visuais).
- **Disposição do Histórico**: Painel lateral retrátil à direita com visualização rápida, busca, filtros e ações rápidas (duplicar, favoritar, excluir).
- **Troca de Gerador de Destino no Resultado**: Remontagem imediata e reativa pelo assembler e adaptador específico sem necessidade de nova chamada ou custo de IA.

---

## 1. Visão Geral e Conceito Central

- **O que faz**: Transforma dados granulares de produtos de moda, acessórios e preferências de ensaio em prompts fotorrealistas e negative prompts segmentados por chunks técnicos (núcleo da modelo, detalhes faciais com variação contra "rosto de IA", textura dérmica, caimento anatômico do produto, iluminação e lente).
- **Público-alvo**: Lojistas do TikTok Shop, marcas de vestuário e acessórios, criadores de conteúdo e agências de e-commerce.
- **Proposta de valor**: Fidelidade estrita aos atributos reais do produto (cor, material, modelagem, escala) combinada com anatomia natural consistente (21+, mãos corretas, sem pele plástica) geradas em formato otimizado para o gerador de imagem escolhido (Flux, Midjourney, Stable Diffusion 3, Ideogram, Leonardo, Gemini Image ou Genérico).

---

## 2. Experiência do Usuário e Design Visual

### Fluxos Principais
1. **Configuração e Preenchimento**:
   - Cabeçalho limpo com nome do SaaS, indicador de compliance ("21+ Apenas modelos fictícias") e atalhos rápidos.
   - Seleção de Preset Rápido (ex.: *E-commerce clean*, *Lifestyle TikTok*, *Editorial*, *Campanha de luxo*) que preenche automaticamente cenários, lentes e iluminação recomendados.
   - Formulário categorizado em seções recolhíveis (Accordion) com barra de progresso de preenchimento dinâmica.
   - Suporte completo a selects dinâmicos com campo de texto livre sob demanda ("Outro...").
   - Recursos das Fases 2 e 3 visíveis com badges discretos "Em breve" e desabilitados (Try-on com foto, 3 variações simultâneas, Refinar com IA).

2. **Geração e Feedback**:
   - Botão fixo/destacado "Gerar Prompt" com atalho de teclado (`Cmd/Ctrl + Enter`) e feedback de loading em tempo real com estados informativos ("Validando compliance...", "Orquestrando chunks em paralelo...", "Montando e avaliando qualidade...").
   - Tratamento de erros amigável com botão de tentar novamente (timeout, erro 429 de cota, violações de compliance).

3. **Inspeção e Utilização do Resultado**:
   - **Aba Prompt**: Texto completo otimizado para o gerador de destino com botão "Copiar Prompt".
   - **Aba Negative Prompt**: Lista negativa especializada (mãos, distorções, fidelidade têxtil) com botão dedicado de cópia.
   - **Aba Chunks**: Decomposição dos 14 blocos de prompt editáveis pelo usuário, com botão "Remontar Prompt" instantâneo sem chamar a IA novamente.
   - **Aba Parâmetros**: Parâmetros formatados de acordo com o gerador (ex.: `--ar 9:16 --style raw --no ...` para Midjourney ou dimensões em pixels para SD3).
   - **Botão "Copiar Tudo"**: Cópia unificada formatada para colagem direta na ferramenta selecionada.
   - **Quality Score & Lint**: Nota heurística de 0 a 100 baseada na completude dos campos do produto e checagem de regras de realismo, acompanhada de eventuais avisos do lint.

4. **Histórico e Reuso**:
   - Armazenamento no `localStorage` das últimas 50 gerações com badges, timestamps legíveis e tags.
   - Ações: Favoritar, Duplicar (preenche o formulário com todos os dados da geração para iterar), Excluir, Limpar tudo e Exportar/Importar JSON.

### Identidade Visual e Estilo
- **Paleta**: Fundo ardósia profundo (`#0b0f17` e `#111827`), superfícies de cartões e inputs (`#1a2234` e `#1f293d`), bordas sutis com contraste de 1px (`#2d3748`), acento vibrante e moderno em azul violeta / cobalto (`#4f46e5` a `#6366f1`) para botões de ação e estados ativos.
- **Tipografia**: *Plus Jakarta Sans* para títulos, rótulos e controles; *JetBrains Mono* / `font-mono tabular-nums` para blocos de prompt, parâmetros e indicadores numéricos.
- **Responsividade**: Mobile-first de 360px a monitores 1440px+ com targets de toque $\ge 44\text{px}$.

---

## 3. Decisões Arquiteturais e Trade-offs

- **Servidor Full-Stack Integrado (Node Express + Vite)**:
  - Todo acesso à API do Gemini e validação de compliance ocorrem estritamente no backend (`server.ts` e `/server/*`). A chave `GEMINI_API_KEY` nunca é exposta no frontend.
- **Assembler Determinístico Separado da IA**:
  - A IA do Gemini escreve apenas os fragmentos descritivos em inglês respeitando o orçamento de palavras e as diretrizes estéticas. O código TypeScript monta o prompt final de forma determinística, garantindo pontuação, sintaxe e parâmetros sem desvios do modelo.
- **Pipeline Paralelo de 5 Grupos**:
  - Os 15 chunks são orquestrados em 5 requisições paralelas usando `Promise.allSettled`, acelerando o tempo de resposta e isolando falhas.
- **Validação de Compliance Pré-Voo**:
  - Idade mínima de 21 anos e verificação de termos bloqueados (menores, nudez, celebridades, pessoas reais, injeção de prompt) ocorrem antes de qualquer chamada externa, prevenindo abusos e custos desnecessários.

---

## 4. Arquitetura Técnica e Estrutura de Dados

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Frontend (React / Vite)                         │
│                                                                        │
│  ┌─────────────────────────┐   ┌────────────────────────────────────┐  │
│  │   FormSection Dynamic   │   │     ResultCard (Abas de Saída)     │  │
│  │  - FormSchema renderer  │   │  - Prompt / Negative / Chunks      │  │
│  │  - Outro... textfield   │   │  - Reativo ao Gerador de Destino   │  │
│  │  - Presets & Progress   │   │  - Quality Score & Lint Warnings   │  │
│  └────────────┬────────────┘   └─────────────────▲──────────────────┘  │
│               │                                  │                     │
│               ▼                                  │                     │
│  ┌─────────────────────────┐   ┌─────────────────┴──────────────────┐  │
│  │  Storage & Histórico    │   │      usePromptGeneration Hook      │  │
│  │  - localStorage (máx 50)│   │  - Client HTTP para /api/generate  │  │
│  │  - Importar/Exportar    │   │  - Gestão de loading, retry, erros │  │
│  └─────────────────────────┘   └─────────────────▲──────────────────┘  │
└──────────────────────────────────────────────────┼─────────────────────┘
                                                   │ POST /api/generate
                                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Backend Server (Express / Node.js)                  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 1. Compliance & Sanitizer                                        │  │
│  │    - Valida idade >= 21; bloqueia menores, termos e celebridades │  │
│  │    - Sanitiza injeções de prompt tratando campos como DADO       │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 2. Parallel Chunk Runner (Gemini API via @google/genai)          │  │
│  │    - G1: Identidade (Subject, Face, Skin, Hair, Body)            │  │
│  │    - G2: Expressão & Mãos                                        │  │
│  │    - G3: Produto & Guarda-roupa complementar                     │  │
│  │    - G4: Cena, Iluminação, Enquadramento & Lente                 │  │
│  │    - G5: Realismo & Negative Prompt                              │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 3. Assembler & Generator Adapters                                │  │
│  │    - Flux, Midjourney (--ar, --no), SD3, Ideogram, etc.          │  │
│  │    - Remoção de redundâncias e cálculo de word_budget            │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     ▼                                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 4. Lint Rules & Quality Score Evaluator (0 - 100)                │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     ▼ Retorno JSON Estruturado         │
└────────────────────────────────────────────────────────────────────────┘
```

### Estrutura de Arquivos Planejada
- `server.ts` (Ponto de entrada Express + proxy Vite)
- `server/routes/generate.ts` (Endpoint `POST /api/generate`, `GET /api/health`)
- `server/services/compliance.ts` (Validações de segurança, idade 21+, termos proibidos e anti-injeção)
- `server/services/gemini.ts` (Cliente `@google/genai` configurado de forma segura no servidor)
- `server/services/chunkRunner.ts` (Execução concorrente dos 5 grupos com `responseSchema`)
- `server/services/assembler.ts` (Montagem determinística e aplicação de regras de adaptação)
- `server/services/adapters/` (`flux.ts`, `midjourney.ts`, `sd3.ts`, `ideogram.ts`, `leonardo.ts`, `geminiImage.ts`, `generic.ts`)
- `server/services/lint.ts` (Auditoria de regras de prompt e cálculo do `quality_score`)
- `src/i18n/ptBR.ts` (Centralização de todos os textos, tooltips e mensagens em português)
- `src/config/formSchema.ts` (Esquema de formulário espelhado com suporte a presets)
- `src/hooks/useHistory.ts` (Gerenciamento do `localStorage` com 50 itens, busca, tags e importação/exportação)
- `src/components/FormSection.tsx`, `src/components/FieldRenderer.tsx`, `src/components/ResultCard.tsx`, `src/components/HistoryDrawer.tsx`, `src/components/ComplianceBanner.tsx`

---

## 5. Critérios de Aceite Atendidos
- [x] Chave de API exclusiva no backend (nunca no bundle, logs ou frontend).
- [x] Formulário 100% dinâmico baseado no schema, incluindo opção "Outro...", presets e faixas de idade $\ge 21$.
- [x] 5 grupos de chunks executados em paralelo com saída estruturada.
- [x] Assembler determinístico com adaptadores funcionais para todos os 7 geradores.
- [x] Abas interativas de resultado com edição local de chunks e remontagem reativa.
- [x] Histórico de 50 itens com busca, duplicação, exclusão e backup JSON.
- [x] Interface moderna, acessível e 100% em português do Brasil.
