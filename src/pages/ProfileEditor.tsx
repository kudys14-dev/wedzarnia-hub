import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProfile } from "@/services/api";
import { useProfiles } from "@/hooks/useProfiles";
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from "lucide-react";
import type { ProfileStep, SmokerProfile } from "@/types";
import { toast } from "sonner";

const DEFAULT_STEP: ProfileStep = {
  name: "Nowy krok", tSet: 70, tMeatTarget: 0, minTimeMs: 3600000,
  powerMode: 2, smokePwm: 0, fanMode: 1, fanOnTime: 10000,
  fanOffTime: 60000, useMeatTemp: false,
};

export function ProfileEditor() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { update } = useProfiles();

  const [profile, setProfile] = useState<SmokerProfile | null>(null);
  const [steps, setSteps] = useState<ProfileStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!profileId) return;
    fetchProfile(profileId).then(p => {
      setProfile(p);
      setSteps(p.steps);
      setLoading(false);
    }).catch(() => { toast.error("Błąd ładowania profilu"); setLoading(false); });
  }, [profileId]);

  const save = async () => {
    if (!profileId) return;
    setSaving(true);
    try {
      await update(profileId, { steps });
      toast.success("Profil zapisany");
    } catch {
      toast.error("Błąd zapisu");
    }
    setSaving(false);
  };

  const addStep = () => {
    setSteps(prev => [...prev, { ...DEFAULT_STEP }]);
    setSelected(steps.length);
  };

  const removeStep = (i: number) => {
    setSteps(prev => prev.filter((_, idx) => idx !== i));
    setSelected(Math.max(0, selected - 1));
  };

  const updateStep = (i: number, field: keyof ProfileStep, value: unknown) => {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  const step = steps[selected];

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-500">
      <div className="w-6 h-6 border-2 border-ember border-t-transparent rounded-full animate-spin mr-3" />
      Ładowanie...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/profiles")}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">{profile?.name}</h1>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-ember/20 hover:bg-ember/30 text-ember rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Zapisywanie..." : "Zapisz"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lista kroków */}
        <div className="md:col-span-1">
          <div className="bg-gradient-card border border-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400">Kroki ({steps.length})</h3>
              <button onClick={addStep}
                className="p-1.5 bg-ember/20 hover:bg-ember/30 text-ember rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {steps.map((s, i) => (
                <div key={i}
                  onClick={() => setSelected(i)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-colors ${
                    selected === i ? "bg-ember/20 border border-ember/30" : "hover:bg-gray-800 border border-transparent"
                  }`}>
                  <GripVertical className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.tSet}°C • {Math.round(s.minTimeMs/60000)}min</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); removeStep(i); }}
                    className="p-1 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {steps.length === 0 && (
                <div className="text-center py-6 text-gray-600 text-sm">Brak kroków</div>
              )}
            </div>
          </div>
        </div>

        {/* Edytor kroku */}
        <div className="md:col-span-2">
          {step ? (
            <div className="bg-gradient-card border border-gray-700 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-medium text-gray-400">Krok {selected + 1}</h3>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nazwa</label>
                <input value={step.name}
                  onChange={e => updateStep(selected, "name", e.target.value)}
                  className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 outline-none focus:border-ember"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Temperatura (°C)</label>
                  <input type="number" min={30} max={120}
                    value={step.tSet}
                    onChange={e => updateStep(selected, "tSet", parseFloat(e.target.value))}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 outline-none focus:border-ember font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Czas (minuty)</label>
                  <input type="number" min={1}
                    value={Math.round(step.minTimeMs / 60000)}
                    onChange={e => updateStep(selected, "minTimeMs", parseInt(e.target.value) * 60000)}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 outline-none focus:border-ember font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Moc grzania</label>
                <div className="flex gap-2">
                  {[1,2,3].map(pm => (
                    <button key={pm}
                      onClick={() => updateStep(selected, "powerMode", pm)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                        step.powerMode === pm ? "bg-ember text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                      }`}>{pm}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Wentylator</label>
                <div className="flex gap-2">
                  {[{v:0,l:"OFF"},{v:1,l:"ON"},{v:2,l:"Cykl"}].map(({v,l}) => (
                    <button key={v}
                      onClick={() => updateStep(selected, "fanMode", v)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        step.fanMode === v ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-400"
                      }`}>{l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 flex justify-between">
                  <span>Dymogenerator PWM</span>
                  <span className="text-ember font-mono">{step.smokePwm}/255</span>
                </label>
                <input type="range" min={0} max={255} step={5}
                  value={step.smokePwm}
                  onChange={e => updateStep(selected, "smokePwm", parseInt(e.target.value))}
                  className="w-full accent-ember"
                />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox"
                  checked={step.useMeatTemp}
                  onChange={e => updateStep(selected, "useMeatTemp", e.target.checked)}
                  className="accent-ember"
                />
                <label className="text-sm text-gray-300">Zakończ krok po osiągnięciu temperatury mięsa</label>
              </div>

              {step.useMeatTemp && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Temperatura mięsa docelowa (°C)</label>
                  <input type="number" min={40} max={90}
                    value={step.tMeatTarget}
                    onChange={e => updateStep(selected, "tMeatTarget", parseFloat(e.target.value))}
                    className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 outline-none focus:border-ember font-mono"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gradient-card border border-gray-700 rounded-xl p-8 text-center text-gray-600">
              Wybierz krok lub dodaj nowy
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
