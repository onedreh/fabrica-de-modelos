import { GoogleGenAI, Type } from '@google/genai';

/**
 * Gemini Service for Prompt Factory
 * Connects securely on server side using @google/genai.
 * Provides real structured output calls and deterministic simulation fallback when key is pending.
 */

const apiKey = process.env.GEMINI_API_KEY;
export const hasGeminiApiKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');

export const geminiClient = hasGeminiApiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const rawModel = (process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash').trim();
export const DEFAULT_TEXT_MODEL = rawModel.replace(/flas$/, 'flash');

/**
 * Generate intelligent deterministic chunks when API key is not yet configured.
 * Guarantees zero downtime and complete feature verification.
 */
export function generateSimulatedChunks(groupId: string, formValues: Record<string, any>): Record<string, string> {
  const age = formValues.age || '26-30';
  const ethnicity = formValues.ethnicity || 'Brasileira (miscigenada)';
  const productType = formValues.product_type || 'Roupa de moda';
  const productName = formValues.product_name || 'Peça de vestuário';
  const productColor = formValues.product_color || 'azul escuro';
  const productMaterial = formValues.product_material || 'tecido nobre';
  const productFit = formValues.product_fit || 'ajustado';
  const productDetails = formValues.product_details || 'costuras finas, acabamento refinado';
  const framing = formValues.framing || '3/4 (dos joelhos para cima)';
  const pose = formValues.pose || 'em pé, postura elegante e confiante';
  const background = formValues.background || 'estúdio clean neutro';
  const lighting = formValues.lighting || 'softbox suave frontal difusa';
  const lens = formValues.lens || '85mm retrato';
  const hair = formValues.hair || 'cabelos naturais bem cuidados';
  const makeup = formValues.makeup || 'maquiagem natural clean';
  const nails = formValues.nails || 'unhas curtas bem cuidadas';
  const skinTone = formValues.skin_tone || 'tom médio natural';
  const skinFinish = formValues.skin_finish || 'pele natural com poros visíveis';
  const bodyType = formValues.body_type || 'equilibrada';
  const expression = formValues.expression || 'olhar confiante e sereno';
  const vibe = formValues.vibe || 'sofisticada';

  switch (groupId) {
    case 'G1_identity':
      return {
        subject_core: `photorealistic photograph of an adult woman in her ${age}, Brazilian heritage with mixed ancestry, natural elegance, commercial fashion campaign`,
        face_details: `expressive almond-shaped eyes, well-defined natural brows, gentle facial bone structure, subtle natural asymmetry, authentic human beauty without generic symmetry`,
        skin_texture: `${skinTone} skin with visible micro-pores, natural texture variations, subtle dewy hydration sheen, authentic natural dermal contours and realistic tactile texture`,
        hair: `${hair}, individual flowing hair strands, delicate natural flyaways catching ambient light, realistic volume and organic texture`,
        body_posture: `${bodyType} feminine silhouette, natural proportions, elegant elongated neck, relaxed shoulders, poised and balanced commercial stance`
      };

    case 'G2_expression':
      return {
        expression_vibe: `${expression}, confident yet warm commercial gaze, authentic engaging presence, refined editorial vibe, subtle mouth expression`,
        makeup_nails_hands: `${makeup}, perfectly manicured ${nails}, hands with five fingers each, natural relaxed finger positions, correct finger length and anatomical joints gently framing the composition`
      };

    case 'G3_product':
      return {
        wardrobe_base: `minimalist neutral complementary base garments, solid muted tone, clean silhouette without intrusive graphics or competing accessories, keeping full spotlight on the featured product`,
        product_integration: `wearing featured ${productName} (${productType}) in exact rich ${productColor}, constructed from authentic ${productMaterial}, ${productFit} tailored drape hugging body contours naturally, detailed ${productDetails}, true-to-life fabric weave, precise edge stitching and realistic material tension folds across movement lines, color fidelity in ${productColor}`
      };

    case 'G4_scene':
      return {
        pose_framing: `${framing} framing showcasing the garment clearly, ${pose}, balanced weight distribution, unobstructed product visibility from primary commercial angle`,
        environment: `high-end ${background}, subtle architectural depth, minimalist aesthetic with neutral tonal harmony that accentuates the product silhouette`,
        lighting: `${lighting}, balanced color temperature, gentle fill eliminating harsh shadows, delicate rim highlight revealing fabric texture and surface sheen`,
        camera_lens: `shot on professional medium format camera, ${lens} lens at f/2.2, crisp subject isolation with soft cinematic background falloff`
      };

    case 'G5_quality':
      return {
        quality_realism: `commercial fashion catalog photography, tactile material micro-textures, photorealistic color grading, true optical depth, natural skin fidelity, award-winning studio clarity`,
        negative: `plastic skin, airbrushed skin, doll-like face, generic AI face, extra fingers, missing fingers, deformed hands, distorted fabric pattern, wrong product color, blurry, watermark, cropped product, underage, minor`
      };

    default:
      return {};
  }
}

export { Type };
