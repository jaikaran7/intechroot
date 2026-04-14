import ApplicationProcessStep from "./ApplicationProcessStep";

export default function FormSection({ form, errors, onChange, onFileChange, onSelectChange, onSubmit, onSkillAdd, onSkillRemove }) {
  return (
    <div className="glass-panel rounded-xl shadow-[0_40px_80px_-20px_rgba(0,6,21,0.08)] overflow-hidden">
      <div className="p-8 md:p-12">
        <form action="#" className="space-y-10" onSubmit={onSubmit}>
          <ApplicationProcessStep
            form={form}
            errors={errors}
            onChange={onChange}
            onSelectChange={onSelectChange}
            onFileChange={onFileChange}
            onSkillAdd={onSkillAdd}
            onSkillRemove={onSkillRemove}
          />
        </form>
      </div>
    </div>
  );
}
