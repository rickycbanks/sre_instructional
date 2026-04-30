'use client';

import DecisionDrill from "@/components/DecisionDrill";

interface ScenarioSimulatorProps {
  drillId?: "observability-debugging" | "behavioral-postmortem";
}

export default function ScenarioSimulator({ drillId = "observability-debugging" }: ScenarioSimulatorProps) {
  return <DecisionDrill drillId={drillId} />;
}
