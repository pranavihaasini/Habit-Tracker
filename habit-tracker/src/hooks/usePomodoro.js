import { useState, useEffect, useCallback } from "react";

export function usePomodoro() {
  const [sessions, setSessions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ht_pomo") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ht_pomo", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback(() => {
    setSessions((prev) => [...prev, new Date().toDateString()]);
  }, []);

  return { sessions, addSession };
}
