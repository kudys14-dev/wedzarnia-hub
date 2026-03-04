import { Zap } from "lucide-react";
import type { SmokerReading } from "@/types";

interface SystemStatusProps {
  reading: SmokerReading;
}

export function SystemStatus({ reading }: SystemStatusProps) {
  return (
    <div className="bg-gradient-card border border-gray-700 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-ember/15 text-ember">
          <Zap className="w-4 h-4" />
        </div>
        <span className="text-sm text-gray-400 font-medium">Wyjścia / System</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Grzałki</span>
          <div className="flex gap-1.5">
            {[reading.heater1, reading.heater2, reading.heater3].map((h, i) => (
              <span key={i} className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                h ? "bg-ember text-white" : "bg-gray-800 text-gray-600"
              }`}>{i+1}</span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">PID</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-ember rounded-full transition-all" style={{ width: `${reading.pid_output}%` }} />
            </div>
            <span className="text-sm font-mono text-ember w-10 text-right">{reading.pid_output.toFixed(0)}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Wentylator</span>
          <span className={`text-sm font-medium px-2 py-0.5 rounded ${
            reading.fan_on ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-gray-500"
          }`}>{reading.fan_on ? "ON" : "OFF"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Dymogenerator</span>
          <span className="text-sm font-mono text-gray-300">PWM: {reading.smoke_pwm}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Drzwi</span>
          <span className={`text-sm font-medium px-2 py-0.5 rounded ${
            reading.door_open ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
          }`}>{reading.door_open ? "OTWARTE" : "Zamknięte"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Moc grzania</span>
          <div className="flex gap-1">
            {[1,2,3].map(i => (
              <div key={i} className={`w-4 h-4 rounded-sm ${i <= reading.power_mode ? "bg-ember" : "bg-gray-800"}`} />
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">WiFi</span>
            <span className="text-green-400 font-mono">{reading.wifi_rssi} dBm</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Firmware</span>
            <span className="text-gray-400 font-mono">{reading.firmware_version}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Uptime</span>
            <span className="text-gray-400 font-mono">{Math.floor(reading.uptime/3600)}h {Math.floor((reading.uptime%3600)/60)}m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
