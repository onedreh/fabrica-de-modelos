export interface LintResult {
  passed: boolean;
  score: number;
  warnings: string[];
  metrics: {
    wordCount: number;
    hasAdultWoman: boolean;
    hasHandRule: boolean;
    hasProductColor: boolean;
    hasProductMaterial: boolean;
    prohibitedRealismTermsFound: string[];
    contradictions: string[];
  };
}

const PROHIBITED_REALISM_TERMS = [
  'smooth skin',
  'airbrushed',
  'porcelain skin',
  'perfect skin',
  'flawless face',
  'plastic skin'
];

export function runLintAndQualityScore(
  prompt: string,
  negativePrompt: string,
  chunks: Record<string, string>,
  targetGenerator: string,
  formValues: Record<string, any>
): LintResult {
  const warnings: string[] = [];
  const lowerPrompt = prompt.toLowerCase();
  const words = prompt.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  let score = 100;

  // 1. Verify adult woman requirement
  const hasAdultWoman = lowerPrompt.includes('adult woman') || lowerPrompt.includes('adult female');
  if (!hasAdultWoman) {
    warnings.push('Aviso de conformidade: O prompt deve incluir a definição explícita "adult woman".');
    score -= 20;
  }

  // 2. Prohibited realism terms check
  const prohibitedRealismTermsFound: string[] = [];
  for (const term of PROHIBITED_REALISM_TERMS) {
    if (lowerPrompt.includes(term)) {
      prohibitedRealismTermsFound.push(term);
      warnings.push(`Termo proibido de realismo detectado ("${term}"). Pode gerar aspecto plástico ou artificial na imagem.`);
      score -= 10;
    }
  }

  // 3. Hands anatomical rule check
  const hasHandRule = lowerPrompt.includes('five fingers') || lowerPrompt.includes('hands with five fingers');
  if (!hasHandRule && !lowerPrompt.includes('hands')) {
    warnings.push('Recomendação de anatomia: Adicione a regra anatômica para as mãos visíveis para evitar dedos extras.');
    score -= 5;
  }

  // 4. Product color & material fidelity
  const productColor = (formValues.product_color || '').toLowerCase().trim();
  const productMaterial = (formValues.product_material || '').toLowerCase().trim();

  let hasProductColor = true;
  if (productColor && productColor.length > 2) {
    // Check if parts of the color appear in prompt or product_integration chunk
    const colorChunk = (chunks.product_integration || '').toLowerCase();
    if (!lowerPrompt.includes(productColor) && !colorChunk.includes(productColor)) {
      hasProductColor = false;
      warnings.push(`Fidelidade de cor: A cor "${formValues.product_color}" informada no formulário deve estar destacada no produto.`);
      score -= 10;
    }
  }

  let hasProductMaterial = true;
  if (productMaterial && productMaterial.length > 2) {
    const matChunk = (chunks.product_integration || '').toLowerCase();
    if (!lowerPrompt.includes(productMaterial) && !matChunk.includes(productMaterial)) {
      hasProductMaterial = false;
      warnings.push(`Fidelidade de material: O tecido/material "${formValues.product_material}" deve ser explicitado para renderizar o caimento correto.`);
      score -= 5;
    }
  }

  // 5. Contradiction checks (simple opposing hair lengths or colors)
  const contradictions: string[] = [];
  if (lowerPrompt.includes('short hair') && lowerPrompt.includes('long hair')) {
    contradictions.push('Conflito detectado: "short hair" e "long hair"');
    warnings.push('Conflito visual: O prompt cita simultaneamente cabelo curto e longo.');
    score -= 10;
  }
  if (lowerPrompt.includes('straight hair') && lowerPrompt.includes('curly hair')) {
    contradictions.push('Conflito detectado: "straight hair" e "curly hair"');
    warnings.push('Conflito visual: O prompt cita simultaneamente cabelo liso e cacheado.');
    score -= 10;
  }

  // 6. Word count range according to generator
  const ranges: Record<string, [number, number]> = {
    flux: [120, 250],
    midjourney: [60, 160],
    sd3: [100, 220],
    ideogram: [90, 200],
    leonardo: [90, 200],
    gemini_image: [100, 230],
    generic: [140, 300]
  };

  const range = ranges[targetGenerator] || ranges.flux;
  if (wordCount < range[0]) {
    warnings.push(`Extensão: O prompt possui ${wordCount} palavras, abaixo do recomendado (${range[0]}-${range[1]}) para o gerador ${targetGenerator}.`);
    score -= 5;
  } else if (wordCount > range[1] + 30) {
    warnings.push(`Extensão: O prompt possui ${wordCount} palavras, acima do recomendado (${range[0]}-${range[1]}) para o gerador ${targetGenerator}.`);
    score -= 5;
  }

  // 7. Negative prompt check
  if (!negativePrompt || negativePrompt.trim().length < 20) {
    warnings.push('Negative prompt está ausente ou muito curto.');
    score -= 10;
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    passed: warnings.length === 0,
    score: finalScore,
    warnings,
    metrics: {
      wordCount,
      hasAdultWoman,
      hasHandRule,
      hasProductColor,
      hasProductMaterial,
      prohibitedRealismTermsFound,
      contradictions
    }
  };
}
