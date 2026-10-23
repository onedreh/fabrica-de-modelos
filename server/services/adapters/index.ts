export interface AdapterResult {
  prompt: string;
  negative_prompt: string;
  params: Record<string, any>;
  formatted_full_copy: string;
  word_count: number;
}

export interface AdapterInput {
  chunks: Record<string, string>;
  aspect_ratio: string;
  form_values: Record<string, any>;
  base_negative: string;
}

export type AdapterFn = (input: AdapterInput) => AdapterResult;

/**
 * Midjourney Adapter: Comma-separated, dense, --ar and --no params
 */
export const midjourneyAdapter: AdapterFn = ({ chunks, aspect_ratio, base_negative }) => {
  // Ordered sequence of keys
  const keys = [
    'subject_core',
    'face_details',
    'skin_texture',
    'hair',
    'body_posture',
    'expression_vibe',
    'makeup_nails_hands',
    'wardrobe_base',
    'product_integration',
    'pose_framing',
    'environment',
    'lighting',
    'camera_lens',
    'quality_realism'
  ];

  const terms: string[] = [];
  for (const k of keys) {
    if (chunks[k]) {
      terms.push(chunks[k].trim().replace(/\.$/, ''));
    }
  }

  const prompt = terms.join(', ');
  const words = prompt.split(/\s+/).filter(Boolean);

  // Filter top ~12 negative terms for --no flag
  const rawNeg = (chunks.negative || base_negative)
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  const uniqueNeg = Array.from(new Set(rawNeg)).slice(0, 14).join(', ');
  const mjNoParam = uniqueNeg.replace(/,\s*/g, ' ');

  const params = {
    '--ar': aspect_ratio,
    '--style': 'raw',
    '--v': '6.1',
    '--no': mjNoParam
  };

  const formatted_full_copy = `${prompt} --ar ${aspect_ratio} --style raw --v 6.1 --no ${mjNoParam}`;

  return {
    prompt,
    negative_prompt: uniqueNeg,
    params,
    formatted_full_copy,
    word_count: words.length
  };
};

/**
 * Flux Adapter: Flowing natural prose, positive anatomical reinforcement
 */
export const fluxAdapter: AdapterFn = ({ chunks, aspect_ratio, base_negative }) => {
  const parts = [
    chunks.subject_core,
    chunks.face_details,
    chunks.skin_texture,
    chunks.hair,
    chunks.body_posture,
    chunks.expression_vibe,
    chunks.makeup_nails_hands,
    chunks.wardrobe_base,
    chunks.product_integration,
    chunks.pose_framing,
    chunks.environment,
    chunks.lighting,
    chunks.camera_lens,
    chunks.quality_realism
  ].filter(Boolean);

  // In Flux, sentences form fluid natural descriptive prose
  const prompt = parts
    .map(p => p.trim().replace(/\.$/, ''))
    .join('. ') + '.';

  const negative_prompt = chunks.negative || base_negative;
  const words = prompt.split(/\s+/).filter(Boolean);

  const params = {
    aspect_ratio,
    recommended_guidance: '3.0 - 3.5',
    recommended_steps: '28 - 35',
    note: 'O Flux utiliza prioritariamente descrições em prosa natural. Restrições foram inseridas afirmativamente no prompt.'
  };

  const formatted_full_copy = `[PROMPT]\n${prompt}\n\n[PROPORÇÃO]: ${aspect_ratio}\n[NEGATIVE OPCIONAL]:\n${negative_prompt}`;

  return {
    prompt,
    negative_prompt,
    params,
    formatted_full_copy,
    word_count: words.length
  };
};

/**
 * Stable Diffusion 3 Adapter: Hybrid phrases with resolution dimensions
 */
export const sd3Adapter: AdapterFn = ({ chunks, aspect_ratio, base_negative }) => {
  const dimensionsMap: Record<string, { width: number; height: number }> = {
    '9:16': { width: 832, height: 1472 },
    '4:5': { width: 896, height: 1120 },
    '1:1': { width: 1024, height: 1024 },
    '3:4': { width: 896, height: 1184 },
    '16:9': { width: 1472, height: 832 }
  };

  const dim = dimensionsMap[aspect_ratio] || { width: 832, height: 1472 };

  const parts = [
    chunks.subject_core,
    chunks.product_integration,
    chunks.pose_framing,
    chunks.face_details,
    chunks.skin_texture,
    chunks.hair,
    chunks.body_posture,
    chunks.expression_vibe,
    chunks.makeup_nails_hands,
    chunks.wardrobe_base,
    chunks.environment,
    chunks.lighting,
    chunks.camera_lens,
    chunks.quality_realism
  ].filter(Boolean);

  const prompt = parts.map(p => p.trim().replace(/\.$/, '')).join(', ') + '.';
  const negative_prompt = chunks.negative || base_negative;
  const words = prompt.split(/\s+/).filter(Boolean);

  const params = {
    width: dim.width,
    height: dim.height,
    aspect_ratio,
    cfg_scale: 4.5,
    steps: 30
  };

  const formatted_full_copy = `Positive Prompt:\n${prompt}\n\nNegative Prompt:\n${negative_prompt}\n\nResolution: ${dim.width}x${dim.height} (Aspect ${aspect_ratio})`;

  return {
    prompt,
    negative_prompt,
    params,
    formatted_full_copy,
    word_count: words.length
  };
};

/**
 * Ideogram Adapter: Clean natural prose, typography avoidance
 */
export const ideogramAdapter: AdapterFn = ({ chunks, aspect_ratio, base_negative }) => {
  const parts = [
    chunks.subject_core,
    chunks.face_details,
    chunks.skin_texture,
    chunks.hair,
    chunks.expression_vibe,
    chunks.product_integration,
    chunks.wardrobe_base,
    chunks.pose_framing,
    chunks.environment,
    chunks.lighting,
    chunks.camera_lens,
    chunks.quality_realism
  ].filter(Boolean);

  const prompt = parts.map(p => p.trim().replace(/\.$/, '')).join('. ') + '.';
  const negative_prompt = chunks.negative || base_negative;
  const words = prompt.split(/\s+/).filter(Boolean);

  const params = {
    aspect_ratio,
    style_type: 'REALISTIC',
    magic_prompt: 'OFF or MINIMAL (o prompt já está hiper-especificado)'
  };

  const formatted_full_copy = `Prompt:\n${prompt}\n\nAspect Ratio: ${aspect_ratio}\nNegative (se suportado):\n${negative_prompt}`;

  return {
    prompt,
    negative_prompt,
    params,
    formatted_full_copy,
    word_count: words.length
  };
};

/**
 * Leonardo AI Adapter: Technical photo keywords and separate negative
 */
export const leonardoAdapter: AdapterFn = ({ chunks, aspect_ratio, base_negative }) => {
  const parts = [
    chunks.subject_core,
    chunks.face_details,
    chunks.skin_texture,
    chunks.hair,
    chunks.body_posture,
    chunks.product_integration,
    chunks.makeup_nails_hands,
    chunks.pose_framing,
    chunks.environment,
    chunks.lighting,
    chunks.camera_lens,
    chunks.quality_realism
  ].filter(Boolean);

  const prompt = parts.map(p => p.trim().replace(/\.$/, '')).join(', ') + '.';
  const negative_prompt = chunks.negative || base_negative;
  const words = prompt.split(/\s+/).filter(Boolean);

  const params = {
    aspect_ratio,
    preset: 'PhotoReal / Kino XL',
    alchemy: 'ON',
    photoreal_depth: 'High'
  };

  const formatted_full_copy = `Prompt:\n${prompt}\n\nNegative Prompt:\n${negative_prompt}\n\nAspect: ${aspect_ratio}`;

  return {
    prompt,
    negative_prompt,
    params,
    formatted_full_copy,
    word_count: words.length
  };
};

/**
 * Gemini Image Adapter: Direct descriptive image instruction
 */
export const geminiImageAdapter: AdapterFn = ({ chunks, aspect_ratio, base_negative }) => {
  const parts = [
    'A high-end commercial fashion photograph of an adult woman',
    chunks.subject_core,
    chunks.face_details,
    chunks.skin_texture,
    chunks.hair,
    chunks.body_posture,
    chunks.product_integration,
    chunks.wardrobe_base,
    chunks.pose_framing,
    chunks.environment,
    chunks.lighting,
    chunks.camera_lens,
    chunks.quality_realism
  ].filter(Boolean);

  const prompt = parts.map(p => p.trim().replace(/\.$/, '')).join('. ') + '.';
  const negative_prompt = chunks.negative || base_negative;
  const words = prompt.split(/\s+/).filter(Boolean);

  const params = {
    aspect_ratio,
    model: 'gemini-3.1-flash-lite-image ou nano-banana'
  };

  const formatted_full_copy = `Prompt:\n${prompt}\n\nAspect Ratio: ${aspect_ratio}`;

  return {
    prompt,
    negative_prompt,
    params,
    formatted_full_copy,
    word_count: words.length
  };
};

/**
 * Generic Adapter: Universal rich prompt
 */
export const genericAdapter: AdapterFn = ({ chunks, aspect_ratio, base_negative }) => {
  const parts = [
    chunks.subject_core,
    chunks.face_details,
    chunks.skin_texture,
    chunks.hair,
    chunks.body_posture,
    chunks.expression_vibe,
    chunks.makeup_nails_hands,
    chunks.wardrobe_base,
    chunks.product_integration,
    chunks.pose_framing,
    chunks.environment,
    chunks.lighting,
    chunks.camera_lens,
    chunks.quality_realism
  ].filter(Boolean);

  const prompt = parts.map(p => p.trim().replace(/\.$/, '')).join(', ') + '.';
  const negative_prompt = chunks.negative || base_negative;
  const words = prompt.split(/\s+/).filter(Boolean);

  const params = {
    aspect_ratio,
    format: 'Standard universal composition'
  };

  const formatted_full_copy = `PROMPT:\n${prompt}\n\nNEGATIVE PROMPT:\n${negative_prompt}\n\nPROPORÇÃO: ${aspect_ratio}`;

  return {
    prompt,
    negative_prompt,
    params,
    formatted_full_copy,
    word_count: words.length
  };
};

export const adapters: Record<string, AdapterFn> = {
  flux: fluxAdapter,
  midjourney: midjourneyAdapter,
  sd3: sd3Adapter,
  ideogram: ideogramAdapter,
  leonardo: leonardoAdapter,
  gemini_image: geminiImageAdapter,
  generic: genericAdapter
};
