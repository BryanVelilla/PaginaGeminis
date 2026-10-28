import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  loginAsRole: (role: UserRole) => void;
  registerVisitante: (name: string, email: string) => { success: boolean; message?: string };
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isDashboardOpen: boolean;
  openDashboard: () => void;
  closeDashboard: () => void;
}

const STORAGE_KEY_AUTH = 'geminis_user_session';

export const DEMO_USERS: Record<UserRole, User> = {
  docente: {
    id: 'docente-hernando-castro',
    name: 'Dr. Hernando Castro',
    email: 'docente@cecar.edu.co',
    role: 'docente',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    program: 'Ingeniería de Sistemas // CECAR',
    institution: 'Corporación Universitaria del Caribe - CECAR',
    focusArea: 'Dirección de Investigación & Seguridad Crítica',
    badge: 'Director Semillero',
    joinedAt: '2022-01-15',
  },
  semillerista: {
    id: 'semillerista-bryan-velilla',
    name: 'Bryan Esteban Velilla Pérez',
    email: 'semillerista@cecar.edu.co',
    role: 'semillerista',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    program: 'Ingeniería de Sistemas // CECAR',
    institution: 'CECAR',
    focusArea: 'Ciberseguridad Ofensiva & Red Team',
    badge: 'Red Team Lead',
    joinedAt: '2023-03-10',
  },
  visitante: {
    id: 'visitante-carlos-mendoza',
    name: 'Carlos Mendoza',
    email: 'visitante@gmail.com',
    role: 'visitante',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    program: 'Comunidad Académica Externa',
    institution: 'Visitante Externo',
    focusArea: 'Ciberseguridad & Redes',
    badge: 'Comunidad',
    joinedAt: '2024-05-20',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error('Error cargando sesión persistida:', e);
    }
  }, []);

  const saveUserSession = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  };

  const login = (email: string, pass: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check predefined roles
    if (cleanEmail === 'docente@cecar.edu.co' && cleanPass === 'docente123') {
      saveUserSession(DEMO_USERS.docente);
      setIsLoginModalOpen(false);
      return { success: true };
    }

    if (cleanEmail === 'semillerista@cecar.edu.co' && cleanPass === 'geminis123') {
      saveUserSession(DEMO_USERS.semillerista);
      setIsLoginModalOpen(false);
      return { success: true };
    }

    if (cleanEmail === 'visitante@gmail.com' && cleanPass === 'visitante123') {
      saveUserSession(DEMO_USERS.visitante);
      setIsLoginModalOpen(false);
      return { success: true };
    }

    // Check dynamically registered semilleristas from localStorage
    try {
      const membersRaw = localStorage.getItem('geminis_registered_members');
      if (membersRaw) {
        const members = JSON.parse(membersRaw);
        const match = members.find((m: any) => m.email.toLowerCase() === cleanEmail);
        if (match) {
          if (cleanPass.length >= 4) {
            const dynamicUser: User = {
              id: match.id,
              name: match.fullName,
              email: match.email,
              role: match.role || 'semillerista',
              avatar: match.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
              program: match.program,
              institution: 'CECAR',
              focusArea: match.focusArea,
              badge: match.badge,
              joinedAt: match.createdAt || new Date().toISOString(),
            };
            saveUserSession(dynamicUser);
            setIsLoginModalOpen(false);
            return { success: true };
          } else {
            return { success: false, message: 'La contraseña debe tener al menos 4 caracteres.' };
          }
        }
      }
    } catch (e) {
      console.error('Error buscando semilleristas registrados:', e);
    }

    // Heuristics for demo convenience if user inputs domain or keyword
    if (cleanPass.length >= 4) {
      if (cleanEmail.includes('docente') || cleanEmail.includes('profesor')) {
        const customUser: User = {
          id: 'user-' + Date.now(),
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: 'docente',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          program: 'Ingeniería de Sistemas // CECAR',
          institution: 'CECAR',
          focusArea: 'Investigación Académica',
          badge: 'Docente Investigador',
          joinedAt: new Date().toISOString(),
        };
        saveUserSession(customUser);
        setIsLoginModalOpen(false);
        return { success: true };
      }

      if (cleanEmail.includes('cecar.edu.co') || cleanEmail.includes('semillerista')) {
        const customUser: User = {
          id: 'user-' + Date.now(),
          name: cleanEmail.split('@')[0].replace('.', ' ').toUpperCase(),
          email: cleanEmail,
          role: 'semillerista',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
          program: 'Ingeniería de Sistemas // CECAR',
          institution: 'CECAR',
          focusArea: 'Seguridad en Redes & Sistemas',
          badge: 'Semillerista Activo',
          joinedAt: new Date().toISOString(),
        };
        saveUserSession(customUser);
        setIsLoginModalOpen(false);
        return { success: true };
      }

      // Default role if not recognized: visitante
      const visitorUser: User = {
        id: 'user-' + Date.now(),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'visitante',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        program: 'Visitante Registrado',
        institution: 'Externo',
        focusArea: 'Interés General en Ciberseguridad',
        badge: 'Visitante',
        joinedAt: new Date().toISOString(),
      };
      saveUserSession(visitorUser);
      setIsLoginModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      message: 'Credenciales inválidas. Usa una de las cuentas demo o ingresa una contraseña de al menos 4 caracteres.',
    };
  };

  const loginAsRole = (role: UserRole) => {
    saveUserSession(DEMO_USERS[role]);
    setIsLoginModalOpen(false);
  };

  const registerVisitante = (name: string, email: string): { success: boolean; message?: string } => {
    if (!name.trim() || !email.trim()) {
      return { success: false, message: 'Por favor completa todos los campos requeridos.' };
    }

    const newUser: User = {
      id: 'vis-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'visitante',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      program: 'Comunidad Externa',
      institution: 'Visitante',
      focusArea: 'Opinión & Debate Académico',
      badge: 'Visitante Registrado',
      joinedAt: new Date().toISOString(),
    };

    saveUserSession(newUser);
    setIsLoginModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    saveUserSession(null);
    setIsDashboardOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginAsRole,
        registerVisitante,
        logout,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        isDashboardOpen,
        openDashboard: () => setIsDashboardOpen(true),
        closeDashboard: () => setIsDashboardOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
