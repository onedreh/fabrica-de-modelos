import { Router, Request, Response } from 'express';

export const analyzeProductRouter = Router();

/**
 * POST /api/analyze-product (Fase 3 - Fidelidade do Produto com Imagem Try-on)
 * Estrutura preparada para receber imagens do produto e analisar via visão computacional
 */
analyzeProductRouter.post('/analyze-product', (req: Request, res: Response) => {
  return res.status(501).json({
    error: 'A análise automática de produtos por imagem chega na Fase 3.',
    phase: 'Fase 3 – Fidelidade do produto (try-on com imagem)',
    status: 'Em breve'
  });
});
