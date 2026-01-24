"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminDashboardContent } from "./dashboard-content";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    try {
      const authed = sessionStorage.getItem("bct-overflow-admin") === "true";
      setIsAuthed(authed);
    } catch {
      setIsAuthed(false);
    }
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem("bct-overflow-admin", "true");
        setIsAuthed(true);
        setError("");
      } catch {
        setError(
          "Your browser does not support sessionStorage. Please use a modern browser."
        );
      }
    } else {
      setError("Incorrect password.");
    }
  };

  if (!mounted) {
    return null;
  }

  if (isAuthed) {
    return <AdminDashboardContent />;
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter the password to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
