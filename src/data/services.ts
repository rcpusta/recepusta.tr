import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "network",
    title: "Network Infrastructure",
    description: "Enterprise-grade LAN/WAN design, routing and switching architectures.",
    details:
      "End-to-end network topology planning, VLAN segmentation, QoS, high-availability routing, and scalable backbone design for ISP and enterprise environments.",
    icon: "Network",
  },
  {
    id: "fiber",
    title: "Fiber Projects",
    description: "FTTH, FTTB and backbone fiber deployment with precise documentation.",
    details:
      "Fiber route planning, splicing supervision, OLT/ONT integration, OTDR validation, and production-ready as-built documentation.",
    icon: "Cable",
  },
  {
    id: "server",
    title: "Server Installation",
    description: "Bare-metal and rack deployments with hardened OS baselines.",
    details:
      "Hardware procurement guidance, RAID/ZFS layouts, BIOS tuning, OS hardening, monitoring agents, and lifecycle documentation.",
    icon: "Server",
  },
  {
    id: "virtualization",
    title: "Virtualization",
    description: "VMware, Proxmox and hybrid virtualization platforms.",
    details:
      "Cluster design, live migration, storage backends, backup strategies, and resource optimization for mission-critical workloads.",
    icon: "Boxes",
  },
  {
    id: "cloud",
    title: "Cloud Solutions",
    description: "Hybrid cloud, CDN and edge infrastructure orchestration.",
    details:
      "Multi-cloud networking, Cloudflare edge policies, object storage, autoscaling patterns, and secure identity federation.",
    icon: "Cloud",
  },
  {
    id: "web",
    title: "Website Development",
    description: "High-performance Next.js and Laravel experiences.",
    details:
      "Conversion-focused UX, Core Web Vitals optimization, CMS-ready architectures, and pixel-perfect responsive interfaces.",
    icon: "Globe",
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    description: "Secure checkout flows and scalable storefront platforms.",
    details:
      "Payment integrations, inventory sync, performance caching, fraud-aware design, and analytics-ready product catalogs.",
    icon: "ShoppingBag",
  },
  {
    id: "security",
    title: "Cyber Security",
    description: "Defense-in-depth for networks, endpoints and applications.",
    details:
      "Firewall policies, zero-trust access, vulnerability assessments, SIEM-ready logging, and incident response playbooks.",
    icon: "Shield",
  },
  {
    id: "ai",
    title: "AI Automation",
    description: "Workflow automation with AI APIs and n8n orchestration.",
    details:
      "Custom agents, document pipelines, ops automation, monitoring alerts, and human-in-the-loop review systems.",
    icon: "Bot",
  },
  {
    id: "consulting",
    title: "IT Consulting",
    description: "Strategic guidance for infrastructure and digital transformation.",
    details:
      "Architecture reviews, vendor selection, roadmap planning, budget modeling, and long-term operational excellence.",
    icon: "Handshake",
  },
];
