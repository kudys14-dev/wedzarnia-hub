import { supabase } from "./supabase";
import type { Device, SmokerReading, SmokerProfile, SmokerAlert } from "@/types";

const FN = import.meta.env.VITE_SUPABASE_URL + "/functions/v1";
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${KEY}`,
};

// ── DEVICES ──────────────────────────────────────────────────
export async function fetchDevices(): Promise<Device[]> {
  const { data, error } = await supabase
    .from("devices")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function updateDeviceName(device_id: string, name: string): Promise<void> {
  const { error } = await supabase
    .from("devices")
    .update({ name })
    .eq("device_id", device_id);
  if (error) throw error;
}

// ── READINGS ─────────────────────────────────────────────────
export async function fetchLatestReading(device_id: string): Promise<SmokerReading | null> {
  const { data, error } = await supabase
    .from("smoker_readings")
    .select("*")
    .eq("device_id", device_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data || null;
}

export async function fetchHistory(device_id: string, limit = 120): Promise<SmokerReading[]> {
  const { data, error } = await supabase
    .from("smoker_readings")
    .select("*")
    .eq("device_id", device_id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []).reverse();
}

// ── COMMANDS ─────────────────────────────────────────────────
export async function sendCommand(
  device_id: string,
  cmd: string,
  value?: number,
  extra?: Record<string, unknown>
): Promise<void> {
  const res = await fetch(`${FN}/smoker-command`, {
    method: "POST",
    headers,
    body: JSON.stringify({ device_id, cmd, value, extra }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
}

// ── PROFILES ─────────────────────────────────────────────────
export async function fetchProfiles(): Promise<SmokerProfile[]> {
  const res = await fetch(`${FN}/smoker-profile`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchProfile(id: string): Promise<SmokerProfile> {
  const res = await fetch(`${FN}/smoker-profile?id=${id}`, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createProfile(
  name: string,
  description: string,
  steps: SmokerProfile["steps"]
): Promise<SmokerProfile> {
  const res = await fetch(`${FN}/smoker-profile`, {
    method: "POST",
    headers,
    body: JSON.stringify({ name, description, steps }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateProfile(
  id: string,
  data: Partial<SmokerProfile>
): Promise<SmokerProfile> {
  const res = await fetch(`${FN}/smoker-profile?id=${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteProfile(id: string): Promise<void> {
  const res = await fetch(`${FN}/smoker-profile?id=${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// ── ALERTS ───────────────────────────────────────────────────
export async function fetchAlerts(device_id: string, limit = 20): Promise<SmokerAlert[]> {
  const { data, error } = await supabase
    .from("smoker_alerts")
    .select("*")
    .eq("device_id", device_id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}
