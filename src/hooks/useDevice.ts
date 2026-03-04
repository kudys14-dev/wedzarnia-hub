import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchLatestReading, fetchHistory, sendCommand as apiSendCommand } from "@/services/api";
import type { SmokerReading } from "@/types";

export function useDevice(deviceId: string) {
  const [reading, setReading] = useState<SmokerReading | null>(null);
  const [history, setHistory] = useState<SmokerReading[]>([]);
  const [loading, setLoading] = useState(true);

  const poll = useCallback(async () => {
    try {
      const data = await fetchLatestReading(deviceId);
      setReading(data);
    } catch (e) {
      console.error("poll error", e);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchHistory(deviceId, 120);
      setHistory(data);
    } catch (e) {
      console.error("history error", e);
    }
  }, [deviceId]);

  useEffect(() => {
    poll();
    loadHistory();
    const pollInterval = setInterval(poll, 2000);
    const histInterval = setInterval(loadHistory, 30000);
    return () => {
      clearInterval(pollInterval);
      clearInterval(histInterval);
    };
  }, [poll, loadHistory]);

  const sendCommand = useCallback(async (cmd: string, value?: number) => {
    try {
      await apiSendCommand(deviceId, cmd, value);
      const labels: Record<string, string> = {
        start:     "▶ Proces uruchomiony",
        pause:     "⏸ Proces wstrzymany",
        resume:    "▶ Proces wznowiony",
        stop:      "⏹ Proces zatrzymany",
        next_step: "⏭ Następny krok",
        set_temp:  `🌡 Temperatura: ${value}°C`,
        set_power: `⚡ Moc: ${value}`,
        set_fan:   `💨 Wentylator: ${value}`,
        set_smoke: `💨 Dym: ${value}`,
      };
      toast.success(labels[cmd] ?? `Komenda: ${cmd}`);
    } catch (e) {
      toast.error(`Błąd komendy "${cmd}": ${e}`);
    }
  }, [deviceId]);

  return { reading, history, loading, sendCommand, reload: poll };
}
