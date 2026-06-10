"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { MODE_META, ModeGlyph } from "../components/landing/modeMeta";
import {
  PageHero,
  PageShell,
  Surface,
  fontBody,
  fontHeading
} from "../components/landing/PageShell";
import { modes } from "../lib/catalog";

export default function ModesPage() {
  const router = useRouter();

  return (
    <PageShell active="/modes">
      <PageHero
        eyebrow="Modes"
        title="What kind of presence do you need?"
        sub="Pick the shape of the interaction first. Everything else takes under a minute."
      />

      <div className="k-grid k-grid-3">
        {modes.map((mode, i) => {
          const meta = MODE_META[mode.id];
          return (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: "easeOut" }}
            >
              <Surface
                hover
                onClick={() => router.push(`/start?mode=${mode.id}`)}
                style={{ padding: 28, width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 16 }}
              >
                <ModeGlyph mode={mode.id} size={52} />
                <div>
                  <h3
                    style={{
                      fontFamily: fontHeading,
                      fontSize: 21,
                      fontWeight: 400,
                      letterSpacing: "-0.5px",
                      color: "#111111",
                      margin: "0 0 6px"
                    }}
                  >
                    {mode.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: fontBody,
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "rgba(0,0,0,0.5)",
                      margin: 0
                    }}
                  >
                    {mode.description}
                  </p>
                </div>
                <span
                  className="inline-flex items-center"
                  style={{
                    gap: 6,
                    marginTop: "auto",
                    fontFamily: fontBody,
                    fontSize: 13,
                    fontWeight: 500,
                    color: meta.fg
                  }}
                >
                  Choose <ArrowRight size={14} />
                </span>
              </Surface>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        style={{
          textAlign: "center",
          marginTop: 48,
          fontFamily: fontBody,
          fontSize: 13,
          color: "rgba(0,0,0,0.4)"
        }}
      >
        Not sure? Just Listen is the most popular place to start.
      </motion.p>
    </PageShell>
  );
}
