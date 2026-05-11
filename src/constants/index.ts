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

export const COLORS = {
  primary: '#0056b3',
  secondary: '#f4f4f4',
  text: '#333333',
};