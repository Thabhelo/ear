"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Review = {
  text: string;
  name: string;
  role: string;
  initial: string;
  tint: string;
};

const reviews: Review[] = [
  {
    text: "I didn't want advice. I didn't want to be fixed. I just wanted someone on the line while I cooked dinner. That's exactly what I got.",
    name: "M.",
    role: "Just Listen regular",
    initial: "M",
    tint: "linear-gradient(135deg, #E8642A, #FFB37A)",
  },
  {
    text: "Silent Company sounded weird until I tried it. Having another person quietly there while I studied got me through finals week.",
    name: "K.",
    role: "Study Buddy subscriber",
    initial: "K",
    tint: "linear-gradient(135deg, #6E8BFF, #9DB4FF)",
  },
  {
    text: "It's 2am, nobody I know is awake, and I can still get a real human on a call in a few minutes. That alone is worth the price.",
    name: "D.",
    role: "Always There member",
    initial: "D",
    tint: "linear-gradient(135deg, #34D17A, #8FE6B6)",
  },
  {
    text: "I bid five dollars to skip the queue on a rough night. Best five dollars I've spent in a long time. The call ran long and nobody rushed me.",
    name: "S.",
    role: "Deep Talk caller",
    initial: "S",
    tint: "linear-gradient(135deg, #B06EE8, #D8A9FF)",
  },
];

const CARD_WIDTH = 484; // 464 + 20 gap

const ReviewCard = ({ review, index }: { review: Review; index: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: (index % reviews.length) * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        width: 464,
        height: 360,
        flexShrink: 0,
        cursor: "pointer",
      }}
    >
      {/* Surface with masked glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: 464,
          height: 360,
          borderRadius: 24,
          background: "#F4F5F7",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
          transform: hovered ? "scale(1.015)" : "scale(1)",
          transition: "transform 0.35s ease",
        }}
      >
        {/* Volumetric glow - sits beyond the top edge but masked by overflow:hidden */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgb(255, 196, 158)",
            filter: "blur(85px)",
            top: -370,
            left: "80%",
            transform: "translateX(-50%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.55s ease",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "32px 32px 50px",
          }}
        >
          <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
            <p
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 24,
                fontWeight: 300,
                lineHeight: "28px",
                color: "#111111",
                width: 373,
                maxWidth: "100%",
                margin: 0,
              }}
            >
              {review.text}
            </p>
          </div>

          <div
            style={{
              marginTop: "auto",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: review.tint,
                color: "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: 16,
                fontWeight: 500,
                flexShrink: 0,
                border: "1.5px solid rgba(0,0,0,0.06)",
              }}
            >
              {review.initial}
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#111111",
                  lineHeight: 1.2,
                }}
              >
                {review.name}
              </div>
              <div
                style={{
                  fontFamily: "'Inter Tight', sans-serif",
                  fontSize: 17,
                  fontWeight: 300,
                  color: "rgba(0,0,0,0.50)",
                  lineHeight: 1.2,
                }}
              >
                {review.role}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Section6 = () => {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(true);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  const loopWidth = reviews.length * CARD_WIDTH;
  // Render the list 3x for seamless infinite scroll
  const looped = [...reviews, ...reviews, ...reviews];

  useEffect(() => {
    if (paused || dragging) return;
    const interval = setInterval(() => {
      setAnimate(true);
      setOffset((prev) => prev + CARD_WIDTH);
    }, 4000);
    return () => clearInterval(interval);
  }, [paused, dragging]);

  // Seamless wrap: when we cross one full loop, jump back without transition
  useEffect(() => {
    if (offset >= loopWidth) {
      const id = setTimeout(() => {
        setAnimate(false);
        setOffset((prev) => prev - loopWidth);
      }, 800);
      return () => clearTimeout(id);
    }
    if (offset < 0) {
      const id = setTimeout(() => {
        setAnimate(false);
        setOffset((prev) => prev + loopWidth);
      }, 800);
      return () => clearTimeout(id);
    }
  }, [offset, loopWidth]);

  // Re-enable animation on the next frame after a non-animated jump
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  const onDown = (clientX: number) => {
    setDragging(true);
    startXRef.current = clientX;
    startOffsetRef.current = offset;
  };
  const onMove = (clientX: number) => {
    if (!dragging) return;
    const delta = startXRef.current - clientX;
    setAnimate(false);
    setOffset(startOffsetRef.current + delta);
  };
  const onUp = () => {
    if (!dragging) return;
    setDragging(false);
    const snapped = Math.round(offset / CARD_WIDTH) * CARD_WIDTH;
    setAnimate(true);
    setOffset(snapped);
  };

  const step = (direction: 1 | -1) => {
    setAnimate(true);
    setOffset((prev) => Math.round(prev / CARD_WIDTH) * CARD_WIDTH + direction * CARD_WIDTH);
  };

  const headingWords = "Real people. Real presence.".split(" ");

  return (
    <section
      style={{
        background: "#FFFFFF",
        padding: "80px 0 80px",
        overflow: "hidden",
        position: "relative",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div style={{ textAlign: "center", padding: "0 40px", marginBottom: 56 }}>
        <h2
          className="r-s6-h2"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: 72,
            fontWeight: 200,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            color: "#111111",
            maxWidth: 720,
            margin: "0 auto 16px",
            textAlign: "center",
          }}
        >
          {headingWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(10px)", y: 18 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.055, ease: "easeOut" }}
              style={{ display: "inline-block", marginRight: "0.2em" }}
            >
              {word}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          style={{
            fontFamily: "'Inter Tight', sans-serif",
            fontSize: 14,
            fontWeight: 300,
            color: "rgba(0,0,0,0.45)",
            textAlign: "center",
            margin: 0,
          }}
        >
          What callers say after the call ends
        </motion.p>
      </div>

      {/* Carousel */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        {/* Arrow controls */}
        {([
          { dir: -1 as const, side: { left: 28 }, Icon: ChevronLeft, label: "Previous testimonials" },
          { dir: 1 as const, side: { right: 28 }, Icon: ChevronRight, label: "Next testimonials" },
        ]).map(({ dir, side, Icon, label }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            onClick={() => step(dir)}
            className="flex items-center justify-center"
            style={{
              position: "absolute",
              ...side,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 12,
              width: 48,
              height: 48,
              borderRadius: 9999,
              border: "1px solid rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 8px 24px rgba(15,23,42,0.1)",
              color: "#111111",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1.08)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,23,42,0.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(-50%) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.1)";
            }}
          >
            <Icon size={20} strokeWidth={2} />
          </button>
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 160,
            zIndex: 10,
            pointerEvents: "none",
            background: "linear-gradient(to right, #FFFFFF 0%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 160,
            zIndex: 10,
            pointerEvents: "none",
            background: "linear-gradient(to left, #FFFFFF 0%, transparent 100%)",
          }}
        />

        <div
          onMouseDown={(e) => onDown(e.clientX)}
          onMouseMove={(e) => onMove(e.clientX)}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={(e) => onDown(e.touches[0].clientX)}
          onTouchMove={(e) => onMove(e.touches[0].clientX)}
          onTouchEnd={onUp}
          style={{
            display: "flex",
            gap: 20,
            padding: "20px 80px 40px",
            cursor: dragging ? "grabbing" : "grab",
            userSelect: "none",
            transform: `translateX(-${offset}px)`,
            transition: animate
              ? "transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              : "none",
            willChange: "transform",
          }}
        >
          {looped.map((review, i) => (
            <ReviewCard key={i} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section6;
