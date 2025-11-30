import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { calcQuote } from './services/pricing';
import scheduleRoutes from './routes/schedule';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'greenline-api' });
});

// Minimal mock auth for MVP dev
app.post('/auth/login', (req, res) => {
  const { email = 'demo@greenline.local', role = 'estimator' } = req.body || {};
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const token = jwt.sign({ sub: email, role }, secret, { expiresIn: '1h' });
  res.json({ token });
});

// Pricing endpoint
const QuoteInputSchema = z.object({
  wagePerHour: z.number().positive(),
  plantsPerHour: z.record(z.string(), z.number().positive()),
  multipliers: z.record(z.string(), z.number().positive()),
  counts: z.record(z.string(), z.number().nonnegative()),
  volumeTiers: z
    .array(z.object({ threshold: z.number().nonnegative(), discountPct: z.number().min(0).max(100) }))
    .optional()
});

app.post('/pricing/quote', (req, res) => {
  const parsed = QuoteInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });

  const input = parsed.data as any;
  // Coerce string keys to numbers for counts/plantsPerHour/multipliers
  const toNumKeyed = (rec: Record<string, number>) => Object.fromEntries(Object.entries(rec).map(([k, v]) => [Number(k), v]));
  input.counts = toNumKeyed(input.counts);
  input.plantsPerHour = toNumKeyed(input.plantsPerHour);
  input.multipliers = toNumKeyed(input.multipliers);

  const result = calcQuote(input);
  res.json(result);
});

// Schedule routes
app.use('/api/schedule', scheduleRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`greenline-api listening on http://localhost:${port}`);
});
