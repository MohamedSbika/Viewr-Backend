declare namespace Express {
  export interface Request {
    cachedUser?: {
      id: string;
      email: string;
      password: string;
      is_verified: boolean;
      role: string;
      features: string[];
    };
  }
}
