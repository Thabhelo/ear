"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, LogOut, Menu, Settings, X, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { modes } from "../../lib/catalog";
import { buildAuthPath } from "../../lib/authRedirects";
import { useAuth } from "../../lib/useAuth";
import MagneticButton from "./MagneticButton";
import { ModeGlyph } from "./modeMeta";

const fontHeading = "'Bricolage Grotesque', sans-serif";
const fontBody = "'Inter Tight', sans-serif";

/* Glassmorphism: low-opacity white fill, heavy backdrop blur + saturation,
   translucent white border, inner top highlight. */
const glass = {
  border: "1px solid rgba(255,255,255,0.55)",
  background: "rgba(255,255,255,0.22)",
  backdropFilter: "blur(22px) saturate(180%)",
  WebkitBackdropFilter: "blur(22px) saturate(180%)",
  boxShadow: "0 8px 32px rgba(31,38,135,0.12), inset 0 1px 0 rgba(255,255,255,0.65)",
} as const;

const NavItem = ({
  label,
  href,
  active,
  hasArrow,
}: {
  label: string;
  href: string;
  active?: boolean;
  hasArrow?: boolean;
}) => {
  return (
    <Link
      href={href}
      className="flex items-center"
      style={{
        gap: 4,
        fontFamily: fontHeading,
        fontSize: 14,
        fontWeight: active ? 500 : 400,
        color: active ? "#111111" : "rgba(0,0,0,0.65)",
        padding: "6px 12px",
        borderRadius: 8,
        background: active ? "rgba(0,0,0,0.06)" : "transparent",
        cursor: "pointer",
        border: "none",
        textDecoration: "none",
        transition: "background 0.2s, color 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(0,0,0,0.04)";
          e.currentTarget.style.color = "rgba(0,0,0,0.9)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(0,0,0,0.65)";
        }
      }}
    >
      {label}
      {hasArrow && <ChevronDown size={13} color="rgba(0,0,0,0.65)" />}
    </Link>
  );
};

const LandingNav = ({ active }: { active?: string }) => {
  const router = useRouter();
  const auth = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modesOpen, setModesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openModes = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setModesOpen(true);
  };
  const scheduleCloseModes = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setModesOpen(false), 220);
  };

  const signInHref = buildAuthPath("/sign-in");
  const signUpHref = buildAuthPath("/sign-up");

  async function handleSignOut() {
    setProfileOpen(false);
    await auth.signOut();
    router.push("/");
  }

  return (
    <>
      <nav
        className="r-nav fixed z-50 flex items-center justify-between"
        style={{
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(980px, calc(100% - 48px))",
          padding: "12px 14px",
          borderRadius: 48,
          ...glass,
        }}
      >
        <div className="flex items-center" style={{ position: "relative", zIndex: 1 }}>
          <Link
            href="/"
            className="r-nav-logo flex items-center"
            style={{
              marginRight: 20,
              paddingLeft: 12,
              fontFamily: fontHeading,
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "-0.8px",
              color: "#111111",
              textDecoration: "none",
            }}
          >
            Ear
          </Link>
          <div
            className="r-nav-divider"
            style={{
              width: 1,
              height: 20,
              background: "rgba(0,0,0,0.12)",
              marginRight: 20,
            }}
          />
          <div className="r-nav-links flex items-center" style={{ gap: 4 }}>
            <NavItem label="Home" href="/" active={active === "/"} />

            {/* Modes + hover dropdown share one hover zone, so the panel
                cannot close while the pointer travels into it. */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={openModes}
              onMouseLeave={scheduleCloseModes}
            >
              <NavItem label="Modes" href="/modes" active={active === "/modes"} hasArrow />
              <AnimatePresence>
                {modesOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: -120,
                      paddingTop: 18,
                      zIndex: 60,
                    }}
                  >
                    <div
                      style={{
                        width: "min(560px, calc(100vw - 64px))",
                        padding: 14,
                        borderRadius: 24,
                        border: "1px solid rgba(255,255,255,0.6)",
                        background: "rgba(255,255,255,0.92)",
                        backdropFilter: "blur(28px) saturate(180%)",
                        WebkitBackdropFilter: "blur(28px) saturate(180%)",
                        boxShadow: "0 24px 60px rgba(31,38,135,0.16)",
                      }}
                    >
                      <div className="k-grid k-grid-2" style={{ gap: 6 }}>
                        {modes.map((mode) => (
                          <Link
                            key={mode.id}
                            href={`/start?mode=${mode.id}`}
                            onClick={() => setModesOpen(false)}
                            className="flex items-center"
                            style={{
                              gap: 12,
                              padding: "10px 12px",
                              borderRadius: 14,
                              textDecoration: "none",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.045)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <ModeGlyph mode={mode.id} size={36} />
                            <span>
                              <span
                                style={{
                                  display: "block",
                                  fontFamily: fontHeading,
                                  fontSize: 14,
                                  fontWeight: 500,
                                  color: "#111111",
                                }}
                              >
                                {mode.name}
                              </span>
                              <span
                                style={{
                                  display: "block",
                                  fontFamily: fontBody,
                                  fontSize: 12,
                                  color: "rgba(0,0,0,0.5)",
                                  lineHeight: 1.4,
                                }}
                              >
                                {mode.description}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/modes"
                        onClick={() => setModesOpen(false)}
                        className="flex items-center justify-center"
                        style={{
                          gap: 6,
                          marginTop: 8,
                          padding: "10px 12px",
                          borderRadius: 14,
                          background: "rgba(0,0,0,0.04)",
                          fontFamily: fontBody,
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#111111",
                          textDecoration: "none",
                        }}
                      >
                        View all modes <ArrowRight size={13} />
                      </Link>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <NavItem label="Pricing" href="/pricing" active={active === "/pricing"} />
            <NavItem label="Queue" href="/queue" active={active === "/queue"} />
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 10, position: "relative", zIndex: 1 }}>
          <MagneticButton
            circleColor="rgba(255,255,255,0.15)"
            circleSize={200}
            onClick={() => router.push("/start")}
            style={{
              borderRadius: 9999,
              background: "#111111",
              color: "#FFFFFF",
              border: "none",
              fontFamily: fontHeading,
              fontSize: 14,
              fontWeight: 600,
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            <Phone size={14} />
            <span className="r-nav-start-text">Start now</span>
          </MagneticButton>

          {/* Account: avatar when signed in, Sign in button otherwise */}
          {auth.signedIn ? (
            <div style={{ position: "relative" }}>
              <button
                type="button"
                aria-label="Account"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 9999,
                  padding: 0,
                  border: "1.5px solid rgba(255,255,255,0.7)",
                  background: "linear-gradient(135deg, #FF9A5C, #E8642A)",
                  boxShadow: "0 4px 12px rgba(232,100,42,0.3)",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                {auth.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={auth.photoUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span
                    style={{
                      fontFamily: fontHeading,
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#FFFFFF",
                    }}
                  >
                    {(auth.label || "?").charAt(0).toUpperCase()}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {profileOpen ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 14px)",
                      right: 0,
                      zIndex: 60,
                      width: 240,
                      padding: 8,
                      borderRadius: 18,
                      border: "1px solid rgba(255,255,255,0.6)",
                      background: "rgba(255,255,255,0.94)",
                      backdropFilter: "blur(28px) saturate(180%)",
                      WebkitBackdropFilter: "blur(28px) saturate(180%)",
                      boxShadow: "0 24px 60px rgba(31,38,135,0.16)",
                    }}
                  >
                    <div style={{ padding: "10px 12px" }}>
                      <p
                        style={{
                          fontFamily: fontHeading,
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#111111",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {auth.label}
                      </p>
                      {auth.email && auth.email !== auth.label ? (
                        <p
                          style={{
                            fontFamily: fontBody,
                            fontSize: 12,
                            color: "rgba(0,0,0,0.5)",
                            margin: "2px 0 0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {auth.email}
                        </p>
                      ) : null}
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center"
                      style={{
                        gap: 8,
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        textDecoration: "none",
                        fontFamily: fontBody,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#111111",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Settings size={14} /> Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleSignOut()}
                      className="flex items-center"
                      style={{
                        gap: 8,
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "none",
                        background: "transparent",
                        fontFamily: fontBody,
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#D6455D",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(214,69,93,0.07)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={14} /> Sign out
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : auth.signedIn === false ? (
            <>
              <Link
                href={signInHref}
                style={{
                  borderRadius: 9999,
                  border: "1px solid rgba(0,0,0,0.14)",
                  background: "rgba(255,255,255,0.55)",
                  color: "#111111",
                  fontFamily: fontHeading,
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "10px 16px",
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.85)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.55)")}
              >
                Sign in
              </Link>
            </>
          ) : null}

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="r-mobile-menu-btn items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 9999,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.8)",
              color: "#111111",
              cursor: "pointer",
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`r-mobile-menu ${mobileOpen ? "open" : ""}`} role="menu">
        <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
        <Link href="/modes" onClick={() => setMobileOpen(false)}>Modes</Link>
        <Link href="/pricing" onClick={() => setMobileOpen(false)}>Pricing</Link>
        <Link href="/queue" onClick={() => setMobileOpen(false)}>Queue</Link>
        <Link href="/start" onClick={() => setMobileOpen(false)}>Start now</Link>
        {auth.signedIn === false ? (
          <>
            <Link href={signInHref} onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <Link href={signUpHref} onClick={() => setMobileOpen(false)}>
              Sign up
            </Link>
          </>
        ) : auth.signedIn ? (
          <>
            <Link href="/account" onClick={() => setMobileOpen(false)}>
              Account
            </Link>
            <a
              role="button"
              onClick={() => {
                setMobileOpen(false);
                void handleSignOut();
              }}
            >
              Sign out
            </a>
          </>
        ) : null}
      </div>
    </>
  );
};

export default LandingNav;
