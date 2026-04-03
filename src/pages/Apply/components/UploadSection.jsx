export default function UploadSection({ onFileChange, errors }) {
  return (
    <div className="p-6 rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low/50 hover:bg-surface-container-low hover:border-secondary/40 transition-all group cursor-pointer text-center">
      <input className="hidden" id="resume" type="file" onChange={onFileChange} />
      <label className="cursor-pointer" htmlFor="resume">
        <span className="material-symbols-outlined text-4xl text-on-primary-container mb-4 group-hover:scale-110 transition-transform block">cloud_upload</span>
        <p className="font-headline font-bold text-sm text-primary">Upload Executive CV or Portfolio</p>
        <p className="text-[10px] text-on-surface-variant mt-1">PDF, DOCX up to 15MB. Encrypted storage.</p>
      </label>
      {errors.resume ? <p className="text-[10px] text-error mt-3">{errors.resume}</p> : null}
    </div>
  );
}
