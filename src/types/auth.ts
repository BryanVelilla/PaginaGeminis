export type UserRole = 'visitante' | 'semillerista' | 'docente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  program?: string;
  institution?: string;
  focusArea?: string;
  badge?: string;
  joinedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
