"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { collectAnalyticsAction } from "@/app/analytics/actions";

const VISITOR_KEY = "ru_vid";
const FIRST_KEY = "ru_vid_first";

function getVisitorId() {
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

function send(payload: {
  visitorId: string;
  path: string;
  type: "view" | "entry" | "exit";
  isNewVisitor?: boolean;
}) {
  // Prefer server action — /api/analytics/collect 404s under Passenger.
  void collectAnalyticsAction(payload).catch(() => {});
}

export function VisitorTracker() {
  const pathname = usePathname();
  const entered = useRef(false);
  const lastPath = useRef<string | null>(null);
  const exited = useRef(false);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    const visitorId = getVisitorId();
    const isNewVisitor = !window.localStorage.getItem(FIRST_KEY);
    if (isNewVisitor) window.localStorage.setItem(FIRST_KEY, "1");

    if (!entered.current) {
      entered.current = true;
      send({ visitorId, path: pathname, type: "entry", isNewVisitor });
    }

    send({ visitorId, path: pathname, type: "view", isNewVisitor: false });
  }, [pathname]);

  useEffect(() => {
    const onLeave = () => {
      if (!entered.current || exited.current) return;
      const path = window.location.pathname;
      if (path.startsWith("/admin")) return;
      exited.current = true;
      send({
        visitorId: getVisitorId(),
        path,
        type: "exit",
      });
    };

    window.addEventListener("pagehide", onLeave);
    return () => window.removeEventListener("pagehide", onLeave);
  }, []);

  return null;
}
