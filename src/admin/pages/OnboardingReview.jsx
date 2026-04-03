import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function OnboardingReview() {
  const navigate = useNavigate();
  return (
    <>
<AdminSidebar />

<main className="ml-64 min-h-screen relative">

<header className="fixed top-0 right-0 left-64 h-16 bg-white/60 backdrop-blur-xl z-40 border-b border-slate-200/15 flex items-center justify-between px-8">
<div className="flex items-center gap-4">
<span className="text-sm font-semibold text-primary">Onboarding Review</span>
<span className="h-4 w-[1px] bg-outline-variant/30"></span>
<div className="flex items-center text-slate-400 text-xs">
<span>Candidate: Marcus Aurelius</span>
</div>
</div>
<div className="flex items-center gap-6">
<button className="text-slate-400 hover:text-[#4cd7f6] transition-colors">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="text-slate-400 hover:text-[#4cd7f6] transition-colors">
<span className="material-symbols-outlined" data-icon="help_outline">help_outline</span>
</button>
<div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant/30">
<img className="h-full w-full object-cover" data-alt="Close-up professional portrait of a male corporate administrator in a neutral studio setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGw0KrrzEUrsC1Ou7DQuK-jwyeg8b0ekfmaJJi9UXw6NGObJeZHMj5rrh4HpLEy-c2ib7gAoDxTGJ2zpnjJroUnApaofXL5AFT47-XvHk8snWiShh6eKz47GUz_5HMCM14g6-UWd6DVWlUlyB3VVlCV9nunJom3QIYzfiA0SBtkfXaAjxVOW36Cmao1uENNPeHInyuoQMsq9HMGFQXQhX7Clx_5w1fVUBVHtahSgl1pDRKChxO2t8LKubxaOQ-gHTq79f9cSDOB5vX"/>
</div>
</div>
</header>

<div className="pt-24 pb-32 px-12 max-w-7xl mx-auto">

<section className="mb-12">
<div className="flex items-center justify-between max-w-4xl mx-auto">
<div className="flex flex-col items-center gap-2 group">
<div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shadow-sm">
<span className="material-symbols-outlined text-sm" data-icon="check" data-weight="fill">check</span>
</div>
<span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">Personal Details</span>
</div>
<div className="h-[2px] flex-1 mx-4 bg-secondary-container"></div>
<div className="flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shadow-sm">
<span className="material-symbols-outlined text-sm" data-icon="check" data-weight="fill">check</span>
</div>
<span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">Job Info</span>
</div>
<div className="h-[2px] flex-1 mx-4 bg-secondary-container"></div>
<div className="flex flex-col items-center gap-2">
<div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm shadow-sm">
<span className="material-symbols-outlined text-sm" data-icon="check" data-weight="fill">check</span>
</div>
<span className="text-[10px] font-bold uppercase tracking-widest text-on-primary-container">Compensation</span>
</div>
<div className="h-[2px] flex-1 mx-4 bg-outline-variant/30"></div>
<div className="flex flex-col items-center gap-2">
<div className="w-12 h-12 rounded-full border-2 border-[#4cd7f6] text-[#000615] flex items-center justify-center font-bold text-sm shadow-[0_0_20px_rgba(76,215,246,0.3)]">4</div>
<span className="text-[10px] font-bold uppercase tracking-widest text-primary">Review &amp; Confirm</span>
</div>
</div>
</section>

<div className="mb-10 text-left">
<h2 className="text-4xl font-headline font-extrabold tracking-tight text-primary mb-2">Final Verification</h2>
<p className="text-on-primary-container max-w-xl">Please review the captured data carefully. Once confirmed, the formal onboarding package will be dispatched to the candidate's portal.</p>
</div>

<div className="grid grid-cols-12 gap-6 relative">

<div className="absolute -top-20 -right-20 w-96 h-96 signature-glow rounded-full blur-[100px] -z-10 opacity-60"></div>
<div className="absolute -bottom-20 -left-20 w-80 h-80 signature-glow rounded-full blur-[100px] -z-10 opacity-40"></div>

<div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-8 flex gap-8 items-start relative overflow-hidden">
<div className="relative">
<div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-white shadow-xl">
<img className="w-full h-full object-cover" data-alt="High-quality profile photo of a modern professional man in a dark knit sweater against a minimal grey background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPCT7-qiX1FPKoPQ7Zur3brHhXuZdO4m0s3g2VKueomrC294C5Nf5a-iqDd0S0vMD85T2C99QNg-YMLxJwcLyFLg3sUzsV5rUwWYIDs67lfKxuH9JARJvxyY3tY30J7_uQW45tpQkbKJZz3drpUscI81Hcwan1eZbQH5SoAQci_PWLDCaW8oMTF6K1yf43e4PjV7fQ1Oy3B0_dJtRQwGGNLRuii0tUU80TWAR8XtpPG1e6KRBwZjO73BR_8XQUjUjLcduM8HgAWXaj"/>
</div>
<button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-container text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-xs" data-icon="edit">edit</span>
</button>
</div>
<div className="flex-1">
<div className="flex justify-between items-start mb-6">
<div>
<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container mb-1 block">Personal Profile</span>
<h3 className="text-2xl font-headline font-bold text-primary">Marcus Aurelius</h3>
</div>
<span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded-full">IDENTITY VERIFIED</span>
</div>
<div className="grid grid-cols-2 gap-y-4">
<div>
<p className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Email Address</p>
<p className="text-sm font-medium">m.aurelius@intechroot.com</p>
</div>
<div>
<p className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Mobile Phone</p>
<p className="text-sm font-medium">+1 (555) 012-9842</p>
</div>
<div>
<p className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Residential Address</p>
<p className="text-sm font-medium">722 Imperial Way, Rome, IT 00184</p>
</div>
<div>
<p className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Citizenship</p>
<p className="text-sm font-medium">Italian / EU Permanent Resident</p>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 glass-card rounded-xl p-8 flex flex-col justify-between border-l-4 border-[#4cd7f6]">
<div>
<div className="flex justify-between items-center mb-6">
<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">Employment Terms</span>
<button className="text-on-primary-container hover:text-primary transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="edit">edit</span>
</button>
</div>
<div className="space-y-6">
<div>
<p className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Job Title</p>
<p className="text-lg font-headline font-bold text-primary">Senior Solutions Architect</p>
</div>
<div>
<p className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Department</p>
<p className="text-sm font-medium text-secondary">Cloud Infrastructure / Engineering</p>
</div>
</div>
</div>
<div className="pt-6 mt-6 border-t border-outline-variant/15 grid grid-cols-2 gap-4">
<div>
<p className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Start Date</p>
<p className="text-sm font-semibold">Oct 12, 2023</p>
</div>
<div>
<p className="text-[10px] font-bold text-on-primary-container uppercase tracking-wider mb-1">Type</p>
<p className="text-sm font-semibold">Full-Time (Remote)</p>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-5 glass-card rounded-xl p-8">
<div className="flex justify-between items-center mb-8">
<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">Compensation &amp; Benefits</span>
<button className="text-on-primary-container hover:text-primary transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="edit">edit</span>
</button>
</div>
<div className="flex items-baseline gap-2 mb-2">
<span className="text-4xl font-headline font-extrabold text-primary">$185,000</span>
<span className="text-sm font-medium text-on-primary-container">USD / Annum</span>
</div>
<p className="text-xs text-secondary font-medium mb-8">Bi-weekly disbursement schedule</p>
<div className="space-y-4">
<div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-tertiary-container" data-icon="medical_services">medical_services</span>
<span className="text-xs font-semibold">Platinum Health Plan</span>
</div>
<span className="text-[10px] font-bold text-outline">ENROLLED</span>
</div>
<div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-tertiary-container" data-icon="savings">savings</span>
<span className="text-xs font-semibold">401(k) Matching (6%)</span>
</div>
<span className="text-[10px] font-bold text-outline">ENROLLED</span>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-7 glass-card rounded-xl p-8">
<div className="flex justify-between items-center mb-8">
<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-container">Verified Documentation</span>
<div className="flex items-center gap-2 text-xs font-semibold text-on-tertiary-container bg-tertiary-fixed px-3 py-1 rounded-full">
<span className="material-symbols-outlined text-xs" data-icon="security" data-weight="fill">security</span>
<span>Secure Storage</span>
</div>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-xl hover:border-[#4cd7f6]/40 transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-primary-container/5 rounded flex items-center justify-center">
<span className="material-symbols-outlined text-primary-container" data-icon="article">article</span>
</div>
<div>
<p className="text-xs font-bold text-primary">Identity_Passport.pdf</p>
<p className="text-[10px] text-on-primary-container">Uploaded Sep 24</p>
</div>
</div>
<span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" data-weight="fill">check_circle</span>
</div>
<div className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-xl hover:border-[#4cd7f6]/40 transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-primary-container/5 rounded flex items-center justify-center">
<span className="material-symbols-outlined text-primary-container" data-icon="contract">contract</span>
</div>
<div>
<p className="text-xs font-bold text-primary">Employment_Contract.pdf</p>
<p className="text-[10px] text-on-primary-container">Uploaded Sep 24</p>
</div>
</div>
<span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" data-weight="fill">check_circle</span>
</div>
<div className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-xl hover:border-[#4cd7f6]/40 transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-primary-container/5 rounded flex items-center justify-center">
<span className="material-symbols-outlined text-primary-container" data-icon="account_balance">account_balance</span>
</div>
<div>
<p className="text-xs font-bold text-primary">Tax_Form_W9.pdf</p>
<p className="text-[10px] text-on-primary-container">Uploaded Sep 25</p>
</div>
</div>
<span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" data-weight="fill">check_circle</span>
</div>
<div className="flex items-center justify-between p-4 border border-outline-variant/20 rounded-xl hover:border-[#4cd7f6]/40 transition-colors">
<div className="flex items-center gap-4">
<div className="w-10 h-10 bg-primary-container/5 rounded flex items-center justify-center">
<span className="material-symbols-outlined text-primary-container" data-icon="badge">badge</span>
</div>
<div>
<p className="text-xs font-bold text-primary">Visa_Permit_Copy.png</p>
<p className="text-[10px] text-on-primary-container">Uploaded Sep 25</p>
</div>
</div>
<span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" data-weight="fill">check_circle</span>
</div>
</div>
</div>
</div>
</div>

<footer className="fixed bottom-0 right-0 left-64 h-24 bg-white border-t border-slate-200/50 flex items-center justify-between px-12 z-40">
<button className="flex items-center gap-2 text-slate-500 font-semibold hover:text-primary transition-all group">
<span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform" data-icon="arrow_back">arrow_back</span>
<span className="text-sm">Back to Compensation</span>
</button>
<div className="flex items-center gap-6">
<div className="flex flex-col items-end">
<span className="text-[10px] font-bold text-on-primary-container uppercase tracking-widest">Final Step</span>
<span className="text-xs font-medium text-secondary">Ready for dispatch</span>
</div>
<button className="bg-[#0b1f3a] text-white h-14 px-10 rounded-lg font-headline font-bold flex items-center gap-3 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-md overflow-hidden relative group" onClick={() => navigate("/admin/employees")}>
<div className="absolute inset-0 bg-gradient-to-r from-[#4cd7f6]/0 via-[#4cd7f6]/10 to-[#4cd7f6]/0 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
<span>Complete Onboarding</span>
<span className="material-symbols-outlined" data-icon="task_alt" data-weight="fill">task_alt</span>
</button>
</div>
</footer>
</main>
    </>
  );
}
