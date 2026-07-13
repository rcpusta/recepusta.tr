import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "zero-trust-network-architecture",
    title: "Designing Zero-Trust Network Architecture",
    excerpt:
      "How to segment access, verify identity continuously, and reduce blast radius across hybrid infrastructure.",
    content:
      "Zero-trust is not a product — it is an operating model. Start with identity, micro-segmentation, and continuous verification. Combine firewall policy with device posture, least privilege, and observability. In practice this means clear trust boundaries, short-lived credentials, and monitored east-west traffic.",
    category: "Cyber Security",
    date: "2025-11-12",
    readTime: "7 min",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    slug: "proxmox-vs-vmware-2025",
    title: "Proxmox vs VMware in 2025",
    excerpt:
      "A practical comparison for enterprises evaluating cost, clustering and operational maturity.",
    content:
      "Both platforms can run mission-critical workloads. The decision usually hinges on licensing, tooling familiarity, and storage strategy. Proxmox shines with open ecosystems and ZFS-friendly designs; VMware remains strong in enterprise tooling maturity.",
    category: "Technology",
    date: "2025-10-03",
    readTime: "6 min",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    slug: "fiber-backbone-best-practices",
    title: "Fiber Backbone Best Practices for Growing ISPs",
    excerpt:
      "Route planning, redundancy and documentation patterns that keep networks maintainable at scale.",
    content:
      "A clean fiber backbone is as much about documentation as optics. Plan diverse paths, standardize labeling, validate with OTDR, and keep as-built maps current. Operational excellence starts before the first splice.",
    category: "Networking",
    date: "2025-09-18",
    readTime: "8 min",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    slug: "ai-ops-automation-playbook",
    title: "AI Ops Automation Playbook",
    excerpt:
      "Building reliable automation with AI APIs, n8n and human-in-the-loop review.",
    content:
      "Useful AI automation is boring on purpose: clear triggers, deterministic tools, and audit logs. Use models for classification and drafting, keep irreversible actions behind approval, and measure MTTR reductions over vanity demos.",
    category: "Artificial Intelligence",
    date: "2025-08-22",
    readTime: "9 min",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
