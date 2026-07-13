import type { TechItem, Testimonial, TimelineItem } from "@/types";

export const techStack: TechItem[] = [
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

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Emre Yılmaz",
    role: "CTO",
    company: "NovaFiber ISP",
    quote:
      "Recep redesigned our entire access network with surgical precision. Uptime improved immediately and the documentation quality is unmatched.",
  },
  {
    id: "2",
    name: "Selin Arslan",
    role: "Operations Director",
    company: "Apex Hosting",
    quote:
      "Our hosting platform went from fragile to enterprise-ready. Security posture, monitoring and delivery speed all leveled up.",
  },
  {
    id: "3",
    name: "Can Demir",
    role: "Founder",
    company: "Orbit Digital",
    quote:
      "The website and automation stack feel premium. Performance is excellent and every interaction was designed with intent.",
  },
  {
    id: "4",
    name: "Ayşe Kara",
    role: "IT Manager",
    company: "Northline Group",
    quote:
      "From server clusters to firewall policy, Recep brings enterprise standards without the enterprise theater.",
  },
];

export const timeline: TimelineItem[] = [
  {
    year: "2018",
    title: "Network Foundations",
    description: "Started with ISP field operations, routing labs and fiber deployments.",
  },
  {
    year: "2020",
    title: "Infrastructure Scale",
    description: "Built virtualization clusters, monitoring stacks and hardened server fleets.",
  },
  {
    year: "2022",
    title: "Software & Cloud",
    description: "Expanded into web platforms, cloud edge and secure application delivery.",
  },
  {
    year: "2024",
    title: "AI Automation",
    description: "Integrated AI-driven ops automation with quality-first delivery systems.",
  },
  {
    year: "2026",
    title: "Premium Systems",
    description: "Focusing on modern digital infrastructure with unmatched craftsmanship.",
  },
];

export const processSteps = [
  {
    id: "discover",
    title: "Discover",
    description: "Deep audit of goals, constraints, risks and existing infrastructure.",
  },
  {
    id: "plan",
    title: "Plan",
    description: "Architecture blueprints, timelines and measurable success criteria.",
  },
  {
    id: "build",
    title: "Build",
    description: "Precision execution with clean documentation and staged rollouts.",
  },
  {
    id: "deploy",
    title: "Deploy",
    description: "Hardened production launches with observability from day one.",
  },
  {
    id: "support",
    title: "Support",
    description: "Long-term reliability, iteration and proactive system care.",
  },
];

export const whyChoose = [
  {
    title: "Premium Quality",
    description: "Every system is crafted with obsessive attention to detail and longevity.",
  },
  {
    title: "Fast Delivery",
    description: "Clear scope, disciplined execution and momentum without cutting corners.",
  },
  {
    title: "Enterprise Standards",
    description: "Security baselines, documentation and operational rigor by default.",
  },
  {
    title: "Scalable Systems",
    description: "Architectures that grow cleanly as traffic, devices and teams expand.",
  },
  {
    title: "Security First",
    description: "Defense-in-depth thinking from network edge to application layer.",
  },
  {
    title: "Long-term Support",
    description: "Partnership beyond launch — monitoring, iteration and trust.",
  },
];

export const stats = [
  { label: "Years Experience", value: 8, suffix: "+" },
  { label: "Projects Completed", value: 120, suffix: "+" },
  { label: "Servers Managed", value: 350, suffix: "+" },
  { label: "Network Devices", value: 2000, suffix: "+" },
  { label: "Clients", value: 60, suffix: "+" },
];

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
