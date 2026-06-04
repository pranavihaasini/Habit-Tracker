import { useState, useEffect } from "react";
import { todayKey, dateKey } from "../utils/dates";

export function useHabits() {
  const [habits, setHabits] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ht_v2") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ht_v2", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (name, icon, color, category) => {
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        icon,
        color,
        category: category || "Personal",
        completions: {},
        notes: {},
        streak: 0,
      },
    ]);
  };

  const toggleHabit = (id) => {
    const today = todayKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        const comps = { ...(h.completions || {}) };
        const wasCompleted = comps[today];

        if (wasCompleted) {
          delete comps[today];
        } else {
          comps[today] = true;
        }

        // recalculate streak
        let streak = 0;
        const d = new Date();
        const checkComps = wasCompleted ? comps : { ...comps, [today]: true };

        while (true) {
          const k = dateKey(d);
          if (checkComps[k]) {
            streak++;
            d.setDate(d.getDate() - 1);
          } else {
            break;
          }
        }

        return { ...h, completions: comps, completed: !wasCompleted, streak };
      })
    );
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const saveNote = (id, note) => {
    const today = todayKey();
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, note, notes: { ...(h.notes || {}), [today]: note } }
          : h
      )
    );
  };

  return { habits, addHabit, toggleHabit, deleteHabit, saveNote };
}
