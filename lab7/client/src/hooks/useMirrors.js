import { useCallback, useEffect, useState } from "react";
import {
  fetchMirrors,
  fetchMirrorSelection,
  saveMirrorSelection,
} from "../api/mirrors";

export function useMirrors(titleId, canPersist) {
  const [mirrors, setMirrors] = useState([]);
  const [selectedMirrorId, setSelectedMirrorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchMirrors();
        if (!active) return;

        setMirrors(Array.isArray(list) ? list : []);

        let id = list?.[0]?.id || null;

        if (canPersist && titleId) {
          try {
            const selection = await fetchMirrorSelection(titleId);
            if (selection?.mirrorId) id = selection.mirrorId;
          } catch {
            // Fall back to the first mirror if selection cannot be loaded.
          }
        }

        if (active) setSelectedMirrorId(id);
      } catch (err) {
        if (active) {
          setMirrors([]);
          setError(err.message || "Не вдалося завантажити список зеркал");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [titleId, canPersist]);

  const selectMirror = useCallback(
    async (mirrorId) => {
      setSelectedMirrorId(mirrorId);
      setError(null);

      if (!canPersist || !titleId) return;

      try {
        await saveMirrorSelection(titleId, mirrorId);
      } catch (err) {
        setError(err.message || "Не вдалося зберегти вибір зеркала");
      }
    },
    [canPersist, titleId],
  );

  const selectedMirror =
    mirrors.find((mirror) => mirror.id === selectedMirrorId) || mirrors[0] || null;

  return {
    mirrors,
    selectedMirror,
    selectedMirrorId,
    selectMirror,
    loading,
    error,
  };
}
