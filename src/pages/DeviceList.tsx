import { useDevices } from "@/hooks/useDevices";
import { useDevice } from "@/hooks/useDevice";
import { DeviceCard } from "@/components/DeviceCard";
import { Flame, RefreshCw } from "lucide-react";
import type { Device } from "@/types";

function DeviceCardWrapper({ device }: { device: Device }) {
  const { reading } = useDevice(device.device_id);
  return <DeviceCard device={device} reading={reading} />;
}

export function DeviceList() {
  const { devices, loading, error, reload } = useDevices();

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-ember/20 text-ember">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Wędzarnia Hub</h1>
            <p className="text-sm text-gray-500">Zarządzanie wędzarniami</p>
          </div>
        </div>
        <button onClick={reload}
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors">
          <RefreshCw className="w-4 h-4" /> Odśwież
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <div className="w-6 h-6 border-2 border-ember border-t-transparent rounded-full animate-spin mr-3" />
          Ładowanie urządzeń...
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-4">
          Błąd: {error}
        </div>
      )}

      {!loading && devices.length === 0 && (
        <div className="text-center py-16 text-gray-600">
          <Flame className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Brak urządzeń</p>
          <p className="text-sm mt-2">Uruchom ESP32 — zostanie zarejestrowany automatycznie</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map(d => <DeviceCardWrapper key={d.device_id} device={d} />)}
      </div>

      <footer className="mt-8 text-center text-xs text-gray-600 pb-4">
        Wędzarnia Hub • Multi-device smoker control
      </footer>
    </div>
  );
}
