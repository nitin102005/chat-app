import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
  MessageCircleIcon,
  MailIcon,
  LoaderIcon,
  LockIcon,
} from "lucide-react";
import { Link } from "react-router";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// Inject Google Fonts once
const styleTag = typeof document !== "undefined" && (() => {
  if (document.getElementById("font-style")) return;
  const s = document.createElement("style");
  s.id = "font-style";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  `;
  document.head.appendChild(s);
})();

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-linear-to-br from-black via-zinc-900 to-black p-4 font-[DM_Sans]">
      <div className="relative pb-10 w-full max-w-6xl md:h-[720px] h-auto">

        <div className="flex flex-col md:flex-row w-full h-full rounded-2xl overflow-hidden backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(255,255,255,0.05)]">

          {/* LEFT SIDE */}
          <div className="md:w-1/2 p-10 flex items-center justify-center bg-white border-r border-gray-200">
            <div className="w-full max-w-md">

              {/* HEADER */}
              <div className="text-center mb-10">
                <MessageCircleIcon className="w-12 h-12 mx-auto text-gray-700 mb-4" />

                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight font-[Syne]">
                  Welcome Back
                </h2>

                <p className="text-gray-500 text-sm font-[DM_Sans]">
                  Login to continue your journey 🚀
                </p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* EMAIL */}
                <div>
                  <label className="text-gray-600 text-sm mb-1 block font-[DM_Sans] uppercase tracking-wide">
                    Email
                  </label>

                  <div className="relative group">
                    <MailIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-gray-700 transition" />

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="johndoe@gmail.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all font-[DM_Sans]"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-gray-600 text-sm mb-1 block font-[DM_Sans] uppercase tracking-wide">
                    Password
                  </label>

                  <div className="relative group">
                    <LockIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-gray-700 transition" />

                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all font-[DM_Sans]"
                    />
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 rounded-lg bg-black text-white font-semibold tracking-wider font-[Syne] uppercase hover:bg-black/90 transition-all active:scale-[0.98] flex items-center justify-center shadow-md"
                >
                  {isLoggingIn ? (
                    <LoaderIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* SIGNUP LINK */}
              <div className="mt-6 text-center text-sm text-gray-500 font-[DM_Sans]">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-black font-medium hover:underline font-[Syne]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center bg-linear-to-br from-black via-zinc-900 to-black p-8 relative">

            <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl" />

            <div className="relative text-center">
              <DotLottieReact
                src="https://lottie.host/85f9e843-5f4a-4ede-8281-ce5caff5925c/6FTsR5wAJ3.json"
                loop
                autoplay
                className="w-[550px] h-[380px]"
              />

              <h3 className="mt-6 text-xl font-semibold text-white font-[Syne]">
                Connect anytime, anywhere
              </h3>

              <div className="mt-4 flex justify-center gap-3">
                {["Fast", "Secure", "Reliable"].map((item, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 text-xs rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition font-[DM_Sans]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
