import { useParams, useNavigate } from "react-router-dom";
import { useDevice } from "@/hooks/useDevice";
import { useDevices } from "@/hooks/useDevices";
import { TempChart } from "@/components/TempChart";
import { ProcessStatus } from "@/components/ProcessStatus";
import { SystemStatus } from "@/components/SystemStatus";
import { ControlPanel } from "@/components/ControlPanel";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { updateDeviceName } from "@/services/api";
import { toast } from "sonner";

export function DeviceDashboard() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const { reading, history, loading, sendCommand } = useDevice(deviceId!);
  const { devices, reload: reloadDevices } = useDevices();
  const device = devices.find(d => d.device_id === deviceId);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const startEdit = () => {
    setNameInput(device?.name || deviceId || "");
    setEditingName(true);
  };

  const saveName = async () => {
    if (!deviceId || !nameInput.trim()) return;
    try {
      await updateDeviceName(deviceId, nameInput.trim());
      await reloadDevices();
      toast.success("Nazwa zaktualizowana");
    } catch {
      toast.error("Błąd zapisu nazwy");
    }
    setEditingName(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveName()}
                className="bg-gray-800 text-white rounded-lg px-3 py-1.5 text-lg font-bold border border-ember outline-none"
                autoFocus
              />
              <button onClick={saveName} className="p-1.5 text-green-400 hover:text-green-300"><Check className="w-5 h-5" /></button>
              <button onClick={() => setEditingName(false)} className="p-1.5 text-gray-500 hover:text-gray-400"><X className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{device?.name || deviceId}</h1>
              <button onClick={startEdit} className="p-1 text-gray-600 hover:text-gray-400 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-xs text-gray-500 font-mono">{deviceId}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          device?.is_online ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-500"
        }`}>
          {device?.is_online ? "● Online" : "○ Offline"}
        </div>
      </div>

      {loading && !reading && (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <div className="w-6 h-6 border-2 border-ember border-t-transparent rounded-full animate-spin mr-3" />
          Ładowanie...
        </div>
      )}

      {reading && (
        <>
          {/* Temperatury */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "Komora 1", value: reading.t_chamber1, color: "text-ember" },
              { label: "Komora 2", value: reading.t_chamber2, color: "text-yellow-400" },
              { label: "Mięso",   value: reading.t_meat,     color: "text-red-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gradient-card border border-gray-700 rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className={`text-3xl font-bold font-mono ${color}`}>{value.toFixed(1)}°</div>
                <div className="text-xs text-gray-600 mt-1">Cel: {reading.t_set}°C</div>
              </div>
            ))}
          </div>

          {/* Wykres */}
          <div className="mb-4">
            <TempChart history={history} />
          </div>

          {/* Status + System */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ProcessStatus reading={reading} onCommand={sendCommand} />
            <SystemStatus reading={reading} />
          </div>

          {/* Sterowanie */}
          <ControlPanel reading={reading} onCommand={sendCommand} />
        </>
      )}

      {!loading && !reading && (
        <div className="text-center py-16 text-gray-600">
          <p>Brak danych z urządzenia</p>
        </div>
      )}
    </div>
  );
}
