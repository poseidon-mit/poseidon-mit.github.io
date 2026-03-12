import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/router";
import { ScanFace, Unlock, ArrowRight } from "lucide-react";
import { PublicTopBar } from "@/components/landing/PublicTopBar";
import { AuthShell } from "@/components/layout/AuthShell";
import { fadeUp, staggerContainer } from "@/lib/motion-presets";
import { Button } from "@/components/ui/button";
import { useDemoState } from "@/lib/demo-state/provider";
import { DEMO_USER } from "@/lib/demo-user";
import { usePageTitle } from "@/hooks/use-page-title";

function resolveNextPath(search: string): string {
  const params = new URLSearchParams(search);
  const next = params.get("next");
  return next && next.startsWith("/") ? next : "/dashboard";
}

type AuthState = "idle" | "scanning" | "success";

export default function LoginPage() {
  usePageTitle("Sign in");

  const { navigate, search } = useRouter();
  const { beginDemoSession } = useDemoState();
  const [authState, setAuthState] = useState<AuthState>("idle");

  const nextPath = useMemo(() => resolveNextPath(search), [search]);

  const handleAuth = () => {
    if (authState !== "idle") return;
    setAuthState("scanning");

    setTimeout(() => {
      setAuthState("success");
      setTimeout(() => {
        beginDemoSession({
          method: "skip",
          email: DEMO_USER.email,
          entryIntent: "express",
        });
        navigate(nextPath);
      }, 400);
    }, 600);
  };

  return (
    <>
      <PublicTopBar />
      <AuthShell title="" subtitle="Welcome back" hideLogo>
        <div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col h-full"
          >
            <motion.div variants={fadeUp} className="text-center mb-12 mt-8">
              <div className="relative w-28 h-28 mx-auto mb-8">
                {/* Background scanning effect */}
                {authState === "scanning" && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-cyan-400/50"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Main Icon Container */}
                <motion.div
                  className={`w-full h-full rounded-3xl flex items-center justify-center transition-all duration-500 relative z-10 ${
                    authState === "success"
                      ? "bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)]"
                      : "bg-black/50 border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md"
                  } border`}
                >
                  <AnimatePresence mode="wait">
                    {authState === "success" ? (
                      <motion.div
                        key="unlock"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Unlock
                          className="w-12 h-12 text-emerald-400"
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="scan"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <ScanFace
                          className={`w-12 h-12 ${authState === "scanning" ? "text-cyan-400" : "text-slate-400"} `}
                          strokeWidth={1.5}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scanning Laser Line */}
                  {authState === "scanning" && (
                    <motion.div
                      className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                      animate={{ top: ["10%", "90%", "10%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    />
                  )}
                </motion.div>
              </div>

              <p className="text-sm text-slate-400 font-light h-5">
                {authState === "success"
                  ? "Identity Verified"
                  : authState === "scanning"
                    ? "Verifying login..."
                    : ""}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-4 pb-4 mt-auto">
              <Button
                type="button"
                onClick={handleAuth}
                disabled={authState !== "idle"}
                data-cta-priority="primary"
                className="w-full rounded-2xl py-7 text-lg font-bold shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] transition-all flex justify-center items-center gap-2 border border-cyan-500/50 bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                {authState === "idle" ? (
                  <>
                    Biometric Login <ArrowRight className="w-5 h-5" />
                  </>
                ) : authState === "scanning" ? (
                  "Scanning..."
                ) : (
                  "Entering..."
                )}
              </Button>
              <button
                type="button"
                onClick={() => {
                  beginDemoSession({
                    method: "skip",
                    email: DEMO_USER.email,
                    entryIntent: "express",
                  });
                  navigate(nextPath);
                }}
                className="block mx-auto mt-3 text-sm text-slate-500 hover:text-slate-200 transition-colors"
              >
                Skip to demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </AuthShell>
    </>
  );
}
