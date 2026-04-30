"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Competency } from "@/lib/course-schema";

const storageKey = "sre-learning-progress";
const updateEvent = "sre-learning-progress-updated";

export interface DrillAttemptRecord {
  title: string;
  score: number;
  maxScore: number;
  attempts: number;
  competencies: Competency[];
  updatedAt: string;
}

export interface LearningProgressState {
  completedModules: string[];
  drillResults: Record<string, DrillAttemptRecord>;
}

const emptyState: LearningProgressState = {
  completedModules: [],
  drillResults: {},
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function readLearningProgress(): LearningProgressState {
  if (!isBrowser()) {
    return emptyState;
  }

  const rawValue = window.localStorage.getItem(storageKey);
  if (!rawValue) {
    return emptyState;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<LearningProgressState>;
    return {
      completedModules: Array.isArray(parsed.completedModules)
        ? parsed.completedModules.filter((value): value is string => typeof value === "string")
        : [],
      drillResults: parsed.drillResults && typeof parsed.drillResults === "object" ? parsed.drillResults : {},
    };
  } catch {
    return emptyState;
  }
}

function writeLearningProgress(nextState: LearningProgressState) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(nextState));
  window.dispatchEvent(new Event(updateEvent));
}

export function useLearningProgress() {
  const [state, setState] = useState<LearningProgressState>(() => readLearningProgress());

  useEffect(() => {
    const handleUpdate = () => {
      setState(readLearningProgress());
    };

    window.addEventListener(updateEvent, handleUpdate);
    return () => {
      window.removeEventListener(updateEvent, handleUpdate);
    };
  }, []);

  const setModuleCompleted = useCallback((slug: string, completed: boolean) => {
    const currentState = readLearningProgress();
    const completedModules = completed
      ? Array.from(new Set([...currentState.completedModules, slug]))
      : currentState.completedModules.filter((value) => value !== slug);

    writeLearningProgress({
      ...currentState,
      completedModules,
    });
  }, []);

  const recordDrillResult = useCallback(
    (id: string, payload: Omit<DrillAttemptRecord, "attempts" | "updatedAt">) => {
      const currentState = readLearningProgress();
      const previous = currentState.drillResults[id];

      const nextRecord: DrillAttemptRecord = {
        ...payload,
        score: previous ? Math.max(previous.score, payload.score) : payload.score,
        maxScore: payload.maxScore,
        attempts: previous ? previous.attempts + 1 : 1,
        competencies: payload.competencies,
        updatedAt: new Date().toISOString(),
      };

      writeLearningProgress({
        ...currentState,
        drillResults: {
          ...currentState.drillResults,
          [id]: nextRecord,
        },
      });
    },
    [],
  );

  const completedModuleSet = useMemo(() => new Set(state.completedModules), [state.completedModules]);

  return {
    state,
    completedModuleSet,
    setModuleCompleted,
    recordDrillResult,
  };
}
