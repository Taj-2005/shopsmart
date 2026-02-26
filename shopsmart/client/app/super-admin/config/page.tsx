"use client";

import { useState, useEffect } from "react";
import { superAdminApi } from "@/api/super-admin.api";

export default function SuperAdminConfigPage() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    superAdminApi
      .getConfig()
      .then((res) => {
        if (res.success && res.data) setConfig(res.data as Record<string, unknown>);
      })
      .catch(() => setError("Failed to load config"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
      </div>
    );
  }

  if (error) {
    return <p className="text-[var(--color-error)]">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">System config</h1>
      <p className="text-muted-foreground">Key-value configuration. Edit via API or dedicated sections (Payment, Shipping, Feature flags).</p>
      {config && Object.keys(config).length > 0 ? (
        <pre className="overflow-auto rounded-[var(--radius-sm)] border border-border bg-muted/30 p-4 font-mono text-xs">
          {JSON.stringify(config, null, 2)}
        </pre>
      ) : (
        <p className="text-muted-foreground">No config keys set yet.</p>
      )}
    </div>
  );
}
