import { Wifi, WifiOff, Thermometer, Activity } from "lucide-react";
import type { Device, SmokerReading } from "@/types";
import { useNavigate } from "react-router-dom";

const STATE_COLORS: Record<string, string> = {
  IDLE:               "text-gray-400",
  RUNNING_AUTO:       "text-green-400",
  RUNNING_MANUAL:     "text-yellow-400",
  PAUSE_DOOR:         "text-yellow-400",
  PAUSE_USER:         "text-yellow-400",
  PAUSE_OVERHEAT:     "text-red-400",
  PAUSE_HEATER_FAULT: "text-red-400",
  ERROR_PROFILE:      "text-red-400",
  SOFT_RESUME:        "text-green-400",
};

const STATE_LABELS: Record<string, string> = {
  IDLE:               "Bezczynny",
  RUNNING_AUTO:       "AUTO",
  RUNNING_MANUAL:     "MANUAL",
  PAUSE_DOOR:         "Pauza – Drzwi",
  PAUSE_USER:         "Pauza",
  PAUSE_OVERHEAT:     "Przegrzanie!",
  PAUSE_HEATER_FAULT: "Awaria grzałki!",
  ERROR_PROFILE:      "Błąd profilu!",
  SOFT_RESUME:        "Wznawianie...",
  PAUSE_SENSOR:       "Pauza – Czujnik",
};

interface DeviceCardProps {
  device: Device;
  reading?: SmokerReading | null;
}

export function DeviceCard({ device, reading }: DeviceCardProps) {
  const navigate = useNavigate();
  const stateColor = STATE_COLORS[reading?.process_state || "IDLE"] || "text-gray-400";
  const stateLabel = STATE_LABELS[reading?.process_state || "IDLE"] || "Bezczynny";
  const isRunning  = reading?.process_state?.startsWith("RUNNING");

  return (
    <div
      onClick={() => navigate(`/device/${device.device_id}`)}
      className="bg-gradient-card border border-gray-700 hover:border-ember rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-ember/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{device.name || device.device_id}</h2>
          <p className="text-xs text-gray-500 font-mono">{device.device_id}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {device.is_online
            ? <Wifi className="w-5 h-5 text-green-400" />
            : <WifiOff className="w-5 h-5 text-gray-600" />
          }
          <span className="text-xs text-gray-500">{device.firmware_version || "—"}</span>
        </div>
      </div>

      {/* Status */}
      <div className={`text-sm font-bold mb-4 ${stateColor} ${isRunning ? "animate-pulse" : ""}`}>
        ● {stateLabel}
      </div>

      {/* Temperatury */}
      {reading ? (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">Komora 1</div>
            <div className="text-lg font-bold font-mono text-ember">{reading.t_chamber1.toFixed(1)}°</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">Komora 2</div>
            <div className="text-lg font-bold font-mono text-ember">{reading.t_chamber2.toFixed(1)}°</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <div className="text-xs text-gray-500 mb-1">Mięso</div>
            <div className="text-lg font-bold font-mono text-red-400">{reading.t_meat.toFixed(1)}°</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 text-sm py-4">
          {device.is_online ? "Ładowanie..." : "Brak danych"}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Activity className="w-3 h-3" />
          {reading ? `PID: ${reading.pid_output.toFixed(0)}%` : "—"}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Thermometer className="w-3 h-3" />
          Cel: {reading?.t_set ?? "—"}°C
        </div>
        <div className="text-xs text-gray-500">
          {reading?.wifi_rssi ? `${reading.wifi_rssi} dBm` : "—"}
        </div>
      </div>
    </div>
  );
}
