import { ArrowRight, Sparkles } from "lucide-react";
import Container from "../../../components/ui/Container";
import Button from "../../../components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="border-y border-[#202a33] bg-[#0a0f13]">
      <Container>
        <div className="cw-brand-glow flex flex-col items-center px-2 py-20 text-center sm:py-24">
          <span className="mb-5 flex h-11 w-11 items-center justify-center border border-[#00e887]/30 bg-[#00e887]/5 text-[#00e887]">
            <Sparkles size={19} />
          </span>

          <p className="cw-eyebrow">YOUR NEXT SESSION STARTS HERE</p>

          <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to practise with purpose?
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#8c9bad] sm:text-base">
            Build a repeatable process, practise your strategy, and learn to
            respect risk — one decision at a time.
          </p>

          <div className="mt-8">
            <Button to="/signup">
              Start practising <ArrowRight size={17} />
            </Button>
          </div>

          <p className="mt-4 text-xs text-[#718194]">
            Virtual funds only · Educational use
          </p>
        </div>
      </Container>
    </section>
  );
}