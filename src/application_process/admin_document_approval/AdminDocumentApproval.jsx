/** Converted from application_process/admin_document_approval/code.html — content area only. */

const candidateIdLabel = (app) => (app?.id != null ? `#ITR-${String(app.id).padStart(5, "0")}` : "#ITR-—");

export default function AdminDocumentApproval({ application, onApproveDocuments }) {
  const app = application || {};

  return (
    <div className="p-10 max-w-7xl mx-auto w-full">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-2 block">Application ID: {candidateIdLabel(app)}</span>
          <h1 className="text-4xl font-extrabold text-primary tracking-tight mb-4">Onboarding: {app.name || "Candidate"}</h1>
          <p className="text-on-surface-variant leading-relaxed">
            {app.role || "Role"} — Document verification stage for final approval and compliance clearing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                check
              </span>
            </div>
            <span className="text-[10px] font-bold mt-2 text-primary/40 uppercase">Identity</span>
          </div>
          <div className="w-12 h-[2px] bg-primary mb-6" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-xl ring-4 ring-tertiary-fixed-dim/20">
              <span className="text-sm font-bold">02</span>
            </div>
            <span className="text-[10px] font-bold mt-2 text-primary uppercase">Documents</span>
          </div>
          <div className="w-12 h-[2px] bg-surface-container-highest mb-6" />
          <div className="flex flex-col items-center opacity-40">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
              <span className="text-sm font-bold">03</span>
            </div>
            <span className="text-[10px] font-bold mt-2 uppercase">Vetting</span>
          </div>
          <div className="w-12 h-[2px] bg-surface-container-highest mb-6" />
          <div className="flex flex-col items-center opacity-40">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
              <span className="text-sm font-bold">04</span>
            </div>
            <span className="text-[10px] font-bold mt-2 uppercase">Signed</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-9 bg-surface-container-lowest shadow-[0_40px_40px_-15px_rgba(11,31,58,0.04)] overflow-hidden">
          <div className="px-8 py-6 border-b border-surface-container flex justify-between items-center bg-surface-container-low/30">
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">description</span>
              Required Documentation
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Request New Document
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Document Name</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Submitted</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant">Status</th>
                  <th className="px-8 py-4 text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <tr className="hover:bg-surface-container-low/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined">picture_as_pdf</span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm">Passport_Final.pdf</p>
                        <p className="text-xs text-on-surface-variant">Government Issued ID</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">—</td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 uppercase tracking-tighter">
                      Pending Review
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1">
                      <button type="button" className="p-2 text-on-primary-container hover:bg-primary-container hover:text-white rounded transition-colors" title="View">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button type="button" className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve">
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                      </button>
                      <button type="button" className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
                        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                          cancel
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr className="bg-surface-container-low/30 hover:bg-surface-container-low/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary text-sm">Signed_NDA_V2.pdf</p>
                        <p className="text-xs text-on-surface-variant">Legal Compliance</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">—</td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-800 uppercase tracking-tighter">Approved</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-40">
                      <button type="button" className="p-2 text-on-primary-container hover:bg-primary-container hover:text-white rounded transition-colors" title="View">
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button type="button" className="p-2 cursor-not-allowed" disabled>
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </button>
                      <button type="button" className="p-2 cursor-not-allowed" disabled>
                        <span className="material-symbols-outlined text-lg">cancel</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-8 py-4 bg-surface-container-low flex justify-between items-center text-xs text-on-surface-variant font-medium">
            <p>Showing 4 of 4 documents</p>
            <div className="flex gap-4">
              <button type="button" className="opacity-50" disabled>
                Previous
              </button>
              <button type="button" className="text-primary font-bold">
                1
              </button>
              <button type="button" className="opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="bg-surface-container-lowest/70 backdrop-blur-md p-6 border border-outline-variant/15 shadow-[0_40px_40px_-15px_rgba(11,31,58,0.04)]">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-secondary mb-4">Verification Health</h3>
            <div className="relative h-2 w-full bg-surface-container rounded-full mb-6 overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-secondary to-tertiary-fixed-dim w-1/4" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Approved</span>
                <span className="text-xs font-bold text-primary">1 / 4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Pending Review</span>
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-on-surface-variant">Rejections</span>
                <span className="text-xs font-bold text-error">1</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onApproveDocuments}
              className="w-full mt-8 py-3 bg-primary text-on-primary text-[10px] font-extrabold uppercase tracking-widest active:scale-95 transition-all"
            >
              Complete Step 02
            </button>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant/10 p-1">
            <img
              alt="Candidate"
              className="w-full h-32 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYPTWLaomyvdp1M1yMwr12TU5L9Y9GUDS9gyCzIHRwQRLDF5mHTigvO0expu6nyqivxHYmpzz1a6CLGpHQnphfXAKMf8_OgdaQGQyUFwdGW5v2eGKJPSytmDn8exsRyfO9xP0nR_H_1Nc8Di71R2ZkpeO_b_kQpfAunxhvL2kOt0aF1ZBkNuFoj23UPfH1unOlmCcVuZyO6_Tc_sPcrOKzu1dnD8md5nzsp5uvjjqwzKjr5gzSHQnt3O1-yx9-96WUm4LloAMx3kAO"
            />
            <div className="p-4">
              <p className="text-xs font-bold text-primary">{app.name || "—"}</p>
              <p className="text-[10px] text-on-surface-variant">{app.email || "—"}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-[8px] font-bold px-1.5 py-0.5 bg-surface-container-high rounded-sm text-on-surface-variant uppercase">
                  {app.role || "Role"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-error-container/20 p-5 border-l-4 border-error">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
              <div>
                <p className="text-xs font-bold text-on-error-container">Incomplete Vetting</p>
                <p className="text-[10px] text-on-error-container/80 mt-1 leading-normal">
                  Review outstanding items before completing this step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.25em] text-primary mb-8 border-b border-surface-container pb-4">Audit & Activity Log</h3>
        <div className="space-y-0">
          <div className="flex gap-6 py-6 border-b border-surface-container hover:bg-surface-container-low/40 px-4 transition-colors">
            <span className="text-[10px] font-bold text-on-surface-variant w-24 shrink-0 mt-1">Today</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">
                Document verification in progress for <span className="font-semibold text-primary">{app.name}</span>
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Workflow: onboarding admin step 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
