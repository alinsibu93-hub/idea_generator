import { Router } from 'express';
import { AppError } from '../lib/AppError';
import { asyncRoute } from '../lib/asyncRoute';
import { buildSavedIdea, generateIdeaDraft } from '../services/ideaService';
import { sessionStore } from '../services/sessionStore';
import { VALID_CATEGORIES } from '../types';

const router = Router();

router.post(
  '/generate',
  asyncRoute(async (req, res) => {
    const { category, preferences } = req.body;

    if (!VALID_CATEGORIES.includes(category)) {
      throw new AppError(400, `category must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }
    if (!Array.isArray(preferences) || preferences.length === 0) {
      throw new AppError(400, 'preferences must be a non-empty array');
    }
    if (preferences.some((p) => typeof p !== 'string' || !p.trim())) {
      throw new AppError(400, 'each preference must be a non-empty string');
    }

    const idea = await generateIdeaDraft(category, preferences);
    return res.status(201).json({ idea });
  })
);

router.get(
  '/',
  asyncRoute(async (_req, res) => {
    return res.json({ ideas: sessionStore.getAllIdeas() });
  })
);

router.post(
  '/',
  asyncRoute(async (req, res) => {
    const { sessionId, rating } = req.body;

    if (!sessionId || typeof sessionId !== 'string') {
      throw new AppError(400, 'sessionId is required');
    }
    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      throw new AppError(400, 'rating must be a number between 1 and 5');
    }

    const session = sessionStore.getSession(sessionId);
    if (!session) throw new AppError(404, 'Session not found');

    const savedIdea = buildSavedIdea(session, rating);
    sessionStore.saveIdea(savedIdea);

    return res.status(201).json({ idea: savedIdea });
  })
);

router.patch(
  '/:id/rating',
  asyncRoute(async (req, res) => {
    const { rating } = req.body;

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      throw new AppError(400, 'rating must be a number between 1 and 5');
    }

    const updated = sessionStore.updateRating(req.params.id, rating);
    if (!updated) throw new AppError(404, 'Idea not found');

    return res.json({ idea: updated });
  })
);

export default router;
