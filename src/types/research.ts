import type { UserRole } from './auth';

export interface PublicationComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  content: string;
  rating?: number; // 1-5 rating
  createdAt: string;
}

export interface AssociatedDocente {
  id: string;
  name: string;
  institution?: string;
  roleTitle?: string;
}

export interface AssociatedSemillerista {
  id: string;
  name: string;
  program?: string;
  focusArea?: string;
}

export interface Publication {
  id: string;
  title: string;
  abstract: string;
  content?: string;
  category: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  createdAt: string;
  readTime: string;
  tags: string[];
  linkUrl?: string;
  doi?: string;
  associatedDocentes: AssociatedDocente[];
  associatedSemilleristas: AssociatedSemillerista[];
  comments: PublicationComment[];
}

export interface RegisteredMember {
  id: string;
  fullName: string;
  email: string;
  program: string;
  focusArea: string;
  badge: string;
  role: 'semillerista' | 'docente';
  registeredBy?: string;
  createdAt: string;
  image?: string;
}
