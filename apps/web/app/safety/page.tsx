"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CircleSlash,
  DoorOpen,
  Lock,
  Mic,
  ShieldCheck,
  UserX
} from "lucide-react";
import { useRouter } from "next/navigation";
import MagneticButton from "../components/landing/MagneticButton";
import {
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";

const PRINCIPLES = [
  {
    Icon: Mic,
    tint: "rgba(232,100,42,0.12)",
    fg: "#E8642A",
    title: "Recorded, by consent",
    body: "Every call is recorded for safety and dispute resolution, and every call requires your explicit consent first. No consent, no call."
  },
  {
    Icon: Lock,
    tint: "rgba(110,139,255,0.14)",
    fg: "#5B79F0",
    title: "Everything stays on-platform",
    body: "No personal phone numbers, emails, or social accounts are ever shared, in either direction. The platform is the boundary."
  },
  {
    Icon: DoorOpen,
    tint: "rgba(31,157,99,0.12)",
    fg: "#1F9D63",
    title: "Leave anytime",
    body: "You can end any call instantly, no explanation needed. The same is true on the other side."
  },
  {
    Icon: CircleSlash,
    tint: "rgba(99,102,140,0.13)",
    fg: "#63668C",
    title: "Clear limits",
    body: "Ear is presence and conversation. It is not dating, therapy, medical advice, crisis counseling, or a substitute for emergency services."
  },
  {
    Icon: UserX,
    tint: "rgba(214,69,93,0.12)",
    fg: "#D6455D",
    title: "Real consequences",
    body: "Threats, harassment, and misconduct end in bans. Severe violations are permanent with no appeal."
  },
  {
    Icon: ShieldCheck,
    tint: "rgba(177,98,232,0.12)",
    fg: "#A055E0",
    title: "Recordings stay private",
    body: "Recordings are stored securely, used only for safety and quality review, and are never public."
  }
];

export default function SafetyPage() {
  const router = useRouter();

  return (
    <PageShell active="/safety">
      <PageHero
        eyebrow="Safety"
        title="Boundaries are the product."
        sub="Ear only works if access feels human without becoming unbounded. These rules protect both sides of every call."
      />

      <div className="k-grid k-grid-3">
        {PRINCIPLES.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: "easeOut" }}
          >
            <Surface style={{ padding: 28, height: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                className="flex items-center justify-center"
                style={{ width: 52, height: 52, borderRadius: 16, background: item.tint }}
              >
                <item.Icon size={24} color={item.fg} strokeWidth={1.8} />
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: fontHeading,
                    fontSize: 19,
                    fontWeight: 400,
                    letterSpacing: "-0.4px",
                    color: "#111111",
                    margin: "0 0 8px"
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: fontBody,
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: "rgba(0,0,0,0.55)",
                    margin: 0
                  }}
                >
                  {item.body}
                </p>
              </div>
            </Surface>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col items-center"
        style={{ marginTop: 90, gap: 18, textAlign: "center" }}
      >
        <p
          style={{
            fontFamily: fontHeading,
            fontSize: 26,
            fontWeight: 300,
            letterSpacing: "-0.7px",
            color: "#111111",
            margin: 0
          }}
        >
          Clear rules. Real presence.
        </p>
        <p
          style={{
            fontFamily: fontBody,
            fontSize: 14,
            color: "rgba(0,0,0,0.5)",
            margin: 0,
            maxWidth: 420
          }}
        >
          Pick a mode, agree to the ground rules, and connect, all in a couple of minutes.
        </p>
        <MagneticButton
          circleColor="rgba(255,255,255,0.15)"
          circleSize={240}
          onClick={() => router.push("/start")}
          style={{
            borderRadius: 9999,
            background: "#111111",
            color: "#FFFFFF",
            border: "none",
            fontFamily: fontHeading,
            fontSize: 15,
            fontWeight: 500,
            padding: "14px 28px",
            cursor: "pointer",
            marginTop: 6
          }}
        >
          Start now <ArrowRight size={15} />
        </MagneticButton>
      </motion.div>
    </PageShell>
  );
}
