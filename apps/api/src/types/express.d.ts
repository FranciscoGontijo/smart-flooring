declare global {
  namespace Express {
    interface Request {
      /** Set by the request-id middleware; goes in the logs and in error responses. */
      requestId: string;
    }
  }
}

export {};
