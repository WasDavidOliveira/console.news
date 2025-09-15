import { HelmetOptions } from 'helmet';

export const developmentHelmetConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginResourcePolicy: {
    policy: 'cross-origin',
  },
  hidePoweredBy: true,
  hsts: false,
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' },
  xssFilter: true,
};
