import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const styleId = "nochats-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

    @keyframes ncfFadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ncf-root {
      animation: ncfFadeIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* ── Icon shimmer ring ── */
    @keyframes ncfSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    .ncf-spin-ring {
      animation: ncfSpin 10s linear infinite;
    }

    /* ── Icon float ── */
    @keyframes ncfFloat {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-4px); }
    }
    .ncf-icon-wrap {
      animation: ncfFloat 4s ease-in-out infinite;
    }

    /* ── CTA button ── */
    .ncf-btn {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #0a0a0a;
      background: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 9px 20px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 2px 12px rgba(255,255,255,0.15);
    }
    .ncf-btn:hover {
      transform: translateY(-1px) scale(1.03);
      box-shadow: 0 6px 20px rgba(255,255,255,0.22);
    }
    .ncf-btn:active {
      transform: scale(0.97);
    }

    .ncf-title {
      font-family: 'Syne', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: rgba(245,245,245,0.8);
      margin: 0 0 6px;
      letter-spacing: -0.01em;
    }
    .ncf-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: 12px;
      font-weight: 300;
      color: rgba(255,255,255,0.25);
      line-height: 1.6;
      margin: 0;
      padding: 0 8px;
    }
  `;
  document.head.appendChild(style);
}

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div
      className="ncf-root"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        textAlign: "center",
        gap: "16px",
      }}
    >
      {/* Icon */}
      <div style={{ position: "relative", width: "64px", height: "64px" }}>
        {/* Spinning dashed ring */}
        <div
          className="ncf-spin-ring"
          style={{
            position: "absolute",
            inset: "-10px",
            borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <div style={{
            position: "absolute",
            top: "-3px",
            left: "50%",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            transform: "translateX(-50%)",
            boxShadow: "0 0 6px rgba(255,255,255,0.25)",
          }} />
        </div>

        {/* Icon circle */}
        <div
          className="ncf-icon-wrap"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <MessageCircleIcon style={{ width: "26px", height: "26px", color: "rgba(255,255,255,0.5)" }} />
        </div>
      </div>

      {/* Text */}
      <div>
        <h4 className="ncf-title">No conversations yet</h4>
        <p className="ncf-sub">
          Start a chat by selecting a contact from the contacts tab
        </p>
      </div>

      {/* CTA */}
      <button
        onClick={() => setActiveTab("contacts")}
        className="ncf-btn"
      >
        Find contacts
      </button>
    </div>
  );
}

export default NoChatsFound;