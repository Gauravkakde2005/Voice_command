import type { PropsWithChildren } from "react";

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(242,95,92,0.25),_transparent_25%),linear-gradient(135deg,_#f7f4ea_0%,_#f5fbfa_55%,_#eef3f8_100%)] text-brand-ink">
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">{children}</div>
  </div>
);
