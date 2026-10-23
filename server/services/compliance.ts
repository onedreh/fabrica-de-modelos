/**
 * Compliance & Safety Validator
 * Permite a cor "nude" e termos de moda comercial.
 * Converte restrições excessivas em avisos amigáveis, mantendo a geração funcional.
 */

export interface ComplianceValidationResult {
  valid: boolean;
  error?: string;
  field?: string;
  warnings: string[];
  sanitizedValues: Record<string, any>;
}

// Termos estritos de menores de idade (único bloqueio impeditivo 21+)
const MINOR_KEYWORDS = [
  'menor de idade',
  'menores de idade',
  'criança',
  'crianca',
  'infantil',
  'colegial',
  'underage',
  'schoolgirl',
  'school student',
  'baby',
  'toddler'
];

// Termos explícitos (apenas avisos de moderação, não bloqueiam a geração comercial)
const SENSITIVE_KEYWORDS = [
  'nudez explícita',
  'nudez explicita',
  'naked',
  'topless',
  'bottomless',
  'porn',
  'porno',
  'nsfw',
  'sem roupa',
  'despida',
  'genitália',
  'genitalia'
];

// Celebridades (sanitizadas com aviso, sem travar o usuário)
const CELEBRITY_KEYWORDS = [
  'anitta',
  'gisele bündchen',
  'gisele bundchen',
  'bruna marquezine',
  'marina ruy barbosa',
  'virginia fonseca',
  'kim kardashian',
  'kendall jenner',
  'kylie jenner',
  'bella hadid',
  'gigi hadid',
  'taylor swift',
  'beyonce',
  'beyoncé',
  'rihanna',
  'zendaya',
  'sabrina sato',
  'juliette',
  'paolla oliveira'
];

// Padrões de injeção de prompt (neutralizados como dados)
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous\s+)?instructions/i,
  /ignore\s+(as\s+)?(regras|instruções|instrucoes)/i,
  /system\s+prompt/i,
  /reveal\s+(your\s+)?prompt/i,
  /mostre\s+(seu\s+)?prompt/i,
  /jailbreak/i,
  /bypass\s+safety/i,
  /burle\s+as\s+regras/i,
  /you\s+are\s+now\s+a/i,
  /desconsidere\s+as\s+regras/i
];

export function validateAndSanitizeCompliance(formValues: Record<string, any>): ComplianceValidationResult {
  const warnings: string[] = [];
  const sanitizedValues: Record<string, any> = { ...formValues };

  // 1. Idade: Validação da faixa etária (obrigatório 21+)
  const age = String(formValues.age || '26-30').trim();
  const validAgeRanges = ['21-25', '26-30', '31-35', '36-45', '46-55', '56+'];

  if (!validAgeRanges.includes(age)) {
    const matchNumber = age.match(/\d+/);
    if (matchNumber && parseInt(matchNumber[0], 10) < 21) {
      return {
        valid: false,
        error: 'Conformidade 21+: A modelo deve ser uma mulher adulta a partir de 21 anos. Por favor, selecione uma faixa etária a partir de 21.',
        field: 'age',
        warnings,
        sanitizedValues
      };
    }
  }

  // 2. Análise dos campos de texto
  for (const [key, rawValue] of Object.entries(formValues)) {
    if (typeof rawValue !== 'string') continue;
    const value = rawValue.trim();
    const lower = value.toLowerCase();

    // Bloqueio apenas para menores de idade explícitos
    for (const keyword of MINOR_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lower)) {
        return {
          valid: false,
          error: `Conformidade de Segurança: O termo "${keyword}" foi identificado no campo "${key}". O app opera exclusivamente com modelos adultas (21+).`,
          field: key,
          warnings,
          sanitizedValues
        };
      }
    }

    // Termos de conotação sensual/nudez: emitir AVISO informativo sem impedir a geração
    for (const keyword of SENSITIVE_KEYWORDS) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lower)) {
        warnings.push(`Aviso de Moderação: O termo "${keyword}" no campo "${key}" foi adaptado para garantir foco no produto de e-commerce e evitar bloqueios nas plataformas.`);
        sanitizedValues[key] = value.replace(regex, 'look comercial discreto');
      }
    }

    // Celebridades: emitir aviso e substituir suavemente por "modelo fictícia" sem quebrar
    for (const celeb of CELEBRITY_KEYWORDS) {
      if (lower.includes(celeb)) {
        warnings.push(`Aviso de Direitos de Imagem: O nome "${celeb}" foi adaptado para "modelo fictícia elegante", garantindo originalidade.`);
        const regex = new RegExp(celeb, 'gi');
        sanitizedValues[key] = sanitizedValues[key].replace(regex, 'modelo fictícia');
      }
    }

    // Sanitização anti-injeção de prompt (mantém como dado e avisa)
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(value)) {
        sanitizedValues[key] = sanitizedValues[key].replace(pattern, '[especificação descritiva]');
        warnings.push(`Comando de sistema neutralizado no campo "${key}". Os campos são tratados como dados visuais da peça.`);
      }
    }

    // Limites de tamanho de caracteres
    const maxLength = key === 'product_details' || key === 'extra_notes' || key === 'complement_notes' ? 1500 : 500;
    if (value.length > maxLength) {
      sanitizedValues[key] = value.slice(0, maxLength);
      warnings.push(`O campo "${key}" foi ajustado ao limite de ${maxLength} caracteres.`);
    }
  }

  // 3. Aviso amigável para categorias de moda íntima / praia
  const productType = String(formValues.product_type || '').toLowerCase();
  if (productType.includes('lingerie') || productType.includes('praia') || productType.includes('íntimo')) {
    warnings.push('Dica TikTok Shop: Produtos íntimos ou moda praia utilizam iluminação e enquadramento comerciais para manter conformidade com as diretrizes de catálogo.');
  }

  return {
    valid: true,
    warnings,
    sanitizedValues
  };
}
