import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function FooterCTA() {
  const [email, setEmail] = useState("");

  const handleNotify = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    const subject = encodeURIComponent("MarketCompass waitlist / notify me");
    const body = encodeURIComponent(
      trimmed
        ? `Please add this email for MarketCompass updates: ${trimmed}\n\n`
        : "I would like to be notified about MarketCompass.\n\n"
    );
    window.location.href = `mailto:contact@anupaatnivesh.com?subject=${subject}&body=${body}`;
  };

  return (
    <footer id="early-access" className="scroll-mt-24 bg-gradient-to-b from-mdif-muted/60 via-mdif-surface to-mdif-surface py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[28px] bg-gradient-to-br from-mdif-brand/20 via-mdif-brand/10 to-transparent p-[2px] shadow-[0_24px_80px_-24px_rgba(254,1,1,0.35)]"
        >
          <div className="rounded-[26px] bg-mdif-surface px-6 py-10 sm:px-12 sm:py-14">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-mdif-brand sm:text-base">
                Coming soon
              </p>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight text-mdif-text sm:text-4xl md:text-[2.75rem] md:leading-[1.12]">
                Get early access to MarketCompass
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-mdif-textMuted sm:text-xl sm:leading-relaxed">
                One score for <strong className="font-semibold text-mdif-text">when</strong> to deploy
                and <strong className="font-semibold text-mdif-text">how much</strong> equity fits the
                market — built for busy families across India.
              </p>
            </div>

            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:gap-5">
              <motion.div className="flex-1 sm:flex-initial sm:min-w-[220px]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="flex min-h-[56px] w-full items-center justify-center rounded-xl bg-mdif-brand px-8 py-4 text-center text-lg font-semibold text-white shadow-[0_14px_40px_-10px_rgba(254,1,1,0.55)] transition hover:bg-mdif-brandDark"
                >
                  Get early access
                </Link>
              </motion.div>
              <motion.div className="flex-1 sm:flex-initial sm:min-w-[220px]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/contact"
                  className="flex min-h-[56px] w-full items-center justify-center rounded-xl border-2 border-mdif-brand bg-mdif-surface px-8 py-4 text-center text-lg font-semibold text-mdif-brand transition hover:bg-[rgba(254,1,1,0.08)]"
                >
                  Join waitlist
                </Link>
              </motion.div>
            </div>

            <p className="mx-auto mt-8 max-w-xl text-center text-base text-mdif-textMuted sm:text-lg">
              Or leave your email — we will only write for launch updates.
            </p>

            <form
              onSubmit={handleNotify}
              className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
            >
              <label htmlFor="mdif-notify-email" className="sr-only">
                Email for notifications
              </label>
              <input
                id="mdif-notify-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="min-h-[56px] flex-1 rounded-xl border-2 border-mdif-line bg-mdif-muted/30 px-4 text-lg text-mdif-text shadow-inner outline-none ring-mdif-brand/25 placeholder:text-mdif-textSoft focus:border-mdif-brand focus:ring-2"
              />
              <button
                type="submit"
                className="min-h-[56px] shrink-0 rounded-xl bg-mdif-brand px-8 text-lg font-semibold text-white shadow-lift transition hover:bg-mdif-brandDark"
              >
                Notify me
              </button>
            </form>
            <p className="mt-4 text-center text-base text-mdif-textSoft sm:text-[1.0625rem]">
              Opens your email app with a pre-filled message. Prefer to talk?{" "}
              <Link to="/contact" className="font-semibold text-mdif-brand underline-offset-2 hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        </motion.div>

        <p className="mx-auto mt-12 max-w-3xl text-center text-[0.9375rem] leading-relaxed text-mdif-textSoft sm:text-base">
          Disclaimer: MarketCompass materials are for education and framework illustration only. They
          are not investment advice or a recommendation to buy or sell any security. Past or sample
          readings are not indicative of future results. Consult a qualified advisor before investing.
        </p>
        <p className="mt-6 text-center text-sm text-mdif-textSoft sm:text-[0.9375rem]">
          © {new Date().getFullYear()} Anupaat Nivesh · MarketCompass
        </p>
      </div>
    </footer>
  );
}
