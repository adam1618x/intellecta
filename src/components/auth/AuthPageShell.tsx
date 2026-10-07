"use client";

import { useState } from "react";
import AuthCard from "./AuthCard";
import ParticleNetwork from "./ParticleNetwork";
import type { AuthMode } from "./AuthModalContext";

export default function AuthPageShell({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  return (
    <div className="auth-wrap">
      <ParticleNetwork />
      <AuthCard mode={mode} onModeChange={setMode} />
    </div>
  );
}