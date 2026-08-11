const stages = [
  ["01", "Discover"],
  ["02", "Set the boundary"],
  ["03", "Try the workflow"],
  ["04", "Break it safely"],
  ["05", "Hand it back"],
] as const;

export function WorkflowRail({
  activeStage,
  onSelect,
}: {
  activeStage: number;
  onSelect: (stage: number) => void;
}) {
  return (
    <nav className="workflow-rail" aria-label="Lab stages">
      {stages.map(([number, label], index) => (
        <button
          key={label}
          className={activeStage === index ? "stage-button stage-button-active" : "stage-button"}
          onClick={() => onSelect(index)}
          aria-current={activeStage === index ? "step" : undefined}
        >
          <span className="stage-number">{number}</span>
          <span>{label}</span>
          <span className="stage-state" aria-hidden="true">
            {index < activeStage ? "✓" : ""}
          </span>
        </button>
      ))}
    </nav>
  );
}
