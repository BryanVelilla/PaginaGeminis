import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Publication, PublicationComment, RegisteredMember, AssociatedDocente, AssociatedSemillerista } from '../types/research';
import { useAuth } from './AuthContext';

interface ResearchContextType {
  publications: Publication[];
  members: RegisteredMember[];
  docentes: AssociatedDocente[];
  activePublication: Publication | null;
  setActivePublication: (pub: Publication | null) => void;
  addPublication: (data: Omit<Publication, 'id' | 'createdAt' | 'comments'>) => { success: boolean; message?: string };
  addComment: (publicationId: string, content: string, rating?: number) => { success: boolean; message?: string };
  registerSemillerista: (memberData: Omit<RegisteredMember, 'id' | 'createdAt' | 'role'>) => { success: boolean; message?: string };
}

const STORAGE_KEY_PUBS = 'geminis_publications_v1';
const STORAGE_KEY_MEMBERS = 'geminis_registered_members';

const INITIAL_DOCENTES: AssociatedDocente[] = [
  {
    id: 'docente-hernando-castro',
    name: 'Dr. Hernando Castro',
    institution: 'CECAR - Fac. de Ciencias Básicas e Ingenierías',
    roleTitle: 'Director de Línea de Investigación en Ciberseguridad',
  },
  {
    id: 'docente-claudia-villalba',
    name: 'Mg. Claudia Patricia Villalba',
    institution: 'CECAR - Coordinación de I+D+i',
    roleTitle: 'Docente Asesora en Arquitecturas de Software Seguro',
  },
  {
    id: 'docente-marcos-solano',
    name: 'Ing. Marcos Fidel Solano',
    institution: 'CECAR - Grupo de Investigación GIDESTEC',
    roleTitle: 'Asesor Técnico en Redes & Criptografía Aplicada',
  },
];

const INITIAL_MEMBERS: RegisteredMember[] = [
  {
    id: 'bryan-velilla',
    fullName: 'Bryan Esteban Velilla Perez',
    email: 'bryan.velilla@cecar.edu.co',
    role: 'semillerista',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Ciberseguridad Ofensiva & Red Team',
    badge: 'Red Team Lead',
    createdAt: '2023-02-10',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'luis-acuna',
    fullName: 'Luis Felipe Acuña Hoyos',
    email: 'luis.acuna@cecar.edu.co',
    role: 'semillerista',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Arquitectura de Redes & Protocolos BGP/IPsec',
    badge: 'Network Defense',
    createdAt: '2023-03-15',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'tomas-arias',
    fullName: 'Tomas Alberto Arias Zabala',
    email: 'tomas.arias@cecar.edu.co',
    role: 'semillerista',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Seguridad Perimetral & Firewalls NGFW',
    badge: 'Hardening',
    createdAt: '2023-04-01',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'andres-torres',
    fullName: 'Andrés Alfonso Torres Hernández',
    email: 'andres.torres@cecar.edu.co',
    role: 'semillerista',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Análisis de Malware & Threat Hunting',
    badge: 'Threat Intel',
    createdAt: '2023-05-12',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'albeiro-vergara',
    fullName: 'Albeiro José Vergara Pérez',
    email: 'albeiro.vergara@cecar.edu.co',
    role: 'semillerista',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Informática Forense & Custodia de Evidencias',
    badge: 'Digital Forensics',
    createdAt: '2023-06-20',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'valentina-ayala',
    fullName: 'Valentina Ayala Ruiz',
    email: 'valentina.ayala@cecar.edu.co',
    role: 'semillerista',
    program: 'Ingeniería de Sistemas // CECAR',
    focusArea: 'Criptografía Aplicada & Privacidad de Datos',
    badge: 'Cryptography',
    createdAt: '2023-07-08',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
];

const INITIAL_PUBLICATIONS: Publication[] = [
  {
    id: 'pub-01',
    title: 'Análisis de Resiliencia en Redes Perimetrales frente a Técnicas Evasivas de C2 sobre DNS Tunneling',
    abstract: 'Investigación técnica sobre la detección temprana y mitigación de canales de comando y control (C2) ocultos mediante consultas recursivas DNS en infraestructuras universitarias. Se modela un banco de pruebas con Suricata IDS y Zeek para correlación de entropía.',
    content: 'En la actualidad, las técnicas de exfiltración de información y comando y control (C2) sobre el protocolo DNS representan uno de los vectores más sigilosos y complejos de detectar en perímetros corporativos y educativos. En este trabajo conjunto entre estudiantes investigadores y docentes del semillero Géminis, desarrollamos un entorno de laboratorio emulando agentes C2 basados en DNS-tunneling (dnscat2 e iodine), analizando el comportamiento de las consultas DNS en tiempo real mediante análisis estadístico de entropía en subdominios y patrones de longitud de registros TXT.',
    category: 'Ciberseguridad Ofensiva',
    authorId: 'bryan-velilla',
    authorName: 'Bryan Esteban Velilla Perez',
    authorRole: 'semillerista',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    createdAt: '2024-03-12',
    readTime: '8 min',
    tags: ['DNS Tunneling', 'Suricata', 'Threat Hunting', 'Ethical Hacking', 'Red Team'],
    linkUrl: 'https://cecar.edu.co/investigaciones/geminis/dns-tunneling',
    doi: '10.5281/zenodo.geminis.2024.01',
    associatedDocentes: [
      {
        id: 'docente-hernando-castro',
        name: 'Dr. Hernando Castro',
        institution: 'CECAR',
        roleTitle: 'Director & Asesor Metodológico',
      },
    ],
    associatedSemilleristas: [
      {
        id: 'luis-acuna',
        name: 'Luis Felipe Acuña Hoyos',
        program: 'Ingeniería de Sistemas // CECAR',
        focusArea: 'Arquitectura de Redes',
      },
      {
        id: 'tomas-arias',
        name: 'Tomas Alberto Arias Zabala',
        program: 'Ingeniería de Sistemas // CECAR',
        focusArea: 'Hardening & Reglas de Firewall',
      },
    ],
    comments: [
      {
        id: 'c-01',
        authorId: 'docente-hernando-castro',
        authorName: 'Dr. Hernando Castro',
        authorRole: 'docente',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        content: 'Excelente rigor metodológico en la captura de tráfico y configuración de Suricata. Propongo presentar este avance en el próximo encuentro departamental de semilleros RedCOLSI.',
        rating: 5,
        createdAt: '2024-03-14T10:30:00Z',
      },
      {
        id: 'c-02',
        authorId: 'vis-01',
        authorName: 'Ing. Mateo Gómez',
        authorRole: 'visitante',
        content: 'Muy interesante el análisis comparativo de entropía para detectar los túneles iodine. ¿Tuvieron falsos positivos con CDN como Cloudflare o Akamai en las pruebas de tráfico regular?',
        rating: 4,
        createdAt: '2024-03-15T16:45:00Z',
      },
    ],
  },
  {
    id: 'pub-02',
    title: 'Protocolo de Adquisición y Cadena de Custodia Forense en Volcado de Memoria RAM para Sistemas Linux GNU/Debian',
    abstract: 'Guía práctica e investigación experimental para la extracción en vivo de artefactos en memoria volátil sin alterar la integridad probatoria, utilizando LiME (Linux Memory Extractor) y análisis de procesos huérfanos con el framework Volatility 3.',
    content: 'Durante un incidente de seguridad avanzado, gran parte de los indicios clave como claves de cifrado temporales, inyecciones de código en espacio de usuario y conexiones de sockets activas residen únicamente en la memoria RAM volátil. Este artículo documenta el procedimiento estándar de preservación desarrollado en el semillero Géminis con fines periciales y forenses conformes a la norma ISO/IEC 27037.',
    category: 'Forense & DFIR',
    authorId: 'albeiro-vergara',
    authorName: 'Albeiro José Vergara Pérez',
    authorRole: 'semillerista',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    createdAt: '2024-04-05',
    readTime: '11 min',
    tags: ['DFIR', 'Volatility 3', 'LiME Kernel', 'ISO/IEC 27037', 'Linux Forensics'],
    linkUrl: 'https://cecar.edu.co/investigaciones/geminis/ram-forensics',
    doi: '10.5281/zenodo.geminis.2024.02',
    associatedDocentes: [
      {
        id: 'docente-claudia-villalba',
        name: 'Mg. Claudia Patricia Villalba',
        institution: 'CECAR',
        roleTitle: 'Asesora de Investigación',
      },
    ],
    associatedSemilleristas: [
      {
        id: 'andres-torres',
        name: 'Andrés Alfonso Torres Hernández',
        program: 'Ingeniería de Sistemas // CECAR',
        focusArea: 'Threat Hunting & Análisis de Malware',
      },
    ],
    comments: [
      {
        id: 'c-03',
        authorId: 'semillerista-bryan-velilla',
        authorName: 'Bryan Esteban Velilla Perez',
        authorRole: 'semillerista',
        content: 'Un aporte fundamental para el laboratorio de respuesta a incidentes del semillero. Los scripts de automatización con Volatility 3 redujeron los tiempos de extracción considerablemente.',
        rating: 5,
        createdAt: '2024-04-07T09:15:00Z',
      },
    ],
  },
  {
    id: 'pub-03',
    title: 'Evaluación de Cifrado Híbrido Post-Cuántico (Kyber + ECDH) en Canales de Telemetría para Nodos IoT Agrícolas',
    abstract: 'Estudio de desempeño computacional y consumo energético del mecanismo de encapsulamiento de claves Kyber (NIST PQC) combinado con curvas elípticas sobre microcontroladores ESP32 en entornos rurales de Sucre.',
    content: 'La inminente transición hacia la criptografía resistente a computación cuántica plantea desafíos críticos para dispositivos de recursos limitados. Evaluamos las latencias de handshake y los costos de fragmentación de paquetes en redes de bajo consumo LoRaWAN utilizando algoritmos finalistas del NIST.',
    category: 'Cloud & Criptografía',
    authorId: 'docente-hernando-castro',
    authorName: 'Dr. Hernando Castro',
    authorRole: 'docente',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: '2024-05-18',
    readTime: '14 min',
    tags: ['Post-Quantum Cryptography', 'Kyber', 'IoT Security', 'ESP32', 'NIST'],
    linkUrl: 'https://cecar.edu.co/investigaciones/geminis/pqc-iot',
    doi: '10.5281/zenodo.geminis.2024.03',
    associatedDocentes: [
      {
        id: 'docente-marcos-solano',
        name: 'Ing. Marcos Fidel Solano',
        institution: 'CECAR',
        roleTitle: 'Co-Investigador Principal',
      },
    ],
    associatedSemilleristas: [
      {
        id: 'valentina-ayala',
        name: 'Valentina Ayala Ruiz',
        program: 'Ingeniería de Sistemas // CECAR',
        focusArea: 'Criptografía & Protocolos Seguros',
      },
      {
        id: 'bryan-velilla',
        name: 'Bryan Esteban Velilla Perez',
        program: 'Ingeniería de Sistemas // CECAR',
        focusArea: 'Auditoría de Firmware',
      },
    ],
    comments: [
      {
        id: 'c-04',
        authorId: 'vis-02',
        authorName: 'Dra. Elena Ramos',
        authorRole: 'visitante',
        content: 'Felicidades al semillero y al profesor Castro por incursionar en algoritmos Post-Quantum en hardware embebido. Es una de las líneas de mayor vanguardia tecnológica.',
        rating: 5,
        createdAt: '2024-05-20T11:20:00Z',
      },
    ],
  },
];

const ResearchContext = createContext<ResearchContextType | undefined>(undefined);

export const ResearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [members, setMembers] = useState<RegisteredMember[]>([]);
  const [docentes] = useState<AssociatedDocente[]>(INITIAL_DOCENTES);
  const [activePublication, setActivePublication] = useState<Publication | null>(null);

  // Initialize data from localStorage or seeds
  useEffect(() => {
    try {
      const savedPubs = localStorage.getItem(STORAGE_KEY_PUBS);
      if (savedPubs) {
        setPublications(JSON.parse(savedPubs));
      } else {
        setPublications(INITIAL_PUBLICATIONS);
        localStorage.setItem(STORAGE_KEY_PUBS, JSON.stringify(INITIAL_PUBLICATIONS));
      }

      const savedMembers = localStorage.getItem(STORAGE_KEY_MEMBERS);
      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      } else {
        setMembers(INITIAL_MEMBERS);
        localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(INITIAL_MEMBERS));
      }
    } catch (e) {
      console.error('Error inicializando ResearchContext:', e);
      setPublications(INITIAL_PUBLICATIONS);
      setMembers(INITIAL_MEMBERS);
    }
  }, []);

  const savePublications = (newPubs: Publication[]) => {
    setPublications(newPubs);
    try {
      localStorage.setItem(STORAGE_KEY_PUBS, JSON.stringify(newPubs));
    } catch (e) {
      console.error('Error guardando publicaciones:', e);
    }
  };

  const saveMembers = (newMembers: RegisteredMember[]) => {
    setMembers(newMembers);
    try {
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(newMembers));
    } catch (e) {
      console.error('Error guardando miembros:', e);
    }
  };

  // Add new publication (Semillerista and Docente only)
  const addPublication = (
    data: Omit<Publication, 'id' | 'createdAt' | 'comments'>
  ): { success: boolean; message?: string } => {
    if (!user) {
      return { success: false, message: 'Debes iniciar sesión para publicar investigaciones.' };
    }

    if (user.role === 'visitante') {
      return {
        success: false,
        message: 'Tu rol de Visitante solo permite publicar opiniones y comentarios en las investigaciones existentes.',
      };
    }

    if (!data.title.trim() || !data.abstract.trim()) {
      return { success: false, message: 'El título y el resumen técnico son obligatorios.' };
    }

    const newPub: Publication = {
      ...data,
      id: 'pub-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      comments: [],
    };

    const updated = [newPub, ...publications];
    savePublications(updated);
    return { success: true };
  };

  // Add comment / opinion (Visitante, Semillerista, Docente)
  const addComment = (
    publicationId: string,
    content: string,
    rating: number = 5
  ): { success: boolean; message?: string } => {
    if (!user) {
      return { success: false, message: 'Debes iniciar sesión para dejar una opinión o comentario técnico.' };
    }

    if (!content.trim()) {
      return { success: false, message: 'El comentario no puede estar vacío.' };
    }

    const newComment: PublicationComment = {
      id: 'cmt-' + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      authorAvatar: user.avatar,
      content: content.trim(),
      rating,
      createdAt: new Date().toISOString(),
    };

    const updated = publications.map((pub) => {
      if (pub.id === publicationId) {
        return {
          ...pub,
          comments: [newComment, ...pub.comments],
        };
      }
      return pub;
    });

    savePublications(updated);

    // Update activePublication if open
    if (activePublication && activePublication.id === publicationId) {
      setActivePublication({
        ...activePublication,
        comments: [newComment, ...activePublication.comments],
      });
    }

    return { success: true };
  };

  // Register a new semillerista (Docente only)
  const registerSemillerista = (
    memberData: Omit<RegisteredMember, 'id' | 'createdAt' | 'role'>
  ): { success: boolean; message?: string } => {
    if (!user || user.role !== 'docente') {
      return {
        success: false,
        message: 'Acceso restringido: Solo los docentes pueden registrar o asociar nuevos semilleristas.',
      };
    }

    if (!memberData.fullName.trim() || !memberData.email.trim()) {
      return { success: false, message: 'El nombre completo y correo institucional son obligatorios.' };
    }

    // Check if email already exists
    const exists = members.some((m) => m.email.toLowerCase() === memberData.email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Ya existe un integrante registrado con ese correo electrónico.' };
    }

    const newMember: RegisteredMember = {
      ...memberData,
      id: 'semillerista-' + Date.now(),
      role: 'semillerista',
      registeredBy: user.name,
      createdAt: new Date().toISOString().split('T')[0],
      image:
        memberData.image ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };

    const updated = [newMember, ...members];
    saveMembers(updated);
    return { success: true };
  };

  return (
    <ResearchContext.Provider
      value={{
        publications,
        members,
        docentes,
        activePublication,
        setActivePublication,
        addPublication,
        addComment,
        registerSemillerista,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export const useResearch = () => {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
};
