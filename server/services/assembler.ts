import { adapters, AdapterResult } from './adapters';
import negativesConfig from '../config/negatives.json';

export interface AssemblerOptions {
  chunks: Record<string, string>;
  targetGenerator: string;
  aspectRatio: string;
  formValues: Record<string, any>;
}

export function assemblePrompt(options: AssemblerOptions): AdapterResult {
  const { chunks, targetGenerator, aspectRatio, formValues } = options;

  // Build baseline negative prompt
  const baseNegatives = [
    ...negativesConfig.base,
    ...negativesConfig.hands,
    ...negativesConfig.product_fidelity,
    ...negativesConfig.clothing_clutter,
    ...negativesConfig.safety
  ];

  // Append user-avoid terms if any
  if (formValues.avoid && typeof formValues.avoid === 'string') {
    const userAvoid = formValues.avoid
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
    baseNegatives.push(...userAvoid);
  }

  const baseNegativeString = Array.from(new Set(baseNegatives)).join(', ');

  const adapterKey = (targetGenerator || 'flux').toLowerCase().replace('-', '_');
  const selectedAdapter = adapters[adapterKey] || adapters.flux;

  return selectedAdapter({
    chunks,
    aspect_ratio: aspectRatio || '9:16',
    form_values: formValues,
    base_negative: baseNegativeString
  });
}
