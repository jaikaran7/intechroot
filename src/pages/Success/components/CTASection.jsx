import { Link } from "react-router-dom";
import Button from "../../../components/Form/Button";

export default function CTASection() {
  return (
    <div className="md:col-span-8 bg-primary-container text-white p-10 rounded-xl">
      <h4 className="font-headline font-bold text-2xl mb-8">Next Steps</h4>
      <div className="space-y-8">
        <div className="flex gap-6 items-start">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-tertiary-fixed shadow-[0_0_10px_#acedff]"></div>
            <div className="w-0.5 h-16 bg-white/10 mt-2"></div>
          </div>
          <div>
            <p className="text-xs font-bold text-tertiary-fixed uppercase tracking-widest mb-1">Now</p>
            <h5 className="font-bold text-lg mb-1">Application Logged Successfully</h5>
            <p className="text-sm text-on-primary-container/80">Our team has started your final matching process.</p>
          </div>
        </div>
        <div className="flex gap-6 items-start">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-white/20"></div>
          </div>
          <div className="opacity-60">
            <p className="text-xs font-bold text-on-primary-container uppercase tracking-widest mb-1">Within 72 hours</p>
            <h5 className="font-bold text-lg mb-1">Final Partner Confirmation</h5>
            <p className="text-sm text-on-primary-container/80">You will receive a direct follow-up from InTechRoot.</p>
          </div>
        </div>
      </div>
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link className="w-full sm:w-auto" to="/">
          <Button className="w-full py-4 bg-white/5 border border-white/10 rounded-lg text-sm font-bold tracking-tight hover:bg-white/10 transition-all">
            Back to Home
          </Button>
        </Link>
        <Link className="w-full sm:w-auto" to="/careers">
          <Button className="w-full py-4 bg-tertiary-fixed text-primary rounded-lg text-sm font-bold tracking-tight hover:bg-white transition-all">
            Go to Careers
          </Button>
        </Link>
      </div>
    </div>
  );
}
