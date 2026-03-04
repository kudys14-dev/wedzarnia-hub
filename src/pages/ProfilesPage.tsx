import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfiles";
import { ArrowLeft, Plus, Trash2, Edit2, Clock, ChevronRight } from "lucide-react";
import type { SmokerProfile } from "@/types";

export function ProfilesPage() {
  const navigate = useNavigate();
  const { profiles, loading, create, remove } = useProfiles();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const p = await create(newName.trim(), newDesc.trim(), []);
    setShowNew(false);
    setNewName("");
    setNewDesc("");
    navigate(`/profiles/${p.id}`);
  };

  const totalTime = (p: SmokerProfile) =>
    p.steps.reduce((sum, s) => sum + s.minTimeMs, 0);

  const formatDuration = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/")}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">Profile wędzenia</h1>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-ember/20 hover:bg-ember/30 text-ember rounded-lg px-3 py-2 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Nowy profil
        </button>
      </div>

      {showNew && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Nowy profil</h3>
          <input
            placeholder="Nazwa profilu"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full bg-gray-900 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 outline-none focus:border-ember mb-2"
          />
          <input
            placeholder="Opis (opcjonalnie)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            className="w-full bg-gray-900 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 outline-none focus:border-ember mb-3"
          />
          <div className="flex gap-2">
            <button onClick={handleCreate}
              className="flex-1 bg-ember/20 hover:bg-ember/30 text-ember rounded-lg py-2 text-sm font-medium transition-colors">
              Utwórz i edytuj kroki
            </button>
            <button onClick={() => setShowNew(false)}
              className="px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg py-2 text-sm transition-colors">
              Anuluj
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <div className="w-5 h-5 border-2 border-ember border-t-transparent rounded-full animate-spin mr-3" />
          Ładowanie...
        </div>
      )}

      <div className="space-y-3">
        {profiles.map(p => (
          <div key={p.id}
            className="bg-gradient-card border border-gray-700 hover:border-gray-600 rounded-xl p-4 flex items-center gap-4 group">
            <div className="flex-1 cursor-pointer" onClick={() => navigate(`/profiles/${p.id}`)}>
              <div className="font-semibold text-white">{p.name}</div>
              {p.description && <div className="text-sm text-gray-500 mt-0.5">{p.description}</div>}
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                <span>{p.steps.length} kroków</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {formatDuration(totalTime(p))}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => navigate(`/profiles/${p.id}`)}
                className="p-2 text-gray-500 hover:text-ember transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => remove(p.id)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-500 transition-colors" />
          </div>
        ))}

        {!loading && profiles.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p>Brak profili — utwórz pierwszy profil wędzenia</p>
          </div>
        )}
      </div>
    </div>
  );
}
