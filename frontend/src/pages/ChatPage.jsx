import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

// ── Responsive breakpoints ──────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => getBreakpoint(window.innerWidth));

  function getBreakpoint(w) {
    if (w < 640) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  }

  useEffect(() => {
    const handler = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return bp;
}

// ── Inject global styles once ───────────────────────────────────────────────
const styleId = "chatpage-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    .chatpage-root {
      font-family: 'DM Sans', sans-serif;
      --cp-bg: #080808;
      --cp-surface: #111111;
      --cp-panel: #0d0d0d;
      --cp-border: rgba(255,255,255,0.07);
      --cp-border-bright: rgba(255,255,255,0.15);
      --cp-text-primary: #f5f5f5;
      --cp-text-secondary: rgba(245,245,245,0.45);
      --cp-accent: #ffffff;
      --cp-glow: rgba(255,255,255,0.08);
    }

    /* ── Noise overlay ── */
    .chatpage-root::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
      opacity: 0.025;
      pointer-events: none;
      z-index: 10;
      border-radius: inherit;
    }

    /* ── Ambient gradient blob ── */
    .chatpage-root::after {
      content: '';
      position: absolute;
      width: 420px;
      height: 420px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%);
      top: -80px;
      left: -80px;
      pointer-events: none;
      z-index: 0;
      animation: blobDrift 12s ease-in-out infinite alternate;
    }

    @keyframes blobDrift {
      0%   { transform: translate(0, 0) scale(1); }
      50%  { transform: translate(60px, 40px) scale(1.1); }
      100% { transform: translate(20px, 80px) scale(0.95); }
    }

    /* ── Scrollbar ── */
    .cp-scroll::-webkit-scrollbar { width: 3px; }
    .cp-scroll::-webkit-scrollbar-track { background: transparent; }
    .cp-scroll::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.12);
      border-radius: 10px;
    }
    .cp-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.25);
    }

    /* ── Left panel slide-in ── */
    .cp-left {
      animation: slideInLeft 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-24px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* ── Right panel fade-in ── */
    .cp-right {
      animation: fadeInRight 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
    }
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(16px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* ── Mobile chat slide-up ── */
    .cp-chat-overlay {
      animation: slideUpChat 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes slideUpChat {
      from { opacity: 0; transform: translateX(100%); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* ── Animated gradient line (top of left panel) ── */
    .cp-gradient-line {
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255,255,255,0.6) 30%,
        rgba(255,255,255,0.9) 50%,
        rgba(255,255,255,0.6) 70%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: shimmer 3s ease-in-out infinite;
    }
    @keyframes shimmer {
      0%   { background-position: -100% 0; }
      100% { background-position: 200% 0; }
    }

    /* ── Divider between panels ── */
    .cp-divider {
      width: 1px;
      background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(255,255,255,0.12) 20%,
        rgba(255,255,255,0.18) 50%,
        rgba(255,255,255,0.12) 80%,
        transparent 100%
      );
      flex-shrink: 0;
    }

    /* ── Corner accent marks ── */
    .cp-corner {
      position: absolute;
      width: 12px;
      height: 12px;
      opacity: 0.4;
    }
    .cp-corner-tl { top: 0; left: 0; border-top: 1px solid #fff; border-left: 1px solid #fff; }
    .cp-corner-tr { top: 0; right: 0; border-top: 1px solid #fff; border-right: 1px solid #fff; }
    .cp-corner-bl { bottom: 0; left: 0; border-bottom: 1px solid #fff; border-left: 1px solid #fff; }
    .cp-corner-br { bottom: 0; right: 0; border-bottom: 1px solid #fff; border-right: 1px solid #fff; }

    /* ── Status dot pulse ── */
    .cp-status-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 0 0 0 rgba(255,255,255,0.5);
      animation: statusPulse 2.5s ease-in-out infinite;
    }
    @keyframes statusPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
      50%       { box-shadow: 0 0 0 5px rgba(255,255,255,0); }
    }

    /* ── Subtle scan line ── */
    .cp-scanline {
      position: absolute;
      left: 0; right: 0;
      height: 60px;
      background: linear-gradient(180deg, transparent, rgba(255,255,255,0.015), transparent);
      pointer-events: none;
      animation: scanDown 8s linear infinite;
      z-index: 5;
    }
    @keyframes scanDown {
      0%   { top: -60px; }
      100% { top: 100%; }
    }

    /* ── Back button ── */
    .cp-back-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 8px;
      padding: 6px 12px;
      color: rgba(255,255,255,0.7);
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s, color 0.2s;
      letter-spacing: 0.04em;
    }
    .cp-back-btn:hover {
      background: rgba(255,255,255,0.1);
      color: #fff;
    }
    .cp-back-btn svg {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
    }
  `;
  document.head.appendChild(style);
}

// ── Back arrow icon ────────────────────────────────────────────────────────
function BackArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

// ── Left panel ─────────────────────────────────────────────────────────────
function LeftPanel({ activeTab, isMobile, panelWidth }) {
  return (
    <div
      className="cp-left relative z-10 flex flex-col"
      style={{
        width: isMobile ? "100%" : panelWidth,
        flexShrink: 0,
        background: "var(--cp-surface)",
        borderRight: "none",
        height: "100%",
      }}
    >
      <div className="cp-gradient-line" />

      <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.25)",
        }}>
          Messages
        </span>
        <span className="cp-status-dot" />
      </div>

      <div style={{ padding: "0 16px 4px" }}>
        <div style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "2px",
        }}>
          <ProfileHeader />
        </div>
      </div>

      <div style={{ padding: "10px 16px 6px" }}>
        <ActiveTabSwitch />
      </div>

      <div style={{ margin: "0 20px", height: "1px", background: "rgba(255,255,255,0.06)" }} />

      <div className="cp-scroll" style={{
        flex: 1,
        overflowY: "auto",
        padding: "12px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}>
        {activeTab === "chats" ? <ChatsList /> : <ContactList />}
      </div>

      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "48px",
        background: "linear-gradient(to top, var(--cp-surface), transparent)",
        pointerEvents: "none",
        zIndex: 2,
      }} />
    </div>
  );
}

// ── Right panel ────────────────────────────────────────────────────────────
function RightPanel({ selectedUser, isMobile, onBack }) {
  return (
    <div
      className={`cp-right relative z-10 flex flex-col${isMobile ? " cp-chat-overlay" : ""}`}
      style={{
        flex: 1,
        width: isMobile ? "100%" : undefined,
        background: "var(--cp-panel)",
        minHeight: 0,
        display: "flex",
        flexDirection: "row",
        backgroundImage: `
          radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.025) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.015) 0%, transparent 50%)
        `,
        overflow: "hidden",
        position: isMobile ? "absolute" : "relative",
        inset: isMobile ? 0 : undefined,
      }}
    >
      {/* Grid overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        zIndex: 0,
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }} />

      {/* Mobile back button */}
      {isMobile && (
        <div style={{ position: "relative", zIndex: 2, padding: "12px 16px 0" }}>
          <button className="cp-back-btn" onClick={onBack}>
            <BackArrow />
            Back
          </button>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

// ── Main ChatPage ──────────────────────────────────────────────────────────
function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();
  const bp = useBreakpoint();

  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const showChatOverlay = isMobile && !!selectedUser;

  // Left panel width per breakpoint
  const panelWidth = isTablet ? "260px" : "320px";

  // On mobile: container fills viewport height; on desktop: fixed height
  const containerHeight = isMobile ? "100svh" : isTablet ? "calc(100svh - 32px)" : "680px";
  const containerMaxW = isMobile ? "100%" : isTablet ? "100%" : "1152px";
  const containerRadius = isMobile ? "0px" : "16px";

  return (
    <div
      className="chatpage-root relative flex overflow-hidden"
      style={{
        width: "100%",
        maxWidth: containerMaxW,
        height: containerHeight,
        background: "var(--cp-bg)",
        border: isMobile ? "none" : "1px solid var(--cp-border-bright)",
        borderRadius: containerRadius,
        boxShadow: isMobile ? "none" : `
          0 0 0 1px rgba(255,255,255,0.04),
          0 32px 80px rgba(0,0,0,0.8),
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.06)
        `,
      }}
    >
      {/* Corner accents — desktop only */}
      {!isMobile && (
        <>
          <span className="cp-corner cp-corner-tl" />
          <span className="cp-corner cp-corner-tr" />
          <span className="cp-corner cp-corner-bl" />
          <span className="cp-corner cp-corner-br" />
        </>
      )}

      <div className="cp-scanline" />

      {/* ── MOBILE: show either list OR chat ── */}
      {isMobile ? (
        <>
          {/* Always render list underneath */}
          <LeftPanel activeTab={activeTab} isMobile panelWidth="100%" />

          {/* Slide chat over the top when a user is selected */}
          {showChatOverlay && (
            <RightPanel
              selectedUser={selectedUser}
              isMobile
              onBack={() => setSelectedUser(null)}
            />
          )}
        </>
      ) : (
        /* ── TABLET / DESKTOP: side-by-side ── */
        <>
          <LeftPanel activeTab={activeTab} isMobile={false} panelWidth={panelWidth} />
          <div className="cp-divider" style={{ zIndex: 10 }} />
          <RightPanel selectedUser={selectedUser} isMobile={false} />
        </>
      )}
    </div>
  );
}

export default ChatPage;
