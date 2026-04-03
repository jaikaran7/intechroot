import PersonalInfo from "./PersonalInfo";
import ReviewSection from "./ReviewSection";
import UploadSection from "./UploadSection";
import SubmitSection from "./SubmitSection";

export default function FormSection({ form, errors, onChange, onFileChange, onSelectChange, onSubmit }) {
  return (
    <div className="glass-panel rounded-xl shadow-[0_40px_80px_-20px_rgba(0,6,21,0.08)] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="md:col-span-4 bg-primary-container p-8 md:p-12 text-on-primary flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <img
              className="w-full h-full object-cover"
              alt="abstract geometric network lines in deep navy and blue representing global connectivity and data flow"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHYNTSeGw3TIRlZgncP3iwfdcGoM-rw2B0bL91P0VlX-JaelPAIuEnfHs4Xqnra0Y2gOcYd3-dXxXOYgkpwFavWaGdQ1ZgmmBrvoteUsQwtxMIFyO-OiRyY8k0dstjjK2_6XEbt2gCHlqAWGold0YKYXFJQHTEIfSVZWH1o0S3tw6LW-UaSI9kY2gQDRFktaPnjDJdw4bNwtuM96hTewNZ8BsM94_CQpzz3h6Ql3rzSlQsJKaILndjTO1OGeBbMsBXf1clfO4FehM5"
            />
          </div>
          <div className="relative z-10">
            <h3 className="font-headline font-bold text-xl mb-8 tracking-tight">Application Progress</h3>
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-tertiary-fixed flex items-center justify-center bg-tertiary-fixed text-on-tertiary-fixed font-bold text-xs">01</div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-tertiary-fixed">Personal Identity</p>
                  <p className="text-[10px] text-on-primary-container">Basic Information</p>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center font-bold text-xs">02</div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold">Expertise &amp; Experience</p>
                  <p className="text-[10px]">Professional Portfolio</p>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <div className="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center font-bold text-xs">03</div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold">Strategic Alignment</p>
                  <p className="text-[10px]">Value Assessment</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 p-4 bg-white/5 rounded-lg border border-white/10 relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-tertiary-fixed text-sm">lock</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Transmission</span>
            </div>
            <p className="text-[10px] text-on-primary-container/80 leading-relaxed">Your data is encrypted using AES-256 protocols and handled in strict compliance with GDPR guidelines.</p>
          </div>
        </div>
        <div className="md:col-span-8 p-8 md:p-12">
          <form action="#" className="space-y-10" onSubmit={onSubmit}>
            <PersonalInfo form={form} errors={errors} onChange={onChange} />
            <ReviewSection form={form} onSelectChange={onSelectChange} />
            <UploadSection onFileChange={onFileChange} errors={errors} />
            <SubmitSection />
          </form>
        </div>
      </div>
    </div>
  );
}
