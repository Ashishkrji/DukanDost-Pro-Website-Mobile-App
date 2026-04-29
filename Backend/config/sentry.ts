import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

export const initSentry = (app: any) => {
  if (!process.env.SENTRY_DSN) {
    console.warn('[Sentry] DSN not found. Error monitoring disabled.');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, 
    profilesSampleRate: 1.0,
  });
};

export const sentryErrorHandler = (app: any) => {
  Sentry.setupExpressErrorHandler(app);
};
