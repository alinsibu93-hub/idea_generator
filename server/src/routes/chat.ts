import { Router } from 'express';
import { AppError } from '../lib/AppError';
import { asyncRoute } from '../lib/asyncRoute';
import { advanceConversation, openSession, synthesizeSummary } from '../services/conversationEngine';
import { sessionStore } from '../services/sessionStore';
import type { IdeaDraft } from '../types';

const router = Router();

router.post(
  '/sessions',
  asyncRoute(async (req, res) => {
    const { idea } = req.body as { idea: IdeaDraft };

    if (!idea?.id || !idea?.title || !idea?.category) {
      throw new AppError(400, 'A valid idea object is required');
    }

    const session = await openSession(idea);
    sessionStore.upsertSession(session);

    return res.status(201).json({ session });
  })
);

router.get(
  '/sessions/:id',
  asyncRoute(async (req, res) => {
    const session = sessionStore.getSession(req.params.id);
    if (!session) throw new AppError(404, 'Session not found');
    return res.json({ session });
  })
);

router.post(
  '/sessions/:id/messages',
  asyncRoute(async (req, res) => {
    const text = req.body.message?.trim();

    if (!text || typeof text !== 'string') {
      throw new AppError(400, 'message must be a non-empty string');
    }

    const session = sessionStore.getSession(req.params.id);
    if (!session) throw new AppError(404, 'Session not found');
    if (session.isComplete) throw new AppError(400, 'This session is already complete');

    const turn = await advanceConversation(session, text);

    // Apply the turn to the session and persist — service is non-mutating.
    session.messages.push(turn.userMessage, turn.botMessage);
    session.phase = turn.phase;
    session.isComplete = turn.isComplete;
    sessionStore.upsertSession(session);

    return res.json({
      userMessage: turn.userMessage,
      botMessage: turn.botMessage,
      phase: turn.phase,
      isComplete: turn.isComplete,
    });
  })
);

router.post(
  '/sessions/:id/summary',
  asyncRoute(async (req, res) => {
    const session = sessionStore.getSession(req.params.id);
    if (!session) throw new AppError(404, 'Session not found');

    if (session.messages.length < 4) {
      throw new AppError(400, 'Not enough conversation to generate a meaningful summary');
    }

    const summary = await synthesizeSummary(session);
    session.summary = summary;
    sessionStore.upsertSession(session);

    return res.json({ summary });
  })
);

export default router;
