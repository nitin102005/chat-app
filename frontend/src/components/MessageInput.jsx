import { useRef, useState } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

// Inject styles once
const styleId = "messageinput-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

    .mi-root {
      font-family: 'DM Sans', sans-serif;
    }

    /* ── Top border gradient line ── */
    .mi-border-line {
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255,255,255,0.08) 20%,
        rgba(255,255,255,0.15) 50%,
        rgba(255,255,255,0.08) 80%,
        transparent 100%
      );
    }

    /* ── Input field ── */
    .mi-input {
      flex: 1;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 11px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: rgba(245,245,245,0.9);
      outline: none;
      transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
      caret-color: #ffffff;
    }
    .mi-input::placeholder {
      color: rgba(255,255,255,0.2);
      font-weight: 300;
    }
    .mi-input:focus {
      border-color: rgba(255,255,255,0.22);
      background: rgba(255,255,255,0.06);
      box-shadow: 0 0 0 3px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.04);
    }

    /* ── Image attach button ── */
    .mi-attach-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.04);
      color: rgba(255,255,255,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .mi-attach-btn:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.18);
      color: rgba(255,255,255,0.7);
    }
    .mi-attach-btn.active {
      background: rgba(255,255,255,0.1);
      border-color: rgba(255,255,255,0.3);
      color: #ffffff;
    }

    /* ── Send button ── */
    .mi-send-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: none;
      background: #ffffff;
      color: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
      box-shadow: 0 2px 12px rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.4);
    }
    .mi-send-btn:hover:not(:disabled) {
      transform: scale(1.06);
      box-shadow: 0 4px 20px rgba(255,255,255,0.25), 0 2px 6px rgba(0,0,0,0.4);
    }
    .mi-send-btn:active:not(:disabled) {
      transform: scale(0.97);
    }
    .mi-send-btn:disabled {
      background: rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.2);
      cursor: not-allowed;
      box-shadow: none;
    }

    /* ── Image preview ── */
    .mi-preview-wrap {
      animation: previewSlideIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes previewSlideIn {
      from { opacity: 0; transform: translateY(8px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .mi-preview-img {
      width: 72px;
      height: 72px;
      object-fit: cover;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.12);
      display: block;
    }

    .mi-remove-btn {
      position: absolute;
      top: -7px;
      right: -7px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ffffff;
      color: #0a0a0a;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s ease;
      box-shadow: 0 1px 6px rgba(0,0,0,0.5);
    }
    .mi-remove-btn:hover {
      transform: scale(1.15);
    }

    /* ── Character count nudge ── */
    .mi-char-count {
      font-size: 10px;
      color: rgba(255,255,255,0.18);
      letter-spacing: 0.04em;
      transition: color 0.2s;
    }
    .mi-char-count.warn { color: rgba(255,180,50,0.6); }
  `;
  document.head.appendChild(style);
}

function MessageInput() {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSoundEnabled } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();
    sendMessage({ text: text.trim(), image: imagePreview });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const charWarn = text.length > 400;

  return (
    <div className="mi-root" style={{ flexShrink: 0 }}>
      {/* Top divider */}
      <div className="mi-border-line" />

      <div style={{ padding: "14px 20px 16px" }}>
        {/* Image preview */}
        {imagePreview && (
          <div
            className="mi-preview-wrap"
            style={{
              maxWidth: "720px",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={imagePreview} alt="Preview" className="mi-preview-img" />
              <button
                onClick={removeImage}
                className="mi-remove-btn"
                type="button"
                aria-label="Remove image"
              >
                <XIcon style={{ width: "10px", height: "10px" }} />
              </button>
            </div>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", fontWeight: 300 }}>
              Image attached
            </span>
          </div>
        )}

        {/* Input row */}
        <form
          onSubmit={handleSendMessage}
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Text input */}
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              isSoundEnabled && playRandomKeyStrokeSound();
            }}
            className="mi-input"
            placeholder="Write a message…"
            autoComplete="off"
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Char count — subtle nudge */}
          {text.length > 200 && (
            <span className={`mi-char-count${charWarn ? " warn" : ""}`}>
              {text.length}
            </span>
          )}

          {/* Attach image */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`mi-attach-btn${imagePreview ? " active" : ""}`}
            aria-label="Attach image"
          >
            <ImageIcon style={{ width: "17px", height: "17px" }} />
          </button>

          {/* Send */}
          <button
            type="submit"
            disabled={!text.trim() && !imagePreview}
            className="mi-send-btn"
            aria-label="Send message"
          >
            <SendIcon style={{ width: "16px", height: "16px" }} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageInput;