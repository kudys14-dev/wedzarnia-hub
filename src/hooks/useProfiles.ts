import { useState, useEffect, useCallback } from "react";
import { fetchProfiles, createProfile, updateProfile, deleteProfile } from "@/services/api";
import type { SmokerProfile } from "@/types";
import { toast } from "sonner";

export function useProfiles() {
  const [profiles, setProfiles] = useState<SmokerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchProfiles();
      setProfiles(data);
    } catch (e) {
      toast.error("Błąd ładowania profili");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (
    name: string, description: string, steps: SmokerProfile["steps"]
  ) => {
    const p = await createProfile(name, description, steps);
    setProfiles(prev => [p, ...prev]);
    toast.success("Profil utworzony");
    return p;
  }, []);

  const update = useCallback(async (id: string, data: Partial<SmokerProfile>) => {
    const p = await updateProfile(id, data);
    setProfiles(prev => prev.map(x => x.id === id ? p : x));
    toast.success("Profil zaktualizowany");
    return p;
  }, []);

  const remove = useCallback(async (id: string) => {
    await deleteProfile(id);
    setProfiles(prev => prev.filter(x => x.id !== id));
    toast.success("Profil usunięty");
  }, []);

  return { profiles, loading, reload: load, create, update, remove };
}
