import { useState } from "react";
import { Thermometer, Flame, Wind, CloudFog } from "lucide-react";
import type { SmokerReading } from "@/types";

interface ControlPanelProps {
  reading: SmokerReading;
  onCommand: (cmd: string, value?: number) => Promise<void>;
}

export function ControlPanel({ reading, onCommand }: ControlPanelProps) {
  const [tempInput, setTempInput] = useState(String(Math.round(reading.t_set)));
  const [smokeInput, setSmokeInput] = useState(String(reading.smoke_pwm));

  return (
    <div className="bg-gradient-card border border-gray-700 rounded-xl p-5 space-y-5">
      <h3 className="text-sm font-medium text-gray-400">Sterowanie</h3>

      {/* Temperatura */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500">
          <Thermometer className="w-3.5 h-3.5" /> Temperatura docelowa (°C)
        </div>
        <div className="flex gap-2 mb-2">
          <input
            type="number" min={30} max={120}
            value={tempInput}
            onChange={e => setTempInput(e.target.value)}
            className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:border-ember outline-none font-mono"
          />
          <button
            onClick={() => onCommand("set_temp", parseFloat(tempInput))}
            className="bg-ember/20 hover:bg-ember/30 text-ember rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >Ustaw</button>
        </div>
        <div className="flex gap-1.5">
          {[50, 60, 70, 80, 90].map(t => (
            <button key={t}
              onClick={() => { setTempInput(String(t)); onCommand("set_temp", t); }}
              className={`flex-1 py-1 rounded-md text-xs font-mono transition-colors ${
                Math.round(reading.t_set) === t ? "bg-ember text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-400"
              }`}
            >{t}°</button>
          ))}
        </div>
      </div>

      {/* Moc grzałek */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500">
          <Flame className="w-3.5 h-3.5" /> Moc grzania
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map(pm => (
            <button key={pm}
              onClick={() => onCommand("set_power", pm)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                reading.power_mode === pm ? "bg-ember text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-400"
              }`}
            >{pm}</button>
          ))}
        </div>
      </div>

      {/* Wentylator */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500">
          <Wind className="w-3.5 h-3.5" /> Wentylator
        </div>
        <div className="flex gap-2">
          {[{v:0,l:"OFF"},{v:1,l:"ON"},{v:2,l:"Cykl"}].map(({v,l}) => (
            <button key={v}
              onClick={() => onCommand("set_fan", v)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                reading.fan_mode === v ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-400"
              }`}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Dymogenerator */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <CloudFog className="w-3.5 h-3.5" /> Dymogenerator
          </div>
          <span className="text-xs font-mono text-ember">{smokeInput}/255</span>
        </div>
        <input
          type="range" min={0} max={255} step={5}
          value={smokeInput}
          onChange={e => setSmokeInput(e.target.value)}
          onMouseUp={() => onCommand("set_smoke", parseInt(smokeInput))}
          onTouchEnd={() => onCommand("set_smoke", parseInt(smokeInput))}
          className="w-full accent-ember mb-2"
        />
        <div className="flex gap-1.5">
          {[0,64,128,192,255].map(v => (
            <button key={v}
              onClick={() => { setSmokeInput(String(v)); onCommand("set_smoke", v); }}
              className={`flex-1 py-1 rounded-md text-xs font-mono transition-colors ${
                parseInt(smokeInput) === v ? "bg-ember text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-400"
              }`}
            >{v===0?"OFF":v===255?"MAX":v}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
