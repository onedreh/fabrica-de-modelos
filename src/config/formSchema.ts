export interface FormFieldOption {
  value: string | number;
  label: string;
}

export interface FormField {
  id: string;
  label: string;
  type: 'select' | 'select_dynamic' | 'text' | 'textarea' | 'checkbox';
  options?: (string | FormFieldOption)[];
  allow_other?: boolean;
  default?: any;
  required?: boolean;
  placeholder?: string;
  help?: string;
  disabled?: boolean;
  disabled_options?: string[];
  visible_if?: string;
  maps_to_chunk?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export const PRESETS: Record<string, Record<string, any>> = {
  ecommerce_clean: {
    background: 'Estúdio branco infinito',
    lighting: 'Softbox suave frontal',
    camera_angle: 'Altura dos olhos',
    lens: '85mm retrato',
    photo_style: 'E-commerce clean',
    framing: 'Corpo inteiro',
    expression: 'Neutra elegante',
    complement_style: 'Peças neutras lisas (padrão)'
  },
  lifestyle_tiktok: {
    background: 'Quarto/closet lifestyle',
    lighting: 'Luz natural de janela',
    camera_angle: 'Levemente abaixo (alonga a silhueta)',
    lens: '35mm lifestyle',
    photo_style: 'Foto estilo celular (UGC realista)',
    framing: '3/4 (dos joelhos para cima)',
    expression: 'Sorriso leve e natural',
    aspect_ratio: '9:16'
  },
  editorial: {
    background: 'Estúdio cinza neutro',
    lighting: 'Luz dramática lateral',
    camera_angle: 'Lateral 3/4',
    lens: '85mm retrato',
    photo_style: 'Editorial de moda',
    expression: 'Olhar confiante',
    posture: 'Elegante de passarela'
  },
  luxury_campaign: {
    background: 'Loja / boutique',
    lighting: 'Luz de estúdio com contraluz suave',
    camera_angle: 'Altura dos olhos',
    lens: '85mm retrato',
    photo_style: 'Campanha de luxo',
    expression: 'Serena e suave',
    vibe: 'Sofisticada'
  }
};

export const PRESET_COMPLETE_EXAMPLES: Record<string, Record<string, any>> = {
  ecommerce_clean: {
    preset: 'ecommerce_clean',
    target_generator: 'flux',
    aspect_ratio: '9:16',
    ethnicity: 'Brasileira (miscigenada)',
    age: '26-30',
    face_type: 'Oval',
    features: 'sobrancelhas bem desenhadas naturais, sardas sutis sobre o dorso do nariz, lábios suaves e expressivos',
    skin_tone: 'Morena',
    skin_finish: 'Natural com poros visíveis',
    hair: 'castanho chocolate escuro, ondulado na altura dos ombros com movimento natural e flyaways',
    eyes: 'Castanho escuro',
    body_type: 'Média / equilibrada',
    height: 'Média (1,61–1,70 m)',
    posture: 'Ereta e confiante',
    expression: 'Neutra elegante',
    vibe: 'Sofisticada',
    makeup: 'Natural / no-makeup',
    nails: 'Nude / rosa claro',
    hands_position: 'braços relaxados ao longo do corpo com dedos suavemente entreabertos',
    product_type: 'Vestido / macacão',
    product_name: 'Vestido Midi Canelado com Fenda Lateral',
    product_color: 'terracota profundo',
    product_material: 'malha canelada premium de algodão com elastano de gramatura média',
    product_fit: 'Justo ao corpo',
    product_details: 'decote reto clássico, alças largas confortáveis, fenda lateral sutil até a altura do joelho, acabamento de bainha invisível',
    product_size_ref: '',
    framing: 'Corpo inteiro',
    pose: 'em pé frontal com leve peso na perna esquerda, olhar sereno para a câmera',
    complement_style: 'Peças neutras lisas (padrão)',
    complement_notes: 'sandália de tiras finas bege neutra, sem joias chamativas ou logotipos',
    background: 'Estúdio branco infinito',
    photo_style: 'E-commerce clean',
    lighting: 'Softbox suave frontal',
    camera_angle: 'Altura dos olhos',
    lens: '85mm retrato',
    sensuality: 'Discreto / comercial',
    face_variation: true,
    avoid: 'sorriso forçado, olhar vazio, rugas excessivas no tecido, pele plástica de IA'
  },
  lifestyle_tiktok: {
    preset: 'lifestyle_tiktok',
    target_generator: 'flux',
    aspect_ratio: '9:16',
    ethnicity: 'Brasileira (miscigenada)',
    age: '21-25',
    face_type: 'Coração',
    features: 'sorriso radiante espontâneo, pequenas covinhas nas bochechas, olhar brilhante e comunicativo',
    skin_tone: 'Clara',
    skin_finish: 'Luminosa (glow sutil)',
    hair: 'castanho iluminado com mechas mel, longo em ondas descontraídas e flyaways leves',
    eyes: 'Castanho claro / mel',
    body_type: 'Magra',
    height: 'Média (1,61–1,70 m)',
    posture: 'Relaxada e natural',
    expression: 'Sorriso leve e natural',
    vibe: 'Jovial e leve',
    makeup: 'Suave com batom nude',
    nails: 'Francesinha',
    hands_position: 'uma mão no bolso da jaqueta e a outra gesticulando de forma descontraída',
    product_type: 'Roupa (parte de cima)',
    product_name: 'Jaqueta Jeans Cropped Vintage com Bolsos Frontais',
    product_color: 'azul denim vintage com lavagem média clara',
    product_material: 'jeans 100% algodão encorpado com textura de sarja visível',
    product_fit: 'Solto / oversized',
    product_details: 'botões metálicos envelhecidos, costura pespontada em linha ocre, barra desfiada leve, bolsos funcionais com aba no peito',
    product_size_ref: '',
    framing: '3/4 (dos joelhos para cima)',
    pose: 'em pé descontraída, corpo em leve ângulo 3/4, transmitindo autenticidade de vídeo TikTok',
    complement_style: 'Branco total básico',
    complement_notes: 'cropped básico branco de malha canelada por baixo, calça bege de sarja lisa',
    background: 'Quarto/closet lifestyle',
    photo_style: 'Foto estilo celular (UGC realista)',
    lighting: 'Luz natural de janela',
    camera_angle: 'Levemente abaixo (alonga a silhueta)',
    lens: '35mm lifestyle',
    sensuality: 'Elegante / confiante',
    face_variation: true,
    avoid: 'pose dura de catálogo tradicional, edição excessiva de estúdio, filtro artificial'
  },
  editorial: {
    preset: 'editorial',
    target_generator: 'midjourney',
    aspect_ratio: '4:5',
    ethnicity: 'Negra / afro-brasileira',
    age: '26-30',
    face_type: 'Alongado',
    features: 'traços marcantes, maçãs do rosto bem esculpidas, lábios volumosos e delineados com perfeição',
    skin_tone: 'Negra retinta',
    skin_finish: 'Luminosa (glow sutil)',
    hair: 'tranças nagô geométricas bem desenhadas presas em coque alto imponente',
    eyes: 'Castanho escuro',
    body_type: 'Atlética',
    height: 'Alta (1,71–1,80 m)',
    posture: 'Elegante de passarela',
    expression: 'Olhar confiante',
    vibe: 'Sofisticada',
    makeup: 'Marcante (olho esfumado)',
    nails: 'Preto',
    hands_position: 'mão direita erguida com dedos longos e elegantes tocando o queixo suavemente',
    product_type: 'Roupa (parte de cima)',
    product_name: 'Blazer Alfaiataria Oversized com Lapela Peak',
    product_color: 'verde esmeralda acetinado profundo',
    product_material: 'crepe encorpado com caimento pesado e forro de seda tonal',
    product_fit: 'Estruturado',
    product_details: 'ombros estruturados com ombreiras finas, fechamento duplo com botões encapados, bolsos com lapela decorativa',
    product_size_ref: '',
    framing: '3/4 (dos joelhos para cima)',
    pose: 'postura imponente de capa de revista, queixo levemente erguido, corpo em 45 graus',
    complement_style: 'Preto total básico',
    complement_notes: 'calça de alfaiataria preta lisa reta, sem joias para não disputar o corte da peça',
    background: 'Estúdio cinza neutro',
    photo_style: 'Editorial de moda',
    lighting: 'Luz dramática lateral',
    camera_angle: 'Lateral 3/4',
    lens: '85mm retrato',
    sensuality: 'Fashion editorial',
    face_variation: true,
    avoid: 'sorriso casual, fundo poluído, iluminação chapada sem sombras'
  },
  luxury_campaign: {
    preset: 'luxury_campaign',
    target_generator: 'midjourney',
    aspect_ratio: '1:1',
    ethnicity: 'Brasileira (miscigenada)',
    age: '26-30',
    face_type: 'Diamante',
    features: 'traços refinados e aristocráticos, linha do maxilar limpa, olhar sereno de alta joalheria',
    skin_tone: 'Média clara',
    skin_finish: 'Natural com poros visíveis',
    hair: 'castanho acetinado preso em coque baixo clean e polido',
    eyes: 'Verde',
    body_type: 'Média / equilibrada',
    height: 'Média (1,61–1,70 m)',
    posture: 'Ereta e confiante',
    expression: 'Serena e suave',
    vibe: 'Sofisticada',
    makeup: 'Suave com batom nude',
    nails: 'Nude / rosa claro',
    hands_position: 'mão delicada repousando suavemente próxima à clavícula, dedos relaxados com 5 dedos anatômicos',
    product_type: 'Joia / bijuteria',
    product_name: 'Colar Gargantilha Banhado a Ouro 18k com Pingente Esmeralda',
    product_color: 'dourado polido brilhante com pedra verde esmeralda luminosa',
    product_material: 'ouro amarelo 18k com acabamento espelhado e zircônia lapidada em gota',
    product_fit: 'Ajustado',
    product_details: 'corrente veneziana delicada de 45 cm, pingente solitário de 1,8 cm com cravação inglesa sofisticada, fecho boia imperceptível',
    product_size_ref: 'pingente solitário de 1,8 cm em gota',
    framing: 'Close-up rosto/pescoço (joias/óculos)',
    pose: 'rosto em ângulo 3/4 sereno, pescoço alongado destacando o ponto de luz da joia sobre a pele',
    complement_style: 'Preto total básico',
    complement_notes: 'blusa de gola alta preta de malha fina lisa sem texturas ou detalhes',
    background: 'Loja / boutique',
    photo_style: 'Campanha de luxo',
    lighting: 'Luz de estúdio com contraluz suave',
    camera_angle: 'Altura dos olhos',
    lens: '100mm macro (detalhes)',
    sensuality: 'Elegante / confiante',
    face_variation: true,
    avoid: 'reflexo estourado na joia que oculte a pedra, maquiagem carregada, pele plástica'
  }
};

export const FORM_SECTIONS: FormSection[] = [
  {
    id: 'mode_output',
    title: '1. Modo e Saída',
    description: 'Defina o gerador de destino, proporção e formato do prompt.',
    fields: [
      {
        id: 'generation_mode',
        label: 'Modo de geração',
        type: 'select',
        options: [
          { value: 'text_to_image', label: 'Gerar do zero (texto para imagem)' },
          { value: 'tryon_reference', label: 'Com foto do produto (try-on / edição) — Em breve' }
        ],
        default: 'text_to_image',
        disabled_options: ['tryon_reference'],
        help: 'O modo com foto de referência real chega na Fase 3.'
      },
      {
        id: 'target_generator',
        label: 'Gerador de destino',
        type: 'select',
        options: [
          { value: 'flux', label: 'Flux (Prosa descritiva fluida)' },
          { value: 'midjourney', label: 'Midjourney (Parâmetros --ar e --no)' },
          { value: 'sd3', label: 'Stable Diffusion 3 (Resoluções nativas)' },
          { value: 'ideogram', label: 'Ideogram' },
          { value: 'leonardo', label: 'Leonardo AI' },
          { value: 'gemini_image', label: 'Gemini (Imagem)' },
          { value: 'generic', label: 'Genérico (Universal)' }
        ],
        default: 'flux',
        required: true,
        maps_to_chunk: 'assembler'
      },
      {
        id: 'aspect_ratio',
        label: 'Proporção da imagem',
        type: 'select',
        options: [
          { value: '9:16', label: '9:16 – Vídeo/story/capa vertical TikTok' },
          { value: '4:5', label: '4:5 – Galeria de feed de produto' },
          { value: '1:1', label: '1:1 – Capa quadrada' },
          { value: '3:4', label: '3:4 – Retrato padrão' },
          { value: '16:9', label: '16:9 – Banner horizontal' }
        ],
        default: '9:16',
        required: true,
        maps_to_chunk: 'assembler'
      },
      {
        id: 'variations',
        label: 'Quantidade de variações',
        type: 'select',
        options: [
          { value: 1, label: '1 variação' },
          { value: 3, label: '3 variações simultâneas — Em breve (Fase 2)' }
        ],
        disabled_options: ['3'],
        default: 1
      },
      {
        id: 'preset',
        label: 'Preset rápido de iluminação e cena',
        type: 'select',
        options: [
          { value: 'none', label: 'Nenhum (personalizado)' },
          { value: 'ecommerce_clean', label: 'E-commerce clean (estúdio branco)' },
          { value: 'lifestyle_tiktok', label: 'Lifestyle TikTok (UGC quarto/luz natural)' },
          { value: 'editorial', label: 'Editorial de moda (luz dramática)' },
          { value: 'luxury_campaign', label: 'Campanha de luxo (boutique sofisticada)' }
        ],
        default: 'none',
        help: 'Preenche automaticamente iluminação, ângulo, lente e fundo.'
      }
    ]
  },
  {
    id: 'identity',
    title: '2. Identidade da Modelo',
    description: 'Aparência da modelo adulta fictícia (idade mínima 21 anos).',
    fields: [
      {
        id: 'ethnicity',
        label: 'Etnia / ancestralidade',
        type: 'select',
        options: [
          'Brasileira (miscigenada)',
          'Branca / europeia',
          'Negra / afro-brasileira',
          'Parda',
          'Asiática',
          'Latina',
          'Indígena',
          'Oriente Médio',
          'Mista'
        ],
        default: 'Brasileira (miscigenada)',
        allow_other: true,
        maps_to_chunk: 'subject_core'
      },
      {
        id: 'age',
        label: 'Faixa etária aparente (obrigatório 21+)',
        type: 'select',
        options: ['21-25', '26-30', '31-35', '36-45', '46-55', '56+'],
        default: '26-30',
        required: true,
        help: 'Conformidade inegociável: apenas mulheres adultas a partir de 21 anos.',
        maps_to_chunk: 'subject_core'
      },
      {
        id: 'face_type',
        label: 'Formato de rosto',
        type: 'select',
        options: ['Oval', 'Coração', 'Redondo', 'Quadrado', 'Alongado', 'Diamante'],
        allow_other: true,
        maps_to_chunk: 'face_details'
      },
      {
        id: 'features',
        label: 'Traços distintivos do rosto',
        type: 'textarea',
        placeholder: 'Ex: sobrancelhas arqueadas naturais, sardas suaves no nariz, lábios bem delineados, maçãs do rosto suaves...',
        maps_to_chunk: 'face_details'
      },
      {
        id: 'skin_tone',
        label: 'Tom de pele',
        type: 'select',
        options: ['Muito clara', 'Clara', 'Média clara', 'Oliva', 'Morena', 'Parda escura', 'Negra retinta'],
        allow_other: true,
        maps_to_chunk: 'skin_texture'
      },
      {
        id: 'skin_finish',
        label: 'Aspecto da pele',
        type: 'select',
        options: [
          'Natural com poros visíveis',
          'Luminosa (glow sutil)',
          'Matte natural',
          'Com sardas',
          'Com pequenas marcas naturais'
        ],
        default: 'Natural com poros visíveis',
        maps_to_chunk: 'skin_texture'
      },
      {
        id: 'hair',
        label: 'Cabelo (cor, comprimento, textura, estilo)',
        type: 'text',
        placeholder: 'Ex: castanho escuro, longo ondulado, solto com movimento natural e flyaways',
        maps_to_chunk: 'hair'
      },
      {
        id: 'eyes',
        label: 'Cor dos olhos',
        type: 'select',
        options: ['Castanho escuro', 'Castanho claro / mel', 'Verde', 'Azul', 'Cinza', 'Preto'],
        allow_other: true,
        maps_to_chunk: 'face_details'
      }
    ]
  },
  {
    id: 'body',
    title: '3. Corpo e Silhueta',
    fields: [
      {
        id: 'body_type',
        label: 'Tipo de corpo',
        type: 'select',
        options: ['Magra', 'Atlética', 'Média / equilibrada', 'Curvilínea', 'Ampulheta', 'Plus size', 'Petite'],
        allow_other: true,
        default: 'Média / equilibrada',
        help: 'Diversidade natural alinhada ao público do seu produto.',
        maps_to_chunk: 'body_posture'
      },
      {
        id: 'height',
        label: 'Altura aparente',
        type: 'select',
        options: ['Baixa (1,55–1,60 m)', 'Média (1,61–1,70 m)', 'Alta (1,71–1,80 m)', 'Muito alta (1,80 m+)'],
        default: 'Média (1,61–1,70 m)',
        maps_to_chunk: 'body_posture'
      },
      {
        id: 'proportions',
        label: 'Proporções corporais (opcional)',
        type: 'textarea',
        placeholder: 'Descreva de forma natural (ombros relaxados, cintura natural, pernas longas...)',
        maps_to_chunk: 'body_posture'
      },
      {
        id: 'posture',
        label: 'Postura preferida',
        type: 'select',
        options: ['Ereta e confiante', 'Relaxada e natural', 'Dinâmica (em movimento)', 'Elegante de passarela'],
        default: 'Ereta e confiante',
        allow_other: true,
        maps_to_chunk: 'body_posture'
      }
    ]
  },
  {
    id: 'expression',
    title: '4. Expressão e Personalidade',
    fields: [
      {
        id: 'expression',
        label: 'Expressão facial',
        type: 'select',
        options: ['Neutra elegante', 'Sorriso leve e natural', 'Olhar confiante', 'Sorriso aberto espontâneo', 'Serena e suave'],
        default: 'Olhar confiante',
        allow_other: true,
        maps_to_chunk: 'expression_vibe'
      },
      {
        id: 'vibe',
        label: 'Energia / Vibe',
        type: 'select',
        options: ['Sofisticada', 'Natural e próxima', 'Confiante e moderna', 'Jovial e leve', 'Minimalista'],
        default: 'Confiante e moderna',
        allow_other: true,
        maps_to_chunk: 'expression_vibe'
      },
      {
        id: 'avoid',
        label: 'Evitar (termos indesejados no prompt negativo)',
        type: 'textarea',
        placeholder: 'Ex: sorriso forçado, olhar robótico, rosto simétrico demais, maquiagem pesada...',
        maps_to_chunk: 'negative'
      }
    ]
  },
  {
    id: 'makeup_nails',
    title: '5. Maquiagem, Unhas e Mãos',
    description: 'Fundamental para anéis, pulseiras, colares, bolsas e relógios.',
    fields: [
      {
        id: 'makeup',
        label: 'Maquiagem',
        type: 'select',
        options: [
          'Nenhuma aparente (pele natural)',
          'Natural / no-makeup',
          'Suave com batom nude',
          'Marcante (olho esfumado)',
          'Batom vermelho clássico'
        ],
        default: 'Natural / no-makeup',
        allow_other: true,
        maps_to_chunk: 'makeup_nails_hands'
      },
      {
        id: 'nails',
        label: 'Unhas',
        type: 'select',
        options: ['Naturais curtas', 'Francesinha', 'Nude / rosa claro', 'Vermelho', 'Preto', 'Sem esmalte'],
        default: 'Nude / rosa claro',
        allow_other: true,
        maps_to_chunk: 'makeup_nails_hands'
      },
      {
        id: 'hands_position',
        label: 'Posição das mãos em relação ao produto',
        type: 'text',
        placeholder: 'Ex: mão esquerda tocando a gola do casaco; segurando a alça da bolsa suavemente',
        maps_to_chunk: 'makeup_nails_hands'
      }
    ]
  },
  {
    id: 'product',
    title: '6. Produto (Fidelidade Máxima)',
    description: 'Descreva com máxima precisão o produto real que você comercializa.',
    fields: [
      {
        id: 'product_type',
        label: 'Tipo de produto',
        type: 'select',
        options: [
          'Roupa (parte de cima)',
          'Roupa (parte de baixo)',
          'Vestido / macacão',
          'Conjunto',
          'Moda praia',
          'Lingerie / íntimo',
          'Sapato',
          'Bolsa',
          'Joia / bijuteria',
          'Óculos',
          'Relógio',
          'Acessório de cabelo',
          'Cinto / lenço',
          'Outro'
        ],
        default: 'Vestido / macacão',
        allow_other: true,
        required: true,
        maps_to_chunk: 'product_integration'
      },
      {
        id: 'product_name',
        label: 'Nome do produto (interno)',
        type: 'text',
        placeholder: 'Ex: Vestido midi canelado com fenda lateral',
        required: true,
        maps_to_chunk: 'product_integration'
      },
      {
        id: 'product_color',
        label: 'Cor exata',
        type: 'text',
        placeholder: 'Ex: terracota escuro; verde oliva militar; preto fosco; dourado champanhe',
        required: true,
        maps_to_chunk: 'product_integration'
      },
      {
        id: 'product_material',
        label: 'Material / Tecido',
        type: 'text',
        placeholder: 'Ex: malha canelada de algodão com elastano; linho cru; couro sintético macio',
        required: true,
        maps_to_chunk: 'product_integration'
      },
      {
        id: 'product_fit',
        label: 'Caimento / Modelagem',
        type: 'select',
        options: ['Justo ao corpo', 'Ajustado', 'Reto', 'Solto / oversized', 'Evasê', 'Estruturado'],
        default: 'Ajustado',
        allow_other: true,
        maps_to_chunk: 'product_integration'
      },
      {
        id: 'product_details',
        label: 'Detalhes construtivos do produto',
        type: 'textarea',
        placeholder: 'Botões amadeirados, fenda lateral discreta, costura reforçada, textura canelada em relevo...',
        maps_to_chunk: 'product_integration'
      },
      {
        id: 'product_size_ref',
        label: 'Escala / Medida (para joias, bolsas e acessórios)',
        type: 'text',
        placeholder: 'Ex: bolsa média 28 cm; brinco argola de 3 cm; colar com pingente de 1,5 cm',
        maps_to_chunk: 'product_integration'
      },
      {
        id: 'framing',
        label: 'Como mostrar o produto (Enquadramento)',
        type: 'select',
        options: [
          'Corpo inteiro',
          '3/4 (dos joelhos para cima)',
          'Meio corpo',
          'Close-up rosto/pescoço (joias/óculos)',
          'Close-up mãos (anéis/relógios)',
          'Detalhe do produto'
        ],
        default: '3/4 (dos joelhos para cima)',
        required: true,
        maps_to_chunk: 'pose_framing'
      },
      {
        id: 'pose',
        label: 'Pose específica',
        type: 'text',
        placeholder: 'Ex: em pé com leve rotação do tronco, mão apoiada suavemente no quadril',
        maps_to_chunk: 'pose_framing'
      }
    ]
  },
  {
    id: 'styling',
    title: '7. Complemento do Look',
    description: 'O que a modelo veste além do produto em destaque.',
    fields: [
      {
        id: 'complement_style',
        label: 'Estilo do complemento',
        type: 'select',
        options: [
          'Peças neutras lisas (padrão)',
          'Monocromático combinando',
          'Jeans básico',
          'Preto total básico',
          'Branco total básico'
        ],
        default: 'Peças neutras lisas (padrão)',
        help: 'Evita roupas chamativas que roubem a atenção do produto.',
        maps_to_chunk: 'wardrobe_base'
      },
      {
        id: 'complement_notes',
        label: 'Observações sobre o complemento',
        type: 'textarea',
        placeholder: 'Ex: sem logotipos visíveis, sem estampas, sem outros acessórios chamativos',
        maps_to_chunk: 'wardrobe_base'
      }
    ]
  },
  {
    id: 'scene',
    title: '8. Ambiente e Fotografia',
    fields: [
      {
        id: 'background',
        label: 'Ambiente / Fundo',
        type: 'select',
        options: [
          'Estúdio branco infinito',
          'Estúdio cinza neutro',
          'Estúdio com cor da marca',
          'Quarto/closet lifestyle',
          'Rua urbana (outdoor)',
          'Café / interior aconchegante',
          'Praia / piscina',
          'Jardim / natureza',
          'Loja / boutique'
        ],
        default: 'Estúdio branco infinito',
        allow_other: true,
        maps_to_chunk: 'environment'
      },
      {
        id: 'brand_palette',
        label: 'Paleta de cores da marca (opcional)',
        type: 'text',
        placeholder: 'Ex: tons terrosos, bege areia e branco off-white',
        maps_to_chunk: 'environment'
      },
      {
        id: 'photo_style',
        label: 'Estilo fotográfico',
        type: 'select',
        options: [
          'E-commerce clean',
          'Lifestyle TikTok',
          'Editorial de moda',
          'Campanha de luxo',
          'Foto estilo celular (UGC realista)'
        ],
        default: 'E-commerce clean',
        allow_other: true,
        maps_to_chunk: 'quality_realism'
      },
      {
        id: 'lighting',
        label: 'Iluminação',
        type: 'select',
        options: [
          'Softbox suave frontal',
          'Luz natural de janela',
          'Golden hour',
          'Luz difusa de céu nublado',
          'Luz de estúdio com contraluz suave',
          'Luz dramática lateral'
        ],
        default: 'Softbox suave frontal',
        allow_other: true,
        maps_to_chunk: 'lighting'
      },
      {
        id: 'camera_angle',
        label: 'Ângulo de câmera',
        type: 'select',
        options: ['Altura dos olhos', 'Levemente abaixo (alonga a silhueta)', 'Levemente acima', 'Lateral 3/4', 'Frontal'],
        default: 'Altura dos olhos',
        allow_other: true,
        maps_to_chunk: 'camera_lens'
      },
      {
        id: 'lens',
        label: 'Lente fotográfica',
        type: 'select',
        options: ['85mm retrato', '50mm natural', '35mm lifestyle', '100mm macro (detalhes)', '24mm amplo (ambiente)'],
        default: '85mm retrato',
        maps_to_chunk: 'camera_lens'
      }
    ]
  },
  {
    id: 'controls',
    title: '9. Controles de Qualidade e Compliance',
    fields: [
      {
        id: 'sensuality',
        label: 'Tom da imagem',
        type: 'select',
        options: ['Discreto / comercial', 'Elegante / confiante', 'Fashion editorial'],
        default: 'Elegante / confiante',
        help: 'O produto é sempre o foco principal. Nenhuma opção gera nudez ou conteúdo explícito.',
        maps_to_chunk: 'expression_vibe'
      },
      {
        id: 'face_variation',
        label: 'Variar traços faciais entre gerações',
        type: 'checkbox',
        default: true,
        help: 'Introduz micro-assimetrias para combater o aspecto artificial de "rosto de IA" genérico.',
        maps_to_chunk: 'face_details'
      },
      {
        id: 'extra_notes',
        label: 'Instruções visuais adicionais (tratadas como dados)',
        type: 'textarea',
        placeholder: 'Ex: destacar o caimento da fenda ao caminhar, evitar reflexos fortes nos botões...',
        maps_to_chunk: 'quality_realism'
      }
    ]
  }
];
