import { MessageCircleIcon } from "lucide-react";

const styleId = "noconv-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400&display=swap');

    /* ── Fade in entire placeholder ── */
    @keyframes ncpFadeIn {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ncp-root {
      animation: ncpFadeIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* ── Orbit ring ── */
    @keyframes ncpOrbit {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes ncpOrbitReverse {
      from { transform: rotate(0deg); }
      to   { transform: rotate(-360deg); }
    }

    .ncp-ring-outer {
      animation: ncpOrbit 12s linear infinite;
    }
    .ncp-ring-inner {
      animation: ncpOrbitReverse 8s linear infinite;
    }

    /* ── Icon pulse ── */
    @keyframes ncpIconPulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.06); }
    }
    .ncp-icon {
      animation: ncpIconPulse 3.5s ease-in-out infinite;
    }

    /* ── Dot blink ── */
    @keyframes ncpDotBlink {
      0%, 80%, 100% { opacity: 0.15; transform: scale(0.8); }
      40%           { opacity: 0.6;  transform: scale(1); }
    }
    .ncp-dot { animation: ncpDotBlink 1.6s ease-in-out infinite; }
    .ncp-dot:nth-child(2) { animation-delay: 0.2s; }
    .ncp-dot:nth-child(3) { animation-delay: 0.4s; }

    /* ── Headline ── */
    .ncp-title {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 22px;
      letter-spacing: -0.02em;
      color: rgba(245,245,245,0.85);
      margin: 0 0 10px;
    }

    .ncp-sub {
      font-family: 'DM Sans', sans-serif;
      font-weight: 300;
      font-size: 13.5px;
      line-height: 1.65;
      color: rgba(255,255,255,0.28);
      max-width: 260px;
      margin: 0 auto;
    }

    /* ── Hint chips ── */
    .ncp-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 400;
      color: rgba(255,255,255,0.25);
      letter-spacing: 0.02em;
    }
  `;
  document.head.appendChild(style);
}

const NoConversationPlaceholder = () => {
  return (
    <div
      className="ncp-root"
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
      {/* Icon with orbiting rings */}
      <div style={{ position: "relative", width: "96px", height: "96px", marginBottom: "28px" }}>

        {/* Outer orbit ring */}
        <div
          className="ncp-ring-outer"
          style={{
            position: "absolute",
            inset: "-16px",
            borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        >
          {/* Orbiting dot */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "-3px",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.4)",
            transform: "translateY(-50%)",
            boxShadow: "0 0 6px rgba(255,255,255,0.3)",
          }} />
        </div>

        {/* Inner orbit ring */}
        <div
          className="ncp-ring-inner"
          style={{
            position: "absolute",
            inset: "-6px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Orbiting dot */}
          <div style={{
            position: "absolute",
            top: "-3px",
            left: "50%",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            transform: "translateX(-50%)",
          }} />
        </div>

        {/* Icon container */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <MessageCircleIcon
            className="ncp-icon"
            style={{ width: "36px", height: "36px", color: "rgba(255,255,255,0.6)" }}
          />
        </div>
      </div>

      {/* Text */}
      <h3 className="ncp-title">No conversation open</h3>
      <p className="ncp-sub">
        Pick someone from the sidebar to start a new thread or continue where you left off.
      </p>

      {/* Animated dots */}
      <div style={{ display: "flex", gap: "6px", margin: "24px 0 28px" }}>
        <div className="ncp-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />
        <div className="ncp-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />
        <div className="ncp-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#fff" }} />
      </div>

      {/* Hint chips */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        <span className="ncp-chip">
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          Search contacts
        </span>
        <span className="ncp-chip">
          <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
          Start a new chat
        </span>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;