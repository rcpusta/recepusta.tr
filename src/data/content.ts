export const projectMeta = [
  {
    id: "1",
    slug: "isp-network-projects",
    image: "/images/projects/isp.jpg",
    technologies: ["MikroTik", "Cisco", "Ubiquiti", "RADIUS", "Zabbix"],
    year: "2024",
    featured: true,
  },
  {
    id: "2",
    slug: "enterprise-server-infrastructure",
    image: "/images/projects/servers.jpg",
    technologies: ["Proxmox", "VMware", "TrueNAS", "Docker", "Prometheus"],
    year: "2024",
    featured: true,
  },
  {
    id: "3",
    slug: "corporate-websites",
    image: "/images/projects/websites.jpg",
    technologies: ["Next.js", "TypeScript", "Framer Motion", "Tailwind"],
    year: "2025",
    featured: true,
  },
  {
    id: "4",
    slug: "ai-automation-systems",
    image: "/images/projects/ai.jpg",
    technologies: ["Python", "n8n", "OpenAI", "Node.js", "Redis"],
    year: "2025",
    featured: true,
  },
  {
    id: "5",
    slug: "hosting-infrastructure",
    image: "/images/projects/hosting.jpg",
    technologies: ["Plesk", "Cloudflare", "Linux", "MySQL", "Nginx"],
    year: "2023",
    featured: true,
  },
  {
    id: "6",
    slug: "network-monitoring",
    image: "/images/projects/monitoring.jpg",
    technologies: ["Zabbix", "Grafana", "SNMP", "Syslog", "Python"],
    year: "2024",
    featured: true,
  },
  {
    id: "7",
    slug: "insurance-software",
    image: "/images/projects/insurance.jpg",
    technologies: ["Laravel", "MySQL", "Redis", "Vue", "Docker"],
    year: "2023",
    featured: true,
  },
  {
    id: "8",
    slug: "education-platform",
    image: "/images/projects/education.jpg",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Docker", "Redis"],
    year: "2025",
    featured: true,
  },
] as const;

export const blogMeta = [
  {
    id: "1",
    slug: "zero-trust-network-architecture",
    image: "/images/blog/security.jpg",
    date: "2025-11-12",
  },
  {
    id: "2",
    slug: "proxmox-vs-vmware-2025",
    image: "/images/blog/virtualization.jpg",
    date: "2025-10-03",
  },
  {
    id: "3",
    slug: "fiber-backbone-best-practices",
    image: "/images/blog/fiber.jpg",
    date: "2025-09-18",
  },
  {
    id: "4",
    slug: "ai-ops-automation-playbook",
    image: "/images/blog/aiops.jpg",
    date: "2025-08-22",
  },
] as const;

export const videoMeta = [
  {
    id: "v1",
    slug: "mikrotik-vlan-basics",
    thumbnail: "/images/projects/isp.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "12:40",
    date: "2025-12-01",
  },
  {
    id: "v2",
    slug: "proxmox-cluster-setup",
    thumbnail: "/images/projects/servers.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "18:22",
    date: "2025-11-20",
  },
  {
    id: "v3",
    slug: "cloudflare-zero-trust-intro",
    thumbnail: "/images/blog/security.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "09:15",
    date: "2025-10-28",
  },
  {
    id: "v4",
    slug: "n8n-ai-automation-demo",
    thumbnail: "/images/projects/ai.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "14:05",
    date: "2025-09-30",
  },
] as const;

export const galleryMeta = [
  {
    id: "g1",
    slug: "fiber-splice-lab",
    image: "/images/blog/fiber.jpg",
    date: "2025-11-08",
  },
  {
    id: "g2",
    slug: "datacenter-rack-build",
    image: "/images/about/why-choose.jpg",
    date: "2025-10-15",
  },
  {
    id: "g3",
    slug: "network-ops-center",
    image: "/images/projects/monitoring.jpg",
    date: "2025-09-12",
  },
  {
    id: "g4",
    slug: "edge-hosting-nodes",
    image: "/images/projects/hosting.jpg",
    date: "2025-08-05",
  },
  {
    id: "g5",
    slug: "enterprise-core-switch",
    image: "/images/projects/isp.jpg",
    date: "2025-07-22",
  },
  {
    id: "g6",
    slug: "education-lab-setup",
    image: "/images/projects/education.jpg",
    date: "2025-06-18",
  },
] as const;

export const serviceIcons = [
  "Network",
  "Cable",
  "Server",
  "Boxes",
  "Cloud",
  "Globe",
  "ShoppingBag",
  "Shield",
  "Bot",
  "Handshake",
] as const;

export const techStack = [
  { name: "Linux", category: "OS" },
  { name: "Windows Server", category: "OS" },
  { name: "VMware", category: "Virtualization" },
  { name: "Proxmox", category: "Virtualization" },
  { name: "Docker", category: "Containers" },
  { name: "Kubernetes", category: "Containers" },
  { name: "Laravel", category: "Backend" },
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "MySQL", category: "Database" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Redis", category: "Database" },
  { name: "Cloudflare", category: "Edge" },
  { name: "MikroTik", category: "Network" },
  { name: "Ubiquiti", category: "Network" },
  { name: "Ruijie", category: "Network" },
  { name: "Cisco", category: "Network" },
  { name: "Fortinet", category: "Security" },
  { name: "Python", category: "Automation" },
  { name: "AI APIs", category: "AI" },
  { name: "n8n", category: "Automation" },
  { name: "GitHub", category: "DevOps" },
  { name: "Plesk", category: "Hosting" },
  { name: "TrueNAS", category: "Storage" },
];

export const stats = [
  { key: "years" as const, value: 8, suffix: "+" },
  { key: "projects" as const, value: 120, suffix: "+" },
  { key: "servers" as const, value: 350, suffix: "+" },
  { key: "devices" as const, value: 2000, suffix: "+" },
  { key: "clients" as const, value: 60, suffix: "+" },
];

export const images = {
  portrait: "/images/about/portrait.jpg",
  aboutHero: "/images/about/hero.jpg",
  whyChoose: "/images/about/why-choose.jpg",
  logo: "/images/brand/logo.png?v=4",
} as const;

export const navHrefs = [
  { href: "/", key: "home" as const },
  { href: "/about", key: "about" as const },
  { href: "/services", key: "services" as const },
  { href: "/magaza", key: "store" as const },
  { href: "/projects", key: "projects" as const },
  { href: "/blog", key: "media" as const },
  { href: "/haberler", key: "news" as const },
  { href: "/contact", key: "contact" as const },
];
