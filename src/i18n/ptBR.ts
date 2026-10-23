/**
 * Centralização de strings em Português do Brasil (pt-BR)
 * Fonte da verdade para mensagens de interface, validações e alertas.
 */

export const i18n = {
  app: {
    title: 'Prompt Factory – Modelos',
    subtitle: 'Gerador fotorrealista de prompts para modelos adultas fictícias em TikTok Shop e e-commerce',
    badge_phase1: 'Fase 1 – MVP',
    generate_button: 'Gerar Prompt',
    generating: 'Montando os blocos do prompt...',
    reassemble_button: 'Remontar Prompt',
    reassembling: 'Remontando...',
    copy_all: 'Copiar Tudo',
    copied: 'Copiado!',
    reset_form: 'Limpar formulário',
    use_preset: 'Aplicar Preset Rápido',
    progress_label: 'Progresso do preenchimento',
    empty_result_title: 'Nenhum prompt gerado ainda',
    empty_result_desc: 'Preencha os detalhes do produto e da modelo ao lado e clique em "Gerar Prompt" para montar a descrição fotorrealista completa.'
  },
  compliance: {
    banner_adult: 'Modelo 21+ Fictícia',
    banner_tiktok: 'Conteúdo gerado por IA pode exigir identificação nas plataformas. Confira as políticas atuais antes de publicar.',
    banner_modal_title: 'Diretrizes de Conformidade e Segurança',
    banner_modal_content: 'A modelo é sempre uma mulher adulta (21+), 100% fictícia. É terminantemente proibido tentar gerar menores de idade, celebridades, pessoas reais, nudez ou poses explícitas. Todo texto digitado é tratado exclusivamente como dado descritivo do produto.',
    sensuality_note: 'O produto é sempre o foco principal. Nenhuma opção gera nudez ou pose explícita.'
  },
  tabs: {
    prompt: 'Prompt',
    negative: 'Negative prompt',
    chunks: 'Chunks (Editáveis)',
    params: 'Parâmetros'
  },
  history: {
    title: 'Histórico de Gerações',
    empty_title: 'Seu histórico está vazio',
    empty_desc: 'Os prompts que você gerar serão salvos automaticamente aqui no seu navegador (até 50 itens).',
    search_placeholder: 'Buscar no histórico por produto, estilo...',
    filter_all: 'Todos',
    filter_favorites: 'Apenas Favoritos',
    export_json: 'Exportar JSON',
    import_json: 'Importar JSON',
    clear_all: 'Limpar histórico',
    clear_confirm: 'Deseja realmente apagar todo o histórico de gerações local?',
    duplicate_action: 'Reaproveitar campos',
    delete_action: 'Excluir',
    copied_action: 'Prompt copiado',
    count_label: 'gerações salvas'
  },
  quality: {
    score_title: 'Índice de Qualidade',
    warnings_title: 'Observações de Qualidade e Lint',
    score_excellent: 'Excelente fidelidade e especificação',
    score_good: 'Boa qualidade, detalhes essenciais presentes',
    score_fair: 'Qualidade regular, considere detalhar mais o produto',
    score_needs_work: 'Campos essenciais incompletos'
  },
  future_features: {
    coming_soon: 'Em breve',
    refine_tooltip: 'O ajuste em linguagem natural estará disponível na Fase 2.',
    variations_tooltip: 'A geração de 3 variações simultâneas estará disponível na Fase 2.',
    tryon_tooltip: 'O modo try-on com upload da foto real do produto estará disponível na Fase 3.',
    profile_save_tooltip: 'O salvamento permanente de perfis reutilizáveis estará disponível na Fase 2.'
  },
  errors: {
    generic: 'Ocorreu um erro ao gerar o prompt. Por favor, tente novamente.',
    network: 'Falha de comunicação com o servidor. Verifique sua conexão e tente novamente.',
    rate_limit: 'Você atingiu o limite de requisições por minuto. Aguarde alguns instantes.',
    retry: 'Tentar novamente',
    dismiss: 'Fechar'
  }
};
