export const NAVIGATION_LINKS = [
  { name: 'Accueil', href: '/' },
  { name: 'Formations', href: '/formations' },
  { name: 'Certifications', href: '/certifications' },
  { name: 'Services', href: '/services' },
  { name: 'À propos', href: '/a-propos' },
   { name: "Blog", href: "/blog" },
];

//
export const PARTNERS = [
  { name: 'CISCO', logo: '/logos/cisco.png' },
  { name: 'PECB', logo: '/logos/pecb.png' },
  { name: 'FORTINET', logo: '/logos/fortinet.png' },
  { name: 'MICROSOFT', logo: '/logos/microsoft.png' },
  { name: 'Pearson|Vue', logo: '/logos/pearson-vue.png' },
];
// CARTES CERTIFICATIONS
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
// CERTIFICATIONS
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
    description: "Installation, configuration et dépannage des réseaux d'entreprise.",
    image: '/images/ccna.png'
  },
  {
    id: "ccnp",
    name: "Cisco CCNP Enterprise",
    provider: "Cisco",
    category: "Réseaux",
    trainingPrice: 250000,
    examPrice: 250000,
    duration: "35h",
    description: "Conception et gestion avancée des réseaux d'entreprise.",
    image: '/images/ccnp.jpg'
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
// FORMATIONS
export const VOCATIONAL_TRAININGS = [
  {
    id: "sec-bur",
    title: "Secrétariat Bureautique",
    subTitle: "Office Automation Secretaryship",
    price: 200000,
    category: "Administration",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000"
  },
  {
    id: "sec-bil",
    title: "Secrétariat Bureautique Bilingue",
    subTitle: "Bilingual Secretaryship",
    price: 270000,
    category: "Administration",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000"
  },
  {
    id: "sec-comp",
    title: "Secrétariat Comptable",
    subTitle: "Accounting Secretaryship",
    price: 250000,
    category: "Finance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000"
  },
  {
    id: "comp-inf",
    title: "Comptabilité Informatisée et Gestion",
    subTitle: "Computerized Accounting and Management",
    price: 270000,
    category: "Finance",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000"
  },
  {
    id: "maint-res",
    title: "Maintenance Informatique et des Réseaux",
    subTitle: "Computer and Network Maintenance",
    price: 270000,
    category: "IT & Tech",
    image: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1000"
  },
  {
    id: "graph-prod",
    title: "Graphisme de Production",
    subTitle: "Production Graphics Design",
    price: 270000,
    category: "Design",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000"
  },
  {
    id: "webmaster",
    title: "WebMestre",
    subTitle: "WebMaster",
    price: 270000,
    category: "IT & Tech",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000"
  },
  {
    id: "dev-app",
    title: "Développement d'application",
    subTitle: "Application Development",
    price: 270000,
    category: "IT & Tech",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000"
  }
];

// Liste des catégories pour les filtres
export const CATEGORIES = ["Tous", "Réseaux", "Sécurité", "Management", "Cloud", "Gestion des services", "Bases de données", "Bureautique"];

export const COLORS = {
  primary: '#0056b3',
  secondary: '#f4f4f4',
  text: '#333333',
};
// BLOG
export const BLOG_POSTS = [
  {
    id: 1,
    title: "Pourquoi passer sa certification Cisco en 2024 ?",
    excerpt: "Le marché de l'emploi IT au Cameroun est en pleine mutation. Découvrez pourquoi le CCNA reste le sésame...",
    date: "12 Mai 2024",
    category: "Conseils Carrière",
    author: "Expert Afrilane",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=1000"
  },
  {
    id: 2,
    title: "Sécurité des SI : Les 5 failles les plus courantes",
    excerpt: "Audit de sécurité : comment protéger les données de votre entreprise contre les cyberattaques locales...",
    date: "08 Mai 2024",
    category: "Cybersécurité",
    author: "Ingénieur Sécurité",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000"
  },
  {
    id: 3,
    title: "Lancement de la rentrée académique NOV 2025",
    excerpt: "Découvrez les nouvelles modalités d'inscription pour nos cursus de Secrétariat et Maintenance...",
    date: "01 Mai 2024",
    category: "Actualités",
    author: "Admin",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000"
  }
];