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
    trainingPrice: 250000,
    examPrice: 190000,
    duration: "40h",
    description: "Installation, configuration et dépannage des réseaux d'entreprise."
  },
  {
    id: "ccnp",
    name: "Cisco CCNP Enterprise",
    provider: "Cisco",
    category: "Réseaux",
    trainingPrice: 250000,
    examPrice: 250000,
    duration: "35h",
    description: "Conception et gestion avancée des réseaux d'entreprise."
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
    examPrice: 75000, 
    duration: "5 Jours",
    description: "Devenez expert en mise en œuvre de systèmes de management de la sécurité."
  },
  {
    id: "ceh",
    name: "Certified Ethical Hacker (CEH)",
    provider: "EC-Council",
    category: "Sécurité",
    trainingPrice: 200000,
    examPrice: 300000,
    duration: "40h",
    description: "Apprenez les techniques de piratage éthique pour protéger les systèmes."
  },
  {
    id: "fortinet",
    name: "Fortinet NSE 4",
    provider: "Fortinet",
    category: "Sécurité", 
    trainingPrice: 220000,
    examPrice: 150000,
    duration: "40h",
    description: "Maîtrisez la sécurité des réseaux avec les solutions Fortinet."

  },
  {
    id: "cissp",
    name: "CISSP - Certified Information Systems Security Professional",
    provider: "ISC²", 
    category: "Sécurité",
    trainingPrice: 500000,
    examPrice: 700000,
    duration: "5 Jours",
    description: "La certification de sécurité la plus reconnue au monde pour les professionnels expérimentés."
  },
  {
    id:"ccie-security",
    name: "Cisco CCIE Security",
    provider: "Cisco",
    category: "Sécurité",
    trainingPrice: 600000,
    examPrice: 1.000000,
    duration: "50h",
    description: "Devenez un expert en sécurité des réseaux avec la certification CCIE Security."
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
  },
  // CLOUD
  {
    id: "azure-fundamentals",
    name: "Microsoft Azure Fundamentals",
    provider: "Microsoft",
    category: "Cloud",
    trainingPrice: 100000,
    examPrice: 165000,
    duration: "20h",
    description: "Les bases du cloud computing avec Microsoft Azure."
  },
  // GESTION DES SERVICES
  {
    id: "itil-4",
    name: "ITIL 4 Foundation",
    provider: "AXELOS",
    category: "Gestion des services",
    trainingPrice: 120000,
    examPrice: 200000,
    duration: "16h",
    description: "Les meilleures pratiques pour la gestion efficace des services IT."
  },
  // BASES DE DONNÉES
  { 
    id: "oca",
    name: "Oracle OCA",
    provider: "Oracle",
    category: "Bases de données",
    trainingPrice: 180000,
    examPrice: 245000,
    duration: "40h",
    description: "La certification d'entrée pour les administrateurs de bases de données Oracle."
  },
  {
    id: "mcsa-sql",
    name: "Microsoft MCSA SQL Server",
    provider: "Microsoft",
    category: "Bases de données",
    trainingPrice: 200000,
    examPrice: 300000,
    duration: "40h",
    description: "La certification pour les administrateurs de bases de données SQL Server."
  },
  // BUREAUTIQUE
  {
    id: "mos-specialist",
    name: "Microsoft Office Specialist (MOS)",
    provider: "Microsoft",
    category: "Bureautique",
    trainingPrice: 80000,
    examPrice: 100000,
    duration: "20h",
    description: "La certification pour maîtriser les outils Microsoft Office."
  }
  
];

// Liste des catégories pour les filtres
export const CATEGORIES = ["Tous", "Réseaux", "Sécurité", "Management", "Cloud", "Gestion des services", "Bases de données", "Bureautique"];

export const COLORS = {
  primary: '#0056b3',
  secondary: '#f4f4f4',
  text: '#333333',
};