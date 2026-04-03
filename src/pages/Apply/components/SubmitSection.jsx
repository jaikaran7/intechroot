import Button from "../../../components/Form/Button";

export default function SubmitSection() {
  return (
    <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="text-[10px] text-on-surface-variant max-w-xs text-center md:text-left">
        By proceeding, you agree to our recruitment data processing terms and global privacy policy.
      </p>
      <Button
        className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-lg font-headline font-extrabold text-sm uppercase tracking-widest hover:bg-secondary hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3"
        type="submit"
      >
        Continue to Step 02
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </Button>
    </div>
  );
}
