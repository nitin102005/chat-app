import { MessageCircleIcon } from "lucide-react";

const styleId = "nochathistory-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    @keyframes nchFadeIn {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .nch-root { animation: nchFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }

    /* ── ripple rings ── */
    @keyframes nchRipple {
      0%   { transform: scale(0.85); opacity: 0.5; }
      100% { transform: scale(1.6);  opacity: 0; }
    }
    .nch-ripple {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.18);
      animation: nchRipple 2.4s ease-out infinite;
    }
    .nch-ripple:nth-child(2) { animation-delay: 0.8s; }
    .nch-ripple:nth-child(3) { animation-delay: 1.6s; }

    /* ── icon pulse ── */
    @keyframes nchIconPulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.08); }
    }
    .nch-icon { animation: nchIconPulse 3s ease-in-out infinite; }

    /* ── name highlight shimmer ── */
    @keyframes nchShimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .nch-name {
      background: linear-gradient(
        90deg,
        rgba(255,255,255,0.7) 0%,
        rgba(255,255,255,1)   40%,
        rgba(255,255,255,0.7) 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: nchShimmer 3.5s linear infinite;
    }

    /* ── quick reply chips ── */
    .nch-chip {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 400;
      color: rgba(255,255,255,0.55);
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 999px;
      padding: 7px 14px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
      white-space: nowrap;
    }
    .nch-chip:hover {
      background: rgba(255,255,255,0.09);
      border-color: rgba(255,255,255,0.2);
      color: rgba(255,255,255,0.85);
      transform: translateY(-1px);
    }
    .nch-chip:active { transform: scale(0.96); }

    .nch-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.02em;
      color: rgba(245,245,245,0.82);
      margin: 0 0 10px;
    }
    .nch-sub {
      font-family: 'DM Sans', sans-serif;
      font-weight: 300;
      font-style: italic;
      font-size: 13px;
      color: rgba(255,255,255,0.22);
      line-height: 1.65;
      margin: 0;
    }

    /* ── divider dot trail ── */
    @keyframes nchDotPop {
      0%, 100% { opacity: 0.12; transform: scaleX(1); }
      50%       { opacity: 0.35; transform: scaleX(1.4); }
    }
    .nch-trail-dot {
      width: 3px; height: 3px;
      border-radius: 50%;
      background: #fff;
      animation: nchDotPop 2s ease-in-out infinite;
    }
    .nch-trail-dot:nth-child(2) { animation-delay: 0.3s; }
    .nch-trail-dot:nth-child(3) { animation-delay: 0.6s; }
    .nch-trail-dot:nth-child(4) { animation-delay: 0.9s; }
    .nch-trail-dot:nth-child(5) { animation-delay: 1.2s; }
  `;
  document.head.appendChild(style);
}

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div
      className="nch-root"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        padding: "32px 24px",
        gap: "0",
      }}
    >
      {/* Icon with ripple rings */}
      <div style={{ position: "relative", width: "80px", height: "80px", marginBottom: "28px" }}>
        <div className="nch-ripple" />
        <div className="nch-ripple" />
        <div className="nch-ripple" />

        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 0 30px rgba(255,255,255,0.04)",
          }}
        >
          <MessageCircleIcon
            className="nch-icon"
            style={{ width: "30px", height: "30px", color: "rgba(255,255,255,0.65)" }}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="nch-title">
        Start chatting with{" "}
        <span className="nch-name">{name}</span>
      </h3>

      {/* Subtitle */}
      <p className="nch-sub">
        This is the very beginning of your conversation.
        <br />Send a message to break the ice.
      </p>

      {/* Dot trail divider */}
      <div style={{ display: "flex", gap: "6px", alignItems: "center", margin: "22px 0" }}>
        <div className="nch-trail-dot" />
        <div className="nch-trail-dot" />
        <div className="nch-trail-dot" />
        <div className="nch-trail-dot" />
        <div className="nch-trail-dot" />
      </div>

      {/* Quick reply chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
        <button className="nch-chip">👋 Say Hello</button>
        <button className="nch-chip">🤝 How are you?</button>
        <button className="nch-chip">📅 Meet up soon?</button>
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;