import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    slug: "isp-network-projects",
    title: "ISP Network Projects",
    subtitle: "Carrier-grade backbone & access networks",
    description:
      "Designed and deployed multi-site ISP infrastructure with redundant core routing and fiber access layers.",
    longDescription:
      "A full-stack ISP engagement covering core routing, aggregation switching, FTTH access, RADIUS AAA, and proactive monitoring. The architecture prioritizes uptime, clean VLAN segmentation, and rapid fault isolation.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    technologies: ["MikroTik", "Cisco", "Ubiquiti", "RADIUS", "Zabbix"],
    category: "Networking",
    year: "2024",
    results: ["99.98% uptime", "40% lower latency", "Full fiber documentation"],
    featured: true,
  },
  {
    id: "2",
    slug: "enterprise-server-infrastructure",
    title: "Enterprise Server Infrastructure",
    subtitle: "Virtualized compute & storage clusters",
    description:
      "Built resilient Proxmox and VMware clusters with ZFS storage and automated backup pipelines.",
    longDescription:
      "Enterprise compute platform featuring clustered hypervisors, shared storage, snapshot-based backups, and observability. Delivered with runbooks for recovery and capacity planning.",
    image:
      "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=1600&q=80",
    technologies: ["Proxmox", "VMware", "TrueNAS", "Docker", "Prometheus"],
    category: "Infrastructure",
    year: "2024",
    results: ["Zero-downtime migrations", "Automated backups", "3x denser workloads"],
    featured: true,
  },
  {
    id: "3",
    slug: "corporate-websites",
    title: "Corporate Websites",
    subtitle: "Premium brand experiences on the modern web",
    description:
      "Crafted high-converting corporate sites with Next.js, motion design, and CMS-ready content models.",
    longDescription:
      "A series of brand-forward websites focused on storytelling, performance, and editorial clarity. Each build includes structured content, SEO foundations, and accessible interactions.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    technologies: ["Next.js", "TypeScript", "Framer Motion", "Tailwind"],
    category: "Web",
    year: "2025",
    results: ["Lighthouse 95+", "CMS editable", "Faster lead capture"],
    featured: true,
  },
  {
    id: "4",
    slug: "ai-automation-systems",
    title: "AI Automation Systems",
    subtitle: "Ops workflows powered by intelligent agents",
    description:
      "Automated support, reporting and ops pipelines using AI APIs and n8n orchestration.",
    longDescription:
      "Human-supervised automation systems for ticket triage, document extraction, and infrastructure alerting. Built for reliability with fallback paths and audit trails.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    technologies: ["Python", "n8n", "OpenAI", "Node.js", "Redis"],
    category: "AI",
    year: "2025",
    results: ["70% less manual ops", "24/7 response", "Audit-ready logs"],
    featured: true,
  },
  {
    id: "5",
    slug: "hosting-infrastructure",
    title: "Hosting Infrastructure",
    subtitle: "Secure multi-tenant hosting platforms",
    description:
      "Deployed hardened hosting stacks with Plesk, Cloudflare edge protection and isolation.",
    longDescription:
      "Multi-tenant hosting environment with resource isolation, automated SSL, WAF policies, and backup retention. Tuned for predictable performance under concurrent load.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    technologies: ["Plesk", "Cloudflare", "Linux", "MySQL", "Nginx"],
    category: "Hosting",
    year: "2023",
    results: ["Hardened baselines", "Auto SSL fleet", "Edge-first delivery"],
    featured: true,
  },
  {
    id: "6",
    slug: "network-monitoring",
    title: "Network Monitoring",
    subtitle: "Observability across devices and links",
    description:
      "Implemented unified monitoring for routers, switches, servers and fiber links.",
    longDescription:
      "Centralized observability with alerting thresholds, topology maps, and SLA dashboards. Enables faster MTTR and proactive capacity decisions.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    technologies: ["Zabbix", "Grafana", "SNMP", "Syslog", "Python"],
    category: "Observability",
    year: "2024",
    results: ["Single pane of glass", "Faster MTTR", "SLA dashboards"],
    featured: true,
  },
  {
    id: "7",
    slug: "insurance-software",
    title: "Insurance Software",
    subtitle: "Domain-specific business applications",
    description:
      "Built insurance workflows with secure auth, reporting and role-based operations.",
    longDescription:
      "Business software tailored for insurance operations — claims flows, reporting, and access control — delivered with a maintainable Laravel core and modern UI.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
    technologies: ["Laravel", "MySQL", "Redis", "Vue", "Docker"],
    category: "Software",
    year: "2023",
    results: ["Role-based access", "Audit trails", "Faster reporting"],
    featured: true,
  },
  {
    id: "8",
    slug: "education-platform",
    title: "Education Platform",
    subtitle: "Modern learning infrastructure",
    description:
      "Designed an education platform with courses, assessments and scalable backend services.",
    longDescription:
      "A full learning stack including course delivery, assessments, and admin tooling. Built for growth with clean APIs and resilient infrastructure.",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1600&q=80",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "Docker", "Redis"],
    category: "Education",
    year: "2025",
    results: ["Scalable APIs", "Modern LMS UX", "Cloud-ready deploy"],
    featured: true,
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
