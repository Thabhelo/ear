"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MagneticButton from "./MagneticButton";

const HEADING_LINES = ["Turn a heavy night", "into a real call."];

// ============ Siri Sphere (THREE.js) ============
const SiriSphere = ({ size = 96 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    let renderer: any;
    let frameId: number;
    let disposed = false;
    const init = async () => {
      if (!(window as any).THREE) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
          s.onload = () => resolve();
          s.onerror = () => reject();
          document.head.appendChild(s);
        });
      }
      if (disposed || !canvasRef.current) return;
      const THREE = (window as any).THREE;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
      camera.position.z = 1.8;
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(size, size);
      renderer.setPixelRatio(window.devicePixelRatio);

      const geometry = new THREE.SphereGeometry(0.7, 64, 64);
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, intensity: { value: 0.5 } },
        vertexShader: `
          uniform float time;
          uniform float intensity;
          varying vec3 vNormal;
          varying vec3 vPosition;
          float noise(vec3 p) {
            return sin(p.x * 3.0 + time) *
                   cos(p.y * 2.5 - time * 1.3) *
                   sin(p.z * 2.0 + time * 0.7);
          }
          void main() {
            vNormal = normal;
            vPosition = position;
            vec3 pos = position;
            float n = noise(position * 2.0) * intensity * 0.18;
            pos += normal * n;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          void main() {
            vec3 light = normalize(vec3(1.0, 1.0, 2.0));
            float diff = max(dot(vNormal, light), 0.0);
            float fresnel = pow(1.0 - dot(vNormal, normalize(vec3(0.0,0.0,1.0))), 2.5);
            vec3 coreColor   = vec3(1.00, 0.42, 0.08);
            vec3 midColor    = vec3(0.90, 0.25, 0.02);
            vec3 glowColor   = vec3(1.00, 0.60, 0.20);
            vec3 rimColor    = vec3(0.60, 0.15, 0.00);
            vec3 color = mix(midColor, coreColor, diff);
            color = mix(color, glowColor, fresnel * 0.6);
            color += rimColor * fresnel * 0.4;
            float alpha = 0.92 + fresnel * 0.08;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      const rings: any[] = [];
      [0.85, 0.95, 1.05].forEach((radius) => {
        const ringGeo = new THREE.RingGeometry(radius, radius + 0.025, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xff6a00,
          transparent: true,
          opacity: 0.0,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        scene.add(ring);
        rings.push(ring);
      });

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        material.uniforms.time.value += 0.018;
        material.uniforms.intensity.value = 0.5 + Math.sin(Date.now() * 0.002) * 0.3;
        sphere.rotation.y += 0.008;
        sphere.rotation.x += 0.003;
        const t = material.uniforms.time.value;
        rings.forEach((r, i) => {
          r.material.opacity = Math.abs(Math.sin(t * 2.5 + i * 0.8)) * 0.35;
          const s = 1 + Math.sin(t * 2.5 + i * 0.8) * 0.06;
          r.scale.x = r.scale.y = s;
        });
        renderer.render(scene, camera);
      };
      animate();
    };
    init();
    return () => {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      if (renderer) renderer.dispose();
    };
  }, [size]);
  return <canvas ref={canvasRef} style={{ width: size, height: size, background: "transparent" }} />;
};

// ============ Equalizer Dots ============
const DOT_COUNT = 48;
const EqualizerDots = () => {
  const [burst, setBurst] = useState<{ center: number; width: number; t: number } | null>(null);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const triggerBurst = () => {
      const center = Math.floor(Math.random() * 16) + 16;
      const width = Math.floor(Math.random() * 10) + 10;
      setBurst({ center, width, t: Date.now() });
      setTimeout(() => setBurst(null), 280 + Math.random() * 160);
    };
    const schedule = () => {
      timeout = setTimeout(() => {
        triggerBurst();
        schedule();
      }, 200 + Math.random() * 500);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0, flexWrap: "nowrap", width: "100%" }}>
      {Array.from({ length: DOT_COUNT }).map((_, i) => {
        let bg = "rgba(0,0,0,0.18)";
        if (burst) {
          const dist = Math.abs(i - burst.center);
          const half = burst.width / 2;
          if (dist <= half) {
            const f = 1 - dist / half;
            const r = Math.round(255 * (0.85 + 0.15 * f));
            const g = Math.round(120 * (0.6 + 0.4 * f));
            const b = Math.round(40 * (0.4 + 0.6 * f));
            const a = 0.45 + 0.55 * f;
            bg = `rgba(${r},${g},${b},${a})`;
          }
        }
        return (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: bg,
              transition: "background 0.15s ease",
              flexShrink: 0,
            }}
          />
        );
      })}
    </div>
  );
};

// ============ Animated counter ============
const Counter = ({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          setStarted(true);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target * 10) / 10);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target]);
  const display = Number.isInteger(target) ? Math.round(val) : val.toFixed(1);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

// ============ Waveform mini icon ============
const WaveformBars = () => (
  <span style={{ display: "inline-flex", gap: 1.5, alignItems: "center" }}>
    {[4, 7, 4].map((h, i) => (
      <motion.span
        key={i}
        animate={{ scaleY: [1, 1.8, 1, 2.2, 1] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        style={{
          display: "inline-block",
          width: 2,
          height: h,
          background: "rgba(0,0,0,0.45)",
          borderRadius: 1,
        }}
      />
    ))}
  </span>
);

// ============ Stats data ============
const STATS = [
  { value: 6, suffix: "", prefix: "", label: "Modes, from Just Listen to Game Mode" },
  { value: 3, suffix: " min", prefix: "", label: "Quick Call starts at just $2.99" },
  { value: 100, suffix: "%", prefix: "", label: "Of calls recorded with consent, for safety" },
];

const Section4 = () => {
  const router = useRouter();
  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "80px 0 60px",
        overflow: "hidden",
        position: "relative",
      }}
      className="r-s4"
    >
      {/* HEADER */}
      <div className="r-pad-x" style={{ textAlign: "center", marginBottom: 40 }}>
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(0,0,0,0.55)",
            letterSpacing: 0.5,
            marginBottom: 18,
            display: "block",
          }}
        >
          Try it tonight
        </motion.span>

        <h2
          className="r-s4-h2"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 64,
            fontWeight: 200,
            lineHeight: "68px",
            letterSpacing: "-2.5px",
            color: "#111111",
            maxWidth: 900,
            margin: "0 auto 24px",
            textAlign: "center",
          }}
        >
          {HEADING_LINES.map((line, li) => (
            <div key={li} style={{ display: "block" }}>
              {line.split(" ").map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 18 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: (li * 3 + i) * 0.055, ease: "easeOut" }}
                  style={{ display: "inline-block", marginRight: "0.2em" }}
                >
                  {w}
                </motion.span>
              ))}
            </div>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 14, filter: "blur(5px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 15,
            fontWeight: 400,
            lineHeight: 1.65,
            color: "rgba(0,0,0,0.50)",
            textAlign: "center",
            maxWidth: 380,
            margin: "0 auto 28px",
          }}
        >
          No scheduling. No explaining yourself.<br />
          Pick a mode and someone real picks up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 40 }}
        >
          <MagneticButton
            circleColor="rgba(0,0,0,0.05)"
            circleSize={300}
            onClick={() => router.push("/modes")}
            style={{
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.10)",
              borderRadius: 9999,
              color: "#111111",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 15,
              fontWeight: 500,
              height: 46,
              padding: "0 24px",
              cursor: "pointer",
            }}
          >
            See the modes
          </MagneticButton>
          <MagneticButton
            circleColor="rgba(255,255,255,0.18)"
            circleSize={300}
            onClick={() => router.push("/start")}
            style={{
              background: "#111111",
              borderRadius: 9999,
              color: "#FFFFFF",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 15,
              fontWeight: 600,
              height: 46,
              padding: "0 24px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Start a call
          </MagneticButton>
        </motion.div>
      </div>

      {/* BACKGROUND IMAGE BLOCK */}
      <div
        className="r-s4-bgblock"
        style={{
          position: "relative",
          width: "calc(100% - 64px)",
          maxWidth: 1436,
          margin: "0 auto",
          borderRadius: 28,
          overflow: "hidden",
          height: 520,
          background: "linear-gradient(160deg, #FCE9DD 0%, #F4EFFB 55%, #E7F0FA 100%)",
        }}
      >
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "60%", background: "linear-gradient(rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 100%)", zIndex: 2, pointerEvents: "none" }} />

        {/* Sphere + Recording card combined */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            className="r-s4-siri"
            style={{ width: 96, height: 96, flexShrink: 0 }}
          >
            <SiriSphere size={96} />
          </div>

          <div
            className="r-s4-card"
            style={{
              width: 420,
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 22,
              padding: "16px 20px 18px",
              boxShadow: "0 24px 60px rgba(15,23,42,0.16)",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #E8642A, #FFB37A)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFF",
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 14,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  E
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#111111",
                    }}
                  >
                    Your host is listening
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontFamily: "'Inter Tight', sans-serif",
                      fontSize: 12,
                      fontWeight: 400,
                      color: "rgba(0,0,0,0.45)",
                    }}
                  >
                    02:38
                    <WaveformBars />
                  </div>
                </div>
              </div>

              <button
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.10)",
                  borderRadius: 9999,
                  padding: "7px 14px",
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "inline-flex", gap: 3 }}>
                  <span style={{ width: 2, height: 9, background: "#111111", borderRadius: 1, display: "inline-block" }} />
                  <span style={{ width: 2, height: 9, background: "#111111", borderRadius: 1, display: "inline-block" }} />
                </span>
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#111111",
                  }}
                >
                  Leave anytime
                </span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <EqualizerDots />
              <EqualizerDots />
            </div>
          </div>
        </div>
      </div>

      {/* STATS ROW */}
      <div
        className="r-s4-stats r-pad-x"
        style={{
          marginTop: 56,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 1436,
          marginLeft: "auto",
          marginRight: "auto",
          gap: 32,
          flexWrap: "nowrap",
        }}
      >
        <div className="r-s4-stats-left" style={{ display: "flex", gap: 35, alignItems: "flex-start", flexWrap: "nowrap" }}>
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              style={{ display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}
            >
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 56,
                  fontWeight: 200,
                  lineHeight: 1,
                  letterSpacing: -2,
                  color: "#111111",
                  whiteSpace: "nowrap",
                }}
              >
                <Counter target={s.value} suffix={s.suffix} prefix={s.prefix} />
              </div>
              <div
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 16,
                  fontWeight: 400,
                  color: "rgba(0,0,0,0.55)",
                  lineHeight: 1.4,
                  maxWidth: 220,
                }}
              >
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          style={{ width: 420, flexShrink: 0, textAlign: "right" }}
        >
          <p
            style={{
              fontFamily: "'Inter Tight', sans-serif",
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
              color: "rgba(0,0,0,0.70)",
              marginBottom: 18,
            }}
          >
            Some people have that person they can call at any hour.<br />
            Many people don&apos;t. Ear exists so that when you need<br />
            someone real, someone real actually picks up.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 9999,
                padding: "5px 16px 5px 5px",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #111111, #444444)",
                  color: "#FFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                T
              </div>
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#111111",
                    display: "block",
                    lineHeight: 1.2,
                  }}
                >
                  Thabhelo
                </span>
                <span
                  style={{
                    fontFamily: "'Inter Tight', sans-serif",
                    fontSize: 11,
                    fontWeight: 400,
                    color: "rgba(0,0,0,0.45)",
                    display: "block",
                    lineHeight: 1.2,
                  }}
                >
                  Ear host
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section4;
