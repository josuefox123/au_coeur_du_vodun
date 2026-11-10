import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  mode: 'TEMPLE' | 'DISTANCE';
  status: 'En attente' | 'Confirmé' | 'Terminé' | 'Annulé';
}

export interface FaduRequest {
  id: string;
  question: string;
  description: string;
  status: 'En attente' | 'En cours' | 'Réponse disponible' | 'Clôturée';
  createdAt: string;
  reply?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  role: 'Visiteur' | 'Utilisateur inscrit';
  isLoggedIn: boolean;
}

export interface Message {
  id: string;
  sender: 'BOKONON' | 'TEMPLE' | 'USER' | 'SYSTEM';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  unread: boolean;
  messages: Message[];
}

interface AppContextType {
  user: UserProfile;
  login: (name: string, phone: string, email?: string) => void;
  logout: () => void;
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => string;
  faduRequests: FaduRequest[];
  addFaduRequest: (question: string, description: string) => string;
  conversations: Conversation[];
  sendMessage: (
    conversationId: string,
    text: string,
    sender?: 'BOKONON' | 'TEMPLE' | 'USER' | 'SYSTEM'
  ) => void;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-fadu-8421',
    title: 'Bokonon - Explication Fadu',
    subtitle: 'Signe Ogbe Meji : Votre examen est disponible.',
    tag: 'Demande #FADU-8421',
    unread: true,
    messages: [
      {
        id: 'm1',
        sender: 'USER',
        text: 'Bonjour Bokonon, j\'ai transmis la photo de mon signe tracé ce matin pour orientation.',
        timestamp: '09:15',
      },
      {
        id: 'm2',
        sender: 'BOKONON',
        text: 'Que les bénédictions des ancêtres soient avec vous. J\'ai bien reçu et examiné la photo de votre Fadu.',
        timestamp: '11:30',
      },
      {
        id: 'm3',
        sender: 'BOKONON',
        text: 'Le signe révèle de grands déblocages à venir, mais demande le respect scrupuleux de l\'interdit de la volaille blanche durant les 7 prochains jours.',
        timestamp: '11:32',
      },
    ],
  },
  {
    id: 'conv-rdv-089',
    title: 'Secrétariat du Temple',
    subtitle: 'Votre créneau du 18 Nov à 10h30 est validé.',
    tag: 'Rendez-vous #RDV-089',
    unread: false,
    messages: [
      {
        id: 'm4',
        sender: 'TEMPLE',
        text: 'Bonjour, nous vous confirmons votre consultation au temple d\'Abomey-Calavi Zoundja pour le Mercredi 18 Novembre à 10h30.',
        timestamp: 'Hier',
      },
      {
        id: 'm5',
        sender: 'USER',
        text: 'Bien reçu, merci beaucoup pour la confirmation.',
        timestamp: 'Hier',
      },
    ],
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>({
    id: 'usr-1',
    fullName: 'Koffi Mensah',
    phone: '+229 97 00 00 00',
    email: 'koffi.mensah@exemple.com',
    role: 'Utilisateur inscrit',
    isLoggedIn: true,
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'RDV-2026-089',
      service: 'Consultation Fâ & Géomancie',
      date: 'Mercredi 18 Nov 2026',
      time: '10:30 (GMT+1 Bénin)',
      mode: 'TEMPLE',
      status: 'Confirmé',
    },
    {
      id: 'RDV-2026-042',
      service: 'Bilan Spirituel & Guidance',
      date: 'Vendredi 06 Nov 2026',
      time: '15:00 (GMT+1 Bénin)',
      mode: 'DISTANCE',
      status: 'Terminé',
    },
  ]);

  const [faduRequests, setFaduRequests] = useState<FaduRequest[]>([
    {
      id: '#FADU-8421',
      question: 'Signification du signe Ogbe Meji pour mon foyer.',
      description: 'Photo prise lors du tracé rituel au temple.',
      status: 'Réponse disponible',
      createdAt: 'Hier à 09:15',
      reply: 'Le signe révèle de grands déblocages à venir sous réserve du respect des interdits prescrits.',
    },
  ]);

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  const login = (name: string, phone: string, email?: string) => {
    setUser({
      id: `usr-${Date.now()}`,
      fullName: name,
      phone,
      email,
      role: 'Utilisateur inscrit',
      isLoggedIn: true,
    });
  };

  const logout = () => {
    setUser({
      id: 'guest',
      fullName: 'Visiteur',
      phone: '',
      role: 'Visiteur',
      isLoggedIn: false,
    });
  };

  const addAppointment = (item: Omit<Appointment, 'id' | 'status'>) => {
    const newId = `RDV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newApt: Appointment = {
      ...item,
      id: newId,
      status: 'En attente',
    };
    setAppointments((prev) => [newApt, ...prev]);

    // Ajouter automatiquement à la messagerie du secrétariat
    const notificationMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'TEMPLE',
      text: `Votre demande de rendez-vous ${newId} (${item.service} le ${item.date} à ${item.time}) a bien été reçue et est en cours d'examen.`,
      timestamp: 'À l\'instant',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === 'conv-rdv-089'
          ? {
              ...c,
              messages: [...c.messages, notificationMessage],
              subtitle: `Demande ${newId} envoyée`,
            }
          : c
      )
    );

    return newId;
  };

  const addFaduRequest = (question: string, description: string) => {
    const newId = `#FADU-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: FaduRequest = {
      id: newId,
      question,
      description,
      status: 'En attente',
      createdAt: 'À l\'instant',
    };
    setFaduRequests((prev) => [newReq, ...prev]);

    // Créer une nouvelle conversation pour ce Fadu
    const newConv: Conversation = {
      id: `conv-fadu-${Date.now()}`,
      title: 'Bokonon - Examen Fadu',
      subtitle: `Demande ${newId} reçue`,
      tag: `Demande ${newId}`,
      unread: false,
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: 'USER',
          text: `Question transmise avec la photo : "${question}"`,
          timestamp: 'À l\'instant',
        },
        {
          id: `m-ack-${Date.now() + 1}`,
          sender: 'BOKONON',
          text: `Paix et bénédictions. J'ai bien reçu la transmission de votre signe ${newId}. L'examen est en cours.`,
          timestamp: 'À l\'instant',
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    return newId;
  };

  const sendMessage = (
    conversationId: string,
    text: string,
    sender: 'BOKONON' | 'TEMPLE' | 'USER' | 'SYSTEM' = 'USER'
  ) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const timeStr = `${hh}:${mm}`;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender,
      text: text.trim(),
      timestamp: timeStr,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            subtitle: text.trim(),
          };
        }
        return c;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        appointments,
        addAppointment,
        faduRequests,
        addFaduRequest,
        conversations,
        sendMessage,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

