"use client";

const snippet = `export async function provisionEdge() {
  await network.secure();
  await cluster.scale({ replicas: 3 });
  return monitor.observe("edge");
}`;

export function CodePreview() {
  return (
    <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 text-sm leading-relaxed text-muted shadow-glass">
      <code>
        <span className="text-secondary">export</span>{" "}
        <span className="text-primary">async</span>{" "}
        <span className="text-accent">function</span>{" "}
        <span className="text-white">provisionEdge</span>() {"{\n"}
        {"  "}await network.secure();{"\n"}
        {"  "}await cluster.scale({"{"} replicas: 3 {"}"});{"\n"}
        {"  "}return monitor.observe(<span className="text-emerald-400">&quot;edge&quot;</span>);{"\n"}
        {"}"}
      </code>
      <span className="sr-only">{snippet}</span>
    </pre>
  );
}
