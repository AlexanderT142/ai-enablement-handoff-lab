import type { ScenarioMode } from "@/lib/contracts";

export type RawSourceNote = {
  id: `SRC-${string}`;
  time: string;
  author: string;
  text: string;
  status?: "departed" | "held";
  confirmedEta?: string;
};

const baseSources: RawSourceNote[] = [
  {
    id: "SRC-01",
    time: "08:42",
    author: "Depot scanner",
    text: "Item DX-4821 arrived at North Harbour depot and was scanned into delivery route R-17.",
  },
  {
    id: "SRC-02",
    time: "09:05",
    author: "Dispatch controller",
    text: "The weather hold has cleared. The delivery window is confirmed for 2:00-4:00 pm today.",
    confirmedEta: "2:00-4:00 pm today",
  },
  {
    id: "SRC-03",
    time: "09:18",
    author: "Courier app",
    text: "Route R-17 departed at 09:16. Packaging check recorded no visible damage.",
    status: "departed",
  },
];

export function getScenarioSources(mode: ScenarioMode): RawSourceNote[] {
  const sources = baseSources.map((source) => ({ ...source }));

  if (mode === "missing_eta") {
    sources[1] = {
      ...sources[1],
      text: "The weather hold has cleared. A customer delivery window has not yet been confirmed.",
      confirmedEta: undefined,
    };
  }

  if (mode === "conflicting_status") {
    sources.push({
      id: "SRC-04",
      time: "09:22",
      author: "Depot board",
      text: "Item DX-4821 is held for address verification and must not leave the depot.",
      status: "held",
    });
  }

  if (mode === "sensitive_information") {
    sources.push({
      id: "SRC-04",
      time: "09:21",
      author: "Dispatcher note",
      text: "Customer name: Hana Rangi. Phone: 021 555 0184. Gate code 4819.",
    });
  }

  return sources;
}
