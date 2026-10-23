import { Router, Request, Response } from 'express';
import { geminiClient, DEFAULT_TEXT_MODEL, generateSimulatedChunks } from '../services/gemini';
import { assemblePrompt } from '../services/assembler';
import { runLintAndQualityScore } from '../services/lint';
import { validateAndSanitizeCompliance } from '../services/compliance';

export const refineRouter = Router();

/**
 * POST /api/refine
 * Fase 2: Refinamento de prompt existente por linguagem natural
 * Identifica os chunks afetados, atualiza-os preservando chunks travados,
 * remonta com o adaptador e relinta o resultado.
 */
refineRouter.post('/refine', async (req: Request, res: Response) => {
  try {
    const {
      chunks = {},
      instruction = '',
      target_generator = 'flux',
      aspect_ratio = '9:16',
      locked_chunks = [],
      form_values = {}
    } = req.body;

    if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
      return res.status(400).json({
        error: 'Por favor, informe a instrução de refinamento desejada.',
        code: 'MISSING_INSTRUCTION'
      });
    }

    // 1. Compliance pre-check on the refinement instruction
    const complianceCheck = validateAndSanitizeCompliance({
      ...form_values,
      refine_instruction: instruction
    });

    if (!complianceCheck.valid) {
      return res.status(400).json({
        error: complianceCheck.error,
        code: 'COMPLIANCE_ERROR',
        warnings: complianceCheck.warnings
      });
    }

    const lowerInst = instruction.toLowerCase();
    const updatedChunks: Record<string, string> = { ...chunks };
    const lockedSet = new Set(Array.isArray(locked_chunks) ? locked_chunks : Object.keys(locked_chunks || {}));

    let appliedViaGemini = false;

    // 2. Try Gemini structured refinement if client is available
    if (geminiClient && process.env.GEMINI_API_KEY) {
      try {
        const promptSystem = `You are an expert AI prompt engineer for fashion e-commerce catalog photography.
You have an existing set of photorealistic prompt chunks describing an adult female model (21+) and a product.
The user wants to make a specific modification: "${instruction}".
Modify ONLY the chunks that need to change according to the instruction.
NEVER modify any locked chunks: ${Array.from(lockedSet).join(', ') || 'none'}.
Always ensure the model remains an adult woman (21+), natural human skin, authentic texture, correct five-fingered hands, and no plastic skin.
Return a valid JSON object where keys are the chunk IDs and values are the refined descriptive strings in English.`;

        const response = await Promise.race([
          geminiClient.models.generateContent({
            model: DEFAULT_TEXT_MODEL,
            contents: [
              {
                role: 'user',
                parts: [
                  { text: promptSystem },
                  { text: `CURRENT CHUNKS JSON:\n${JSON.stringify(chunks, null, 2)}` }
                ]
              }
            ],
            config: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout da API')), 6000))
        ]);

        const rawText = response.text || '';
        const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(cleaned);

        if (parsed && typeof parsed === 'object') {
          for (const [k, v] of Object.entries(parsed)) {
            // Do not overwrite locked chunks
            if (!lockedSet.has(k) && typeof v === 'string' && v.trim()) {
              updatedChunks[k] = v.trim();
            }
          }
          appliedViaGemini = true;
        }
      } catch (geminiErr) {
        // Fall back to deterministic semantic refinement below
        console.warn('Gemini refine fallback acionado:', (geminiErr as Error)?.message || geminiErr);
      }
    }

    // 3. Deterministic semantic refinement engine (fallback or offline)
    if (!appliedViaGemini) {
      // Lighting adjustments
      if (lowerInst.includes('luz') || lowerInst.includes('ilumina') || lowerInst.includes('luz dourada') || lowerInst.includes('golden hour') || lowerInst.includes('pôr do sol') || lowerInst.includes('sunset')) {
        if (!lockedSet.has('lighting')) {
          if (lowerInst.includes('dourad') || lowerInst.includes('golden') || lowerInst.includes('pôr do sol') || lowerInst.includes('sunset')) {
            updatedChunks.lighting = 'warm golden hour sunlight, low sun angle casting soft golden rim illumination, gentle warm flares, flattering natural color temperature';
          } else if (lowerInst.includes('suave') || lowerInst.includes('difusa')) {
            updatedChunks.lighting = 'ultra-soft diffused studio lighting, large octabox softbox overhead, shadowless flattering exposure, high clarity tactile sheen';
          } else if (lowerInst.includes('dramátic') || lowerInst.includes('lateral')) {
            updatedChunks.lighting = 'dramatic high-contrast lateral key light, deliberate soft chiaroscuro shadows defining garment structure, editorial mood';
          } else {
            updatedChunks.lighting = `refined atmospheric lighting tuned for ${instruction}, soft rim highlights and balanced exposure`;
          }
        }
      }

      // Environment / Background adjustments
      if (lowerInst.includes('cenário') || lowerInst.includes('fundo') || lowerInst.includes('rua') || lowerInst.includes('café') || lowerInst.includes('praia') || lowerInst.includes('loft') || lowerInst.includes('quarto') || lowerInst.includes('estúdio')) {
        if (!lockedSet.has('environment')) {
          if (lowerInst.includes('café') || lowerInst.includes('cafeteria')) {
            updatedChunks.environment = 'chic contemporary urban coffee shop background, marble tabletops, warm ambient café glow, blurred architectural background';
          } else if (lowerInst.includes('rua') || lowerInst.includes('cidade') || lowerInst.includes('urbano')) {
            updatedChunks.environment = 'sunlit European metropolitan avenue, neutral limestone architecture, soft pedestrian motion bokeh, high-end lifestyle ambience';
          } else if (lowerInst.includes('praia') || lowerInst.includes('litoral')) {
            updatedChunks.environment = 'minimalist coastal seaside setting, soft neutral sand dunes, subtle sea breeze horizon, understated editorial resort atmosphere';
          } else if (lowerInst.includes('estúdio') || lowerInst.includes('clean')) {
            updatedChunks.environment = 'pristine minimalist studio cyclorama, subtle gradient tone, immaculate neutral backdrop focusing 100% on product';
          } else {
            updatedChunks.environment = `carefully curated fashion setting with ${instruction}, natural atmospheric depth and non-distracting background`;
          }
        }
      }

      // Pose & Framing adjustments
      if (lowerInst.includes('pose') || lowerInst.includes('caminhando') || lowerInst.includes('movimento') || lowerInst.includes('sentada') || lowerInst.includes('enquadramento') || lowerInst.includes('corpo inteiro') || lowerInst.includes('close')) {
        if (!lockedSet.has('pose_framing')) {
          if (lowerInst.includes('caminhando') || lowerInst.includes('movimento')) {
            updatedChunks.pose_framing = 'candid walking pose with natural fluid body movement, relaxed confident stride, gentle motion dynamics in the garment fabric';
          } else if (lowerInst.includes('sentada')) {
            updatedChunks.pose_framing = 'gracefully seated in a sleek designer chair, poised upright posture, legs elegantly positioned to showcase product drape';
          } else if (lowerInst.includes('close') || lowerInst.includes('detalhe')) {
            updatedChunks.pose_framing = 'intimate medium close-up framing highlighting intricate product craftsmanship, delicate hand positioning with natural fingers';
          } else {
            updatedChunks.pose_framing = `poised commercial posture adapted for ${instruction}, elegant natural balance and clear product visibility`;
          }
        }
      }

      // Expression adjustments
      if (lowerInst.includes('sorriso') || lowerInst.includes('sorrir') || lowerInst.includes('olhar') || lowerInst.includes('expressão') || lowerInst.includes('serena') || lowerInst.includes('confiante')) {
        if (!lockedSet.has('expression_vibe')) {
          if (lowerInst.includes('sorriso') || lowerInst.includes('sorridente')) {
            updatedChunks.expression_vibe = 'warm engaging smile, soft laughter lines around eyes, approachable and joyful commercial charisma';
          } else if (lowerInst.includes('confiante') || lowerInst.includes('poderosa')) {
            updatedChunks.expression_vibe = 'intense confident gaze directly at lens, relaxed self-assured lips, high-fashion editorial aura';
          } else {
            updatedChunks.expression_vibe = `serene authentic facial expression reflecting ${instruction}, natural eye contact and relaxed mouth`;
          }
        }
      }

      // Accessories & Product details
      if (lowerInst.includes('óculos') || lowerInst.includes('bolsa') || lowerInst.includes('joia') || lowerInst.includes('colar') || lowerInst.includes('brinco') || lowerInst.includes('sapato') || lowerInst.includes('cinto')) {
        if (!lockedSet.has('wardrobe_base') && !lockedSet.has('product_integration')) {
          const currentIntegration = updatedChunks.product_integration || '';
          if (!currentIntegration.toLowerCase().includes(lowerInst)) {
            updatedChunks.product_integration = `${currentIntegration}, paired with tasteful subtle ${instruction} that complements without overpowering the featured garment`;
          }
        }
      }

      // Camera lens adjustments
      if (lowerInst.includes('lente') || lowerInst.includes('50mm') || lowerInst.includes('35mm') || lowerInst.includes('85mm') || lowerInst.includes('macro') || lowerInst.includes('bokeh')) {
        if (!lockedSet.has('camera_lens')) {
          if (lowerInst.includes('macro')) {
            updatedChunks.camera_lens = 'shot on 100mm macro prime lens at f/2.8, extreme optical texture fidelity with creamy cinematic depth of field falloff';
          } else if (lowerInst.includes('35mm') || lowerInst.includes('aberta')) {
            updatedChunks.camera_lens = 'shot on 35mm f/1.8 documentary prime lens, authentic environmental perspective with rich subject separation';
          } else {
            updatedChunks.camera_lens = 'shot on 85mm portrait telephoto at f/2.0, razor-sharp focus on the subject with dreamy soft bokeh background';
          }
        }
      }
    }

    // 4. Assemble prompt with generator adapter
    const assembled = assemblePrompt({
      chunks: updatedChunks,
      targetGenerator: target_generator,
      aspectRatio: aspect_ratio,
      formValues: { ...form_values, refine_applied: true }
    });

    // 5. Lint & Quality Score
    const lintResult = runLintAndQualityScore(
      assembled.prompt,
      assembled.negative_prompt,
      updatedChunks,
      target_generator,
      form_values
    );

    return res.json({
      prompt: assembled.prompt,
      negative_prompt: assembled.negative_prompt,
      chunks: updatedChunks,
      adapter: target_generator,
      aspect_ratio: aspect_ratio,
      params: assembled.params,
      formatted_full_copy: assembled.formatted_full_copy,
      word_count: assembled.word_count,
      warnings: lintResult.warnings,
      quality_score: lintResult.score,
      instruction_applied: instruction,
      refinement_id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    });
  } catch (error: any) {
    console.error('Erro na rota /api/refine:', error);
    return res.status(500).json({
      error: 'Não foi possível aplicar o refinamento com IA. Por favor, tente novamente.',
      details: error?.message || 'Erro interno'
    });
  }
});
