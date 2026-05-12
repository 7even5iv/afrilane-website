export const NAVIGATION_LINKS = [
  { name: 'Accueil', href: '/' },
  { name: 'Formations', href: '/formations' },
  { name: 'Certifications', href: '/certifications' },
  { name: 'Services', href: '/services' },
  { name: 'À propos', href: '/a-propos' },
];

export const PARTNERS = [
  { name: 'CISCO', logo: '/logos/cisco.png' },
  { name: 'PECB', logo: '/logos/pecb.png' },
  { name: 'FORTINET', logo: '/logos/fortinet.png' },
  { name: 'MICROSOFT', logo: '/logos/microsoft.png' },
  { name: 'Pearson|Vue', logo: '/logos/pearson-vue.png' },
];

export const COURSES = [
  {
    id: 1,
    title: 'Cisco CCNA 200-301',
    category: 'Réseaux',
    duration: '40h',
    level: 'Associé',
    description: 'Maîtrisez les bases des réseaux et préparez la certification mondiale Cisco.',
    imageUrl: '/images/ccna.png', // Ajoutez le chemin de votre image
  },
  {
    id: 2,
    title: 'Cisco CCNP ENTERPRISE',
    category: 'Réseaux',
    duration: '35h',
    level: 'Professionnel',
    description: 'La référence mondiale pour la gestion de projet professionnelle.',
    imageUrl: '/images/ccnp.jpg',
  },
  {
    id: 3,
    title: 'Cisco CCIE SECURITY',
    category: 'Cybersécurité',
    duration: '50h',
    level: 'Expert',
    description: 'Protégez les infrastructures critiques et devenez un expert en sécurité.',
    imageUrl: '/images/ccie.png',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Jean-Paul Nogué",
    role: "Ingénieur Réseau",
    company: "SNH",
    content: "Grâce à l'accompagnement d'AFRILANE, j'ai obtenu ma certification CCNA du premier coup.",
    stars: 5,
    cert: "CCNA",
    avatar: "JP" // <--- Assure-toi que cette ligne existe pour chaque témoignage
  },
  {
    id: 2,
    name: "Sandrine Eboa",
    role: "Chef de Projet",
    company: "Port Autonome",
    content: "Le cursus PMP est intense mais extrêmement structuré. Un cadre idéal pour réussir.",
    stars: 5,
    cert: "PMP",
    avatar: "SE"
  },
];

export interface Program {
    id: string;
    type: 'formation' | 'certification';
    title: string;
    category: string;
    price: number;
    duration: string;
    examIncluded: boolean;
    description: string;
}

export const CERTIFICATIONS_DATA = [
  // RÉSEAUX
  {
    id: "ccna",
    name: "Cisco CCNA 200-301",
    provider: "Cisco",
    category: "Réseaux",
    trainingPrice: 150000,
    examPrice: 215000,
    duration: "40h",
    description: "Installation, configuration et dépannage des réseaux d'entreprise."
  },
  // SÉCURITÉ
  {
    id: "sec-plus",
    name: "CompTIA Security+",
    provider: "CompTIA",
    category: "Sécurité",
    trainingPrice: 175000,
    examPrice: 245000,
    duration: "40h",
    description: "Les bases fondamentales de la cybersécurité mondiale."
  },
  {
    id: "iso-27001",
    name: "ISO/IEC 27001 Lead Implementer",
    provider: "PECB",
    category: "Sécurité",
    trainingPrice: 450000,
    examPrice: 0, 
    duration: "5 Jours",
    description: "Devenez expert en mise en œuvre de systèmes de management de la sécurité."
  },
  // MANAGEMENT
  {
    id: "pmp",
    name: "PMP - Gestion de Projet",
    provider: "PMI",
    category: "Management",
    trainingPrice: 350000,
    examPrice: 405000,
    duration: "35h",
    description: "La certification n°1 mondiale pour les chefs de projet."
  }
];

// Liste des catégories pour les filtres
export const CATEGORIES = ["Tous", "Réseaux", "Sécurité", "Management", "Cloud"];

export const COLORS = {
  primary: '#0056b3',
  secondary: '#f4f4f4',
  text: '#333333',
};