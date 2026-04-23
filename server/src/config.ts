import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

export const config = {
  anthropicApiKey: required('ANTHROPIC_API_KEY'),
  port: Number(process.env.PORT ?? 3001),
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  claudeModel: 'claude-sonnet-4-6' as const,
  isDevelopment: process.env.NODE_ENV !== 'production',
} as const;
