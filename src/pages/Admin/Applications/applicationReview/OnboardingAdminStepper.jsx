export default function OnboardingAdminStepper({ activeStep = 1 }) {
  const steps = [
    { key: 1, label: "Review", icon: "person_search" },
    { key: 2, label: "Documents", icon: "description" },
    { key: 3, label: "Final", icon: "task_alt" },
  ];

  return (
    <div className="mb-12 relative">
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const isComplete = step.key < activeStep;
          const isActive = step.key === activeStep;
          const nodeClass = isComplete
            ? "bg-primary-container text-on-primary"
            : isActive
              ? "bg-primary text-white ring-4 ring-tertiary-fixed-dim/20"
              : "bg-surface-container text-on-surface-variant";

          return (
            <div key={step.key} className="contents">
              <div className="flex flex-col items-center z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${nodeClass}`}>
                  {isComplete ? (
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-bold font-headline uppercase tracking-widest ${
                    isActive || isComplete ? "text-primary" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div className={`flex-1 h-0.5 -mt-6 ${step.key < activeStep ? "bg-primary" : "bg-slate-200"}`} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
