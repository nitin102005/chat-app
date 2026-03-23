import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

// Inject styles once
const styleId = "chatcontainer-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

    .cc-root {
      font-family: 'DM Sans', sans-serif;
    }

    /* ── Scroll area ── */
    .cc-scroll::-webkit-scrollbar { width: 3px; }
    .cc-scroll::-webkit-scrollbar-track { background: transparent; }
    .cc-scroll::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.08);
      border-radius: 10px;
    }
    .cc-scroll::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.18);
    }

    /* ── Message bubble animations ── */
    @keyframes bubbleInRight {
      from { opacity: 0; transform: translateX(20px) scale(0.96); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes bubbleInLeft {
      from { opacity: 0; transform: translateX(-20px) scale(0.96); }
      to   { opacity: 1; transform: translateX(0) scale(1); }
    }

    .cc-bubble-self {
      animation: bubbleInRight 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .cc-bubble-other {
      animation: bubbleInLeft 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* ── Self bubble: white filled ── */
    .cc-msg-self {
      background: #ffffff;
      color: #0a0a0a;
      border-radius: 18px 18px 4px 18px;
      padding: 10px 14px;
      max-width: 68%;
      box-shadow: 0 2px 12px rgba(255,255,255,0.10), 0 1px 3px rgba(0,0,0,0.4);
      position: relative;
    }

    /* ── Other bubble: dark glass ── */
    .cc-msg-other {
      background: rgba(255,255,255,0.06);
      color: rgba(245,245,245,0.9);
      border-radius: 18px 18px 18px 4px;
      padding: 10px 14px;
      max-width: 68%;
      border: 1px solid rgba(255,255,255,0.09);
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      position: relative;
      backdrop-filter: blur(8px);
    }

    /* ── Timestamp ── */
    .cc-timestamp-self  { color: rgba(10,10,10,0.45); font-size: 10px; margin-top: 4px; text-align: right; }
    .cc-timestamp-other { color: rgba(245,245,245,0.3); font-size: 10px; margin-top: 4px; }

    /* ── Date separator ── */
    .cc-date-sep {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 8px 0;
    }
    .cc-date-sep::before,
    .cc-date-sep::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.07);
    }
    .cc-date-label {
      font-family: 'Syne', sans-serif;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.2);
      white-space: nowrap;
    }

    /* ── Image inside bubble ── */
    .cc-msg-image {
      border-radius: 10px;
      max-height: 200px;
      width: 100%;
      object-fit: cover;
      display: block;
      margin-bottom: 6px;
    }

    /* ── Gradient overlay top/bottom for scroll fade ── */
    .cc-fade-top {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 56px;
      background: linear-gradient(to bottom, #0d0d0d, transparent);
      pointer-events: none;
      z-index: 5;
    }
    .cc-fade-bottom {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 56px;
      background: linear-gradient(to top, #0d0d0d, transparent);
      pointer-events: none;
      z-index: 5;
    }
  `;
  document.head.appendChild(style);
}

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="cc-root" style={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      height: "100%",
    }}>
      {/* Header */}
      <ChatHeader />

      {/* Message area */}
      <div style={{ flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column", // 🔥 REQUIRED
    minHeight: 0,   }}>
        {/* Scroll fade overlays */}
        <div className="cc-fade-top" />
        <div className="cc-fade-bottom" />

        <div
          className="cc-scroll"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "32px 24px",
          }}
        >
          {messages.length > 0 && !isMessagesLoading ? (
            <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "6px" }}>

              {/* Today separator */}
              <div className="cc-date-sep" style={{ marginBottom: "12px" }}>
                <span className="cc-date-label">Today</span>
              </div>

              {messages.map((msg, index) => {
                const isSelf = msg.senderId === authUser._id;
                const prevMsg = messages[index - 1];
                const isGrouped = prevMsg && prevMsg.senderId === msg.senderId;

                return (
                  <div
                    key={msg._id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isSelf ? "flex-end" : "flex-start",
                      marginTop: isGrouped ? "2px" : "12px",
                    }}
                  >
                    <div className={isSelf ? "cc-bubble-self" : "cc-bubble-other"}>
                      <div className={isSelf ? "cc-msg-self" : "cc-msg-other"}>
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="Shared"
                            className="cc-msg-image"
                          />
                        )}
                        {msg.text && (
                          <p style={{
                            margin: 0,
                            fontSize: "14px",
                            lineHeight: "1.5",
                            fontWeight: 400,
                            whiteSpace: "pre-wrap",        // keep formatting
                            overflowWrap: "break-word",    // only break when needed
                            wordBreak: "normal",           // 🔥 keeps spacing + wraps
                          }}>
                            {msg.text}
                          </p>
                        )}
                        <p className={isSelf ? "cc-timestamp-self" : "cc-timestamp-other"}>
                          {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messageEndRef} />
            </div>
          ) : isMessagesLoading ? (
            <MessagesLoadingSkeleton />
          ) : (
            <NoChatHistoryPlaceholder name={selectedUser.fullName} />
          )}
        </div>
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}

export default ChatContainer;