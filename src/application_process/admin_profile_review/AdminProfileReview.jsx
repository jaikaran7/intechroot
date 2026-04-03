/** Converted from application_process/admin_profile_review/code.html — main canvas only (no duplicate shell nav). */

const candidateIdLabel = (app) => (app?.id != null ? `#ITR-${String(app.id).padStart(5, "0")}` : "#ITR-—");

export default function AdminProfileReview({ application, onApproveProfile }) {
  const app = application || {};
  const skills = Array.isArray(app.skills) ? app.skills : [];
  const tagSkills = skills.length ? skills.slice(0, 3) : ["Java", "Kubernetes", "AWS Certified"];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="mb-12 relative">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <div className="flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center ring-4 ring-surface shadow-lg">
              <span className="material-symbols-outlined text-xl">person_search</span>
            </div>
            <span className="mt-2 text-xs font-bold font-headline text-primary uppercase tracking-widest">Review</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 -mt-6" />
          <div className="flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center ring-4 ring-surface">
              <span className="material-symbols-outlined text-xl">description</span>
            </div>
            <span className="mt-2 text-xs font-medium font-headline text-slate-400 uppercase tracking-widest">Documents</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 -mt-6" />
          <div className="flex flex-col items-center z-10">
            <div className="w-10 h-10 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center ring-4 ring-surface">
              <span className="material-symbols-outlined text-xl">task_alt</span>
            </div>
            <span className="mt-2 text-xs font-medium font-headline text-slate-400 uppercase tracking-widest">Final</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Applicants</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-primary font-medium">Candidate ID: {candidateIdLabel(app)}</span>
          </nav>
          <h2 className="text-4xl font-extrabold font-headline text-primary tracking-tight">Applicant Profile Review</h2>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="px-6 py-3 border border-error text-error font-semibold rounded-lg hover:bg-error/5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">close</span> Reject
          </button>
          <button
            type="button"
            onClick={onApproveProfile}
            className="px-8 py-3 bg-primary-container text-on-primary font-bold rounded-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>{" "}
            Approve Profile
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-4 glass-panel rounded-xl p-8 shadow-sm">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              alt=""
              className="w-full h-full object-cover rounded-full shadow-inner ring-4 ring-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB89FvgcfMfH4edV5m7-8UfSlRGHvTH9StKfJSzowrqbfmwLf2Bcg-ZhkwAUFt1qnxUcC1RRuY5oh_JiHKYmafnPB6uIsDQOIGTFdNARgxVVX3IazPFR4rUDZEdnbe2UC85kz7o2AKhtHl5b8sqAtJaqqLjQFM--0u5VPy24fBa7KLqKOPRfUUp7rY7stVFV9n3zrL6gGEnEsTaz3ThwzstEme5XlJaVb7CKkageaMPZRNrozrBvxkblz-6SXL_mn4OyWv1D_I9oic2"
            />
            <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold font-headline text-primary">{app.name || "—"}</h3>
            <p className="text-secondary font-medium mt-1">{app.role || "—"}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {tagSkills.map((s) => (
                <span key={s} className="bg-surface-container-high px-3 py-1 rounded-full text-xs font-semibold text-primary">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">mail</span>
              <span className="text-slate-600">{app.email || "—"}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">location_on</span>
              <span className="text-slate-600">{app.location || "—"}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="material-symbols-outlined text-slate-400">calendar_month</span>
              <span className="text-slate-600">Applied: {app.appliedDate || "—"}</span>
            </div>
          </div>
        </div>
        <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">article</span> Executive Summary
            </h4>
            <p className="text-on-surface-variant leading-relaxed font-light text-lg">
              {app.experience
                ? String(app.experience)
                : "Highly accomplished professional seeking to leverage expertise at enterprise scale. Review application materials and interview notes before approval."}
            </p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Experience Highlights</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1 bg-secondary rounded-full" />
                <div>
                  <p className="font-bold text-primary">{app.role || "Current track"}</p>
                  <p className="text-sm text-slate-500">Application pipeline • Recent</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-slate-300 rounded-full" />
                <div>
                  <p className="font-bold text-primary">Supporting profile data</p>
                  <p className="text-sm text-slate-500">See documents tab after this step</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Automated Check Results</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span className="text-sm font-semibold text-green-800">Identity Verified</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded text-green-700 font-bold">MATCH</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <span className="text-sm font-semibold text-blue-800">Skills Assessment</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded text-blue-700 font-bold tracking-tighter">TOP 5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                    history_edu
                  </span>
                  <span className="text-sm font-semibold text-amber-800">Background Check</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded text-amber-700 font-bold">PENDING</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="group cursor-pointer relative overflow-hidden rounded-xl h-40 bg-slate-900 shadow-xl">
              <img
                alt=""
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZLjYn2Juy_OjRapw6H5lPrs03s9IlmHjKv3cxUwEVan09EXEX4oYe3cb4ueWdpuVVfeRr6AOFdjbhnwIdWo2z56eDrbDUdd63Fq7GAfyRgW8qblF2NbHjhczgE_oTYRkaMGc3cRJHlbcNy_EnxP-2ZVMahuGsZKMhSRmfdcDPHm3Bh2IbX_sI3Wa7GqvS0lRN40jo-PnHcx1u1KEl8hHTzhnHRenDmVnXVtKepVxYfc6v9pDjh6jsHWxJZiygMT14QG2zYjwLEx-D"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent p-4 flex flex-col justify-end">
                <p className="text-white text-xs font-bold uppercase">System Architecture</p>
                <p className="text-slate-300 text-[10px]">Portfolio artifact</p>
              </div>
            </div>
            <div className="group cursor-pointer relative overflow-hidden rounded-xl h-40 bg-slate-900 shadow-xl">
              <img
                alt=""
                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxbPBXL9Gdlih-LDVY5vGWDbnHM0i8g8AjwACQkeWSk_w9VMyO56aMmgcfKnLXKjkhmlxJ8jzU5ufkYWHag0v2QAo0Yu4YlnQ4sIteY1HAcvG0niu4QgYeePp0n6GSZbGXoG_-awQvZSDg_GWdVkbyuos2p3IM34GwkQ7MGsV5K5apoJTlGTcwOhQWHFZGOpyf5WtNwmCrCq8-TlXwUaZW_TgfX-rsF1OZ89-orzfUpAIejxhs_L5dXSshuRVVmeeJHCAD564F7Fvu"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent p-4 flex flex-col justify-end">
                <p className="text-white text-xs font-bold uppercase">Impact Metrics</p>
                <p className="text-slate-300 text-[10px]">Supporting materials</p>
              </div>
            </div>
            <div className="bg-secondary-container rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-lg">
              <span className="material-symbols-outlined text-4xl text-on-secondary-container mb-2">attachment</span>
              <p className="font-bold text-on-secondary-container">View Full CV</p>
              <p className="text-[10px] text-on-secondary-container/70 mt-1 uppercase font-bold">Resume on file</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 bg-surface-container-high/50 p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary">sticky_note_2</span>
          <h4 className="font-headline font-bold text-primary">Internal Admin Notes</h4>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-secondary">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-primary">HR Specialist</span>
              <span className="text-[10px] text-slate-400">Internal</span>
            </div>
            <p className="text-sm text-slate-600">
              Initial screening complete. Use Approve Profile when satisfied with identity and summary alignment.
            </p>
          </div>
          <div className="relative">
            <textarea
              className="w-full rounded-xl border-none shadow-inner bg-surface-container-low p-4 text-sm focus:ring-2 focus:ring-tertiary-fixed-dim transition-all min-h-[100px]"
              placeholder="Add internal review notes here..."
              readOnly
            />
            <button
              type="button"
              className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <span className="material-symbols-outlined text-sm">send</span> Post Note
            </button>
          </div>
        </div>
      </div>
      <div className="h-10" />
    </div>
  );
}
