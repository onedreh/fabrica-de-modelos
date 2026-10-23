export interface ModelProfile {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  avatar_color?: string;
  // Model attributes mapping to form_schema
  age_range: string;
  ethnicity: string;
  skin_tone: string;
  body_type: string;
  face_features: string;
  hair_type: string;
  hair_color: string;
  hair_length: string;
  expression_default?: string;
  // Specific locked chunks for 100% mathematical continuity
  locked_chunks?: {
    subject_core?: string;
    face_details?: string;
    skin_texture?: string;
    hair?: string;
    body_posture?: string;
  };
}

export const DEFAULT_PROFILES: ModelProfile[] = [
  {
    id: 'prof_sofia_latina',
    name: 'Sofia – Morena Brasileira (E-commerce / TikTok)',
    description: 'Aparência calorosa, traços marcantes, pele morena clara com viço natural e cabelos ondulados.',
    created_at: '2026-01-01T00:00:00.000Z',
    avatar_color: 'from-amber-500 to-orange-600',
    age_range: '26-30',
    ethnicity: 'Latina / Brasileira',
    skin_tone: 'Tom médio natural',
    body_type: 'Equilibrado / comercial',
    face_features: 'Traços harmônicos, maçãs do rosto bem definidas, sobrancelhas naturais e olhos castanhos expressivos',
    hair_type: 'Ondulado suave',
    hair_color: 'Castanho escuro iluminado',
    hair_length: 'Médio (altura do ombro)',
    expression_default: 'Sorriso leve e olhar confiante',
    locked_chunks: {
      subject_core: 'photorealistic photograph of an adult woman in her 26-30, Brazilian heritage with mixed ancestry, natural elegance, commercial fashion campaign',
      face_details: 'expressive warm brown almond-shaped eyes, well-defined natural soft brows, gentle cheekbone structure, subtle natural asymmetry, authentic human beauty',
      skin_texture: 'warm medium skin tone with visible micro-pores, natural texture variations, subtle dewy hydration sheen, authentic natural dermal contours without plastic finish',
      hair: 'healthy dark chestnut wavy hair with subtle caramel undertones, individual flowing hair strands, delicate natural flyaways catching ambient light, realistic volume',
      body_posture: 'balanced commercial female silhouette, poised natural posture, elegant neck and relaxed shoulders, confident professional presence'
    }
  },
  {
    id: 'prof_beatriz_editorial',
    name: 'Beatriz – Editorial de Moda & Luxo',
    description: 'Visual sofisticado de passarela, porte esguio, postura imponente e olhar penetrante.',
    created_at: '2026-01-01T00:00:00.000Z',
    avatar_color: 'from-emerald-500 to-teal-700',
    age_range: '26-30',
    ethnicity: 'Caucasiana / Europeia',
    skin_tone: 'Tom claro',
    body_type: 'Esguio / passarela',
    face_features: 'Mandíbula bem esculpida, lábios delineados, olhar sereno e focado, traços finos de alta costura',
    hair_type: 'Liso com movimento',
    hair_color: 'Loiro mel natural',
    hair_length: 'Longo',
    expression_default: 'Neutra elegante',
    locked_chunks: {
      subject_core: 'photorealistic photograph of an adult woman in her 26-30, European heritage, high-fashion editorial presence, luxury commercial catalog',
      face_details: 'sculpted refined jawline, soft hazel eyes, architectural cheekbones, delicate natural facial asymmetry, poised calm expression',
      skin_texture: 'fair luminous skin tone, subtle natural skin pores, delicate translucency, authentic organic skin texture, free of artificial smoothing',
      hair: 'silky honey-blonde hair parted cleanly, natural dynamic strand separation, delicate flyaways, subtle fluid motion',
      body_posture: 'slender statuesque fashion model posture, elongated neckline, relaxed dropped shoulders, confident high-end poise'
    }
  },
  {
    id: 'prof_camila_afro',
    name: 'Camila – Afro Fashion & Cachos Volumosos',
    description: 'Presença vibrante e radiante, cachos 3C/4A com volume natural espetacular e sorriso cativante.',
    created_at: '2026-01-01T00:00:00.000Z',
    avatar_color: 'from-violet-500 to-indigo-700',
    age_range: '21-25',
    ethnicity: 'Negra / Afro-brasileira',
    skin_tone: 'Tom escuro',
    body_type: 'Atlético / curvilíneo equilibrado',
    face_features: 'Olhos castanhos profundos radiantes, lábios cheios naturais, sorriso aberto e acolhedor',
    hair_type: 'Cacheado volumoso (tipo 3C/4A)',
    hair_color: 'Preto natural',
    hair_length: 'Volumoso nos ombros',
    expression_default: 'Sorriso aberto e envolvente',
    locked_chunks: {
      subject_core: 'photorealistic photograph of an adult woman in her 21-25, Afro-Brazilian heritage, vibrant radiant charisma, modern fashion catalog',
      face_details: 'luminous deep brown eyes, beautifully defined full lips, high glowing cheekbones, authentic infectious smile with natural warmth',
      skin_texture: 'rich deep melanin skin tone with radiant golden hydration glow, delicate micro-pores, natural skin specular highlights, true-to-life texture',
      hair: 'spectacular high-volume 3C/4A defined curly afro crown, individual spiral ringlets, soft natural edge texture catching ambient rim light',
      body_posture: 'fit harmonious athletic silhouette, confident upright posture, joyful dynamic body energy, engaging commercial stance'
    }
  }
];
