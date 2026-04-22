import ApplicationProcessStep from "./ApplicationProcessStep";

export default function FormSection({
  form,
  errors,
  jobs,
  jobsLoading,
  onChange,
  onFileChange,
  onJobChange,
  onRemoveResume,
  resumePreviewUrl,
  onSubmit,
  onSkillAdd,
  onSkillRemove,
  isPending,
  submitError,
}) {
  return (
    <div className="h-full overflow-hidden border-0 bg-white lg:border-l lg:border-outline-variant/15">
      <div className="p-6 md:p-8 xl:py-10">
        <header className="mb-6 border-b border-outline-variant/15 pb-5">
          <h2 className="font-headline text-xl font-bold tracking-tight text-primary md:text-2xl">Application process</h2>
          <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-on-surface-variant">
            Share your background and resume so we can match you with the right opportunities.
          </p>
        </header>
        <form action="#" className="space-y-8" onSubmit={onSubmit}>
          <ApplicationProcessStep
            form={form}
            errors={errors}
            jobs={jobs}
            jobsLoading={jobsLoading}
            onChange={onChange}
            onJobChange={onJobChange}
            onFileChange={onFileChange}
            onRemoveResume={onRemoveResume}
            resumePreviewUrl={resumePreviewUrl}
            onSkillAdd={onSkillAdd}
            onSkillRemove={onSkillRemove}
            isPending={isPending}
            submitError={submitError}
          />
        </form>
      </div>
    </div>
  );
}
