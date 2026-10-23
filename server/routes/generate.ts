import { Router, Request, Response } from 'express';
import { validateAndSanitizeCompliance } from '../services/compliance';
import { runChunkGroups } from '../services/chunkRunner';
import { assemblePrompt } from '../services/assembler';
import { runLintAndQualityScore } from '../services/lint';

export const generateRouter = Router();

// In-memory rate limiting map: ip -> timestamps
const requestTimestamps = new Map<string, number[]>();
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '20', 10);
const WINDOW_MS = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const times = requestTimestamps.get(ip) || [];
  const validTimes = times.filter(t => now - t < WINDOW_MS);

  if (validTimes.length >= RATE_LIMIT_MAX) {
    requestTimestamps.set(ip, validTimes);
    return false;
  }

  validTimes.push(now);
  requestTimestamps.set(ip, validTimes);
  return true;
}

export interface PromptVariation {
  id: string;
  label: string;
  angle_description: string;
  prompt: string;
  negative_prompt: string;
  chunks: Record<string, string>;
  params: Record<string, any>;
  formatted_full_copy: string;
  word_count: number;
  quality_score: number;
  warnings: string[];
}

/**
 * Builds 3 complementary variations for fashion catalog lookbooks:
 * 1. Corpo Inteiro (Catálogo Principal)
 * 2. 3/4 Dinâmico (Movimento TikTok)
 * 3. Detalhe e Textura do Produto (Close-up)
 * All share the EXACT same model identity and product details chunks.
 */
function buildCatalogVariations(
  baseChunks: Record<string, string>,
  targetGenerator: string,
  aspectRatio: string,
  sanitizedValues: Record<string, any>
): PromptVariation[] {
  // Variation 1: Corpo Inteiro
  const v1Chunks = {
    ...baseChunks,
    pose_framing: 'full body commercial catalog framing showing head to toe, upright poised stance, clear unobstructed product silhouette, feet and hands naturally positioned'
  };
  const v1Assembled = assemblePrompt({
    chunks: v1Chunks,
    targetGenerator,
    aspectRatio,
    formValues: sanitizedValues
  });
  const v1Lint = runLintAndQualityScore(v1Assembled.prompt, v1Assembled.negative_prompt, v1Chunks, targetGenerator, sanitizedValues);

  // Variation 2: 3/4 Dinâmico TikTok
  const v2Chunks = {
    ...baseChunks,
    pose_framing: 'three-quarter commercial framing from knees up, dynamic candid walking motion with natural body twist, lively movement showcasing garment drape and fluid fabric dynamics',
    camera_lens: 'shot on 50mm f/1.8 prime lens, subtle low angle elongating the silhouette, crisp commercial focal separation with soft atmospheric bokeh'
  };
  const v2Assembled = assemblePrompt({
    chunks: v2Chunks,
    targetGenerator,
    aspectRatio,
    formValues: sanitizedValues
  });
  const v2Lint = runLintAndQualityScore(v2Assembled.prompt, v2Assembled.negative_prompt, v2Chunks, targetGenerator, sanitizedValues);

  // Variation 3: Detalhe do Produto & Close-up
  const v3Chunks = {
    ...baseChunks,
    pose_framing: 'medium close-up product detail framing emphasizing tactile fabric weave, authentic stitch seams, collar and silhouette drape while keeping graceful hand placement',
    camera_lens: 'shot on 90mm macro-portrait prime lens at f/2.5, razor-sharp focus on the textile texture and construction details with cinematic optical falloff'
  };
  const v3Assembled = assemblePrompt({
    chunks: v3Chunks,
    targetGenerator,
    aspectRatio,
    formValues: sanitizedValues
  });
  const v3Lint = runLintAndQualityScore(v3Assembled.prompt, v3Assembled.negative_prompt, v3Chunks, targetGenerator, sanitizedValues);

  return [
    {
      id: 'var_full_body',
      label: '1. Corpo Inteiro (Principal)',
      angle_description: 'Enquadramento completo da cabeça aos pés para visualização total do look e caimento.',
      prompt: v1Assembled.prompt,
      negative_prompt: v1Assembled.negative_prompt,
      chunks: v1Chunks,
      params: v1Assembled.params,
      formatted_full_copy: v1Assembled.formatted_full_copy,
      word_count: v1Assembled.word_count,
      quality_score: v1Lint.score,
      warnings: v1Lint.warnings
    },
    {
      id: 'var_three_quarter',
      label: '2. 3/4 Dinâmico (TikTok)',
      angle_description: 'Enquadramento dinâmico dos joelhos para cima com movimento orgânico da modelo.',
      prompt: v2Assembled.prompt,
      negative_prompt: v2Assembled.negative_prompt,
      chunks: v2Chunks,
      params: v2Assembled.params,
      formatted_full_copy: v2Assembled.formatted_full_copy,
      word_count: v2Assembled.word_count,
      quality_score: v2Lint.score,
      warnings: v2Lint.warnings
    },
    {
      id: 'var_detail_closeup',
      label: '3. Detalhe do Tecido (Close-up)',
      angle_description: 'Foco macro nas texturas do tecido, costuras, caimento tátil e acabamento do produto.',
      prompt: v3Assembled.prompt,
      negative_prompt: v3Assembled.negative_prompt,
      chunks: v3Chunks,
      params: v3Assembled.params,
      formatted_full_copy: v3Assembled.formatted_full_copy,
      word_count: v3Assembled.word_count,
      quality_score: v3Lint.score,
      warnings: v3Lint.warnings
    }
  ];
}

/**
 * POST /api/generate
 * Main prompt generation pipeline with support for 1 or 3 variations and locked chunks
 */
generateRouter.post('/generate', async (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown-client';

  // 1. Rate Limiting Check
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: 'Limite de requisições excedido. Por favor, aguarde um instante antes de gerar novos prompts.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }

  try {
    const { form_values = {}, profile_id = null, locked_chunks = null, options = {} } = req.body;

    // 2. Compliance and Safety Pre-flight validation
    const complianceResult = validateAndSanitizeCompliance(form_values);
    if (!complianceResult.valid) {
      return res.status(400).json({
        error: complianceResult.error,
        field: complianceResult.field,
        code: 'COMPLIANCE_ERROR',
        warnings: complianceResult.warnings
      });
    }

    const sanitizedValues = complianceResult.sanitizedValues;
    const targetGenerator = sanitizedValues.target_generator || 'flux';
    const aspectRatio = sanitizedValues.aspect_ratio || '9:16';
    const numVariations = parseInt(options.variations || sanitizedValues.variations || '1', 10);

    // 3. Parallel Chunk Execution (5 groups)
    const { chunks, groupErrors } = await runChunkGroups({
      formValues: sanitizedValues,
      lockedChunks: locked_chunks
    });

    // 4. Deterministic Assembler & Adapter
    const assembled = assemblePrompt({
      chunks,
      targetGenerator,
      aspectRatio,
      formValues: sanitizedValues
    });

    // 5. Lint Rules & Quality Score
    const lintResult = runLintAndQualityScore(
      assembled.prompt,
      assembled.negative_prompt,
      chunks,
      targetGenerator,
      sanitizedValues
    );

    const allWarnings = [
      ...complianceResult.warnings,
      ...lintResult.warnings
    ];

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Build variations if 3 requested
    let variations: PromptVariation[] | undefined = undefined;
    if (numVariations === 3) {
      variations = buildCatalogVariations(chunks, targetGenerator, aspectRatio, sanitizedValues);
    }

    return res.json({
      prompt: assembled.prompt,
      negative_prompt: assembled.negative_prompt,
      chunks,
      adapter: targetGenerator,
      aspect_ratio: aspectRatio,
      params: assembled.params,
      formatted_full_copy: assembled.formatted_full_copy,
      word_count: assembled.word_count,
      warnings: allWarnings,
      quality_score: lintResult.score,
      request_id: requestId,
      variations,
      meta: {
        profile_id,
        created_at: new Date().toISOString(),
        group_errors: Object.keys(groupErrors).length > 0 ? groupErrors : undefined
      }
    });
  } catch (error: any) {
    console.error('Erro no pipeline de geração:', error);
    return res.status(500).json({
      error: 'Ocorreu um erro inesperado ao gerar os blocos do prompt. Por favor, tente novamente.',
      details: error?.message || 'Erro interno'
    });
  }
});

/**
 * POST /api/variations
 * Generate 3 catalog variations instantly from existing chunks and settings
 */
generateRouter.post('/variations', (req: Request, res: Response) => {
  try {
    const { chunks, target_generator = 'flux', aspect_ratio = '9:16', form_values = {} } = req.body;

    if (!chunks || typeof chunks !== 'object') {
      return res.status(400).json({ error: 'Os chunks devem ser fornecidos em formato de objeto.' });
    }

    const variations = buildCatalogVariations(chunks, target_generator, aspect_ratio, form_values);

    return res.json({
      variations,
      adapter: target_generator,
      aspect_ratio: aspect_ratio
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao gerar variações a partir dos blocos atuais.' });
  }
});

/**
 * POST /api/reassemble
 * Instant client-side chunk edit or generator switch without re-calling Gemini
 */
generateRouter.post('/reassemble', (req: Request, res: Response) => {
  try {
    const { chunks, target_generator = 'flux', aspect_ratio = '9:16', form_values = {} } = req.body;

    if (!chunks || typeof chunks !== 'object') {
      return res.status(400).json({ error: 'Os chunks devem ser fornecidos em formato de objeto.' });
    }

    const assembled = assemblePrompt({
      chunks,
      targetGenerator: target_generator,
      aspectRatio: aspect_ratio,
      formValues: form_values
    });

    const lintResult = runLintAndQualityScore(
      assembled.prompt,
      assembled.negative_prompt,
      chunks,
      target_generator,
      form_values
    );

    return res.json({
      prompt: assembled.prompt,
      negative_prompt: assembled.negative_prompt,
      chunks,
      adapter: target_generator,
      aspect_ratio: aspect_ratio,
      params: assembled.params,
      formatted_full_copy: assembled.formatted_full_copy,
      word_count: assembled.word_count,
      warnings: lintResult.warnings,
      quality_score: lintResult.score
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao remontar o prompt com os novos parâmetros.' });
  }
});
