import { Activity, Pause, Play, SkipForward, Square, RotateCcw } from "lucide-react";
import type { SmokerReading } from "@/types";

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}`;
}

const STATE_LABELS: Record<string, { label: string; color: string }> = {
  IDLE:               { label: "Bezczynny",          color: "text-gray-400" },
  RUNNING_AUTO:       { label: "AUTO",                color: "text-green-400" },
  RUNNING_MANUAL:     { label: "MANUAL",              color: "text-yellow-400" },
  PAUSE_DOOR:         { label: "Pauza – Drzwi",       color: "text-yellow-400" },
  PAUSE_SENSOR:       { label: "Pauza – Czujnik",     color: "text-yellow-400" },
  PAUSE_OVERHEAT:     { label: "Przegrzanie!",        color: "text-red-400" },
  PAUSE_USER:         { label: "Pauza",               color: "text-yellow-400" },
  PAUSE_HEATER_FAULT: { label: "Awaria grzałki!",     color: "text-red-400" },
  ERROR_PROFILE:      { label: "Błąd profilu!",       color: "text-red-400" },
  SOFT_RESUME:        { label: "Wznawianie...",       color: "text-green-400" },
};

interface ProcessStatusProps {
  reading: SmokerReading;
  onCommand: (cmd: string, value?: number) => Promise<void>;
}

export function ProcessStatus({ reading, onCommand }: ProcessStatusProps) {
  const info     = STATE_LABELS[reading.process_state] || STATE_LABELS.IDLE;
  const isRunning = reading.process_state === "RUNNING_AUTO" || reading.process_state === "RUNNING_MANUAL";
  const isPaused  = reading.process_state.startsWith("PAUSE");
  const isIdle    = reading.process_state === "IDLE";
  const isAuto    = reading.process_state === "RUNNING_AUTO";
  const isAlert   = ["PAUSE_OVERHEAT","PAUSE_HEATER_FAULT","ERROR_PROFILE"].includes(reading.process_state);

  return (
    <div className="bg-gradient-card border border-gray-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-ember/15 text-ember">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-sm text-gray-400 font-medium">Status procesu</span>
        </div>
        <span className={`text-sm font-bold font-mono ${info.color} ${isRunning ? "animate-pulse" : ""}`}>
          ● {info.label}
        </span>
      </div>

      {isAlert && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
          ⚠ {info.label} — sprawdź wędzarnię przed wznowieniem
        </div>
      )}

      <div className="mb-3">
        <div className="text-lg font-bold text-white mb-0.5">
          {reading.step_name || (isIdle ? "Brak aktywnego procesu" : "Tryb manualny")}
        </div>
        <div className="text-sm text-gray-500">
          Krok {reading.current_step + 1} z {reading.step_count || "—"}
        </div>
      </div>

      {reading.step_count > 0 && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: reading.step_count }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < reading.current_step ? "bg-ember" :
              i === reading.current_step ? "bg-orange-400" : "bg-gray-700"
            }`} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Pozostało (krok)</div>
          <div className="text-xl font-bold font-mono text-ember">{formatTime(reading.step_time_remaining)}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">Czas całkowity</div>
          <div className="text-xl font-bold font-mono text-white">{formatTime(reading.total_time_elapsed)}</div>
        </div>
      </div>

      <div className="flex gap-2">
        {isIdle && (
          <button onClick={() => onCommand("start")}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg py-2.5 text-sm font-medium transition-colors">
            <Play className="w-4 h-4" /> Start
          </button>
        )}
        {isRunning && (
          <button onClick={() => onCommand("pause")}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg py-2.5 text-sm font-medium transition-colors">
            <Pause className="w-4 h-4" /> Pauza
          </button>
        )}
        {isPaused && (
          <button onClick={() => onCommand("resume")}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg py-2.5 text-sm font-medium transition-colors">
            <RotateCcw className="w-4 h-4" /> Wznów
          </button>
        )}
        {isAuto && (
          <button onClick={() => onCommand("next_step")}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg px-4 py-2.5 text-sm transition-colors"
            title="Następny krok">
            <SkipForward className="w-4 h-4" />
          </button>
        )}
        {!isIdle && (
          <button onClick={() => onCommand("stop")}
            className="flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg px-4 py-2.5 text-sm transition-colors"
            title="Stop">
            <Square className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
