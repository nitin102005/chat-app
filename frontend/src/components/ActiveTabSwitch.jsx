import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-1 m-2">

      {/* Chats Tab */}
      <button
        onClick={() => setActiveTab("chats")}
        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${
            activeTab === "chats"
              ? "bg-white/10 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
      >
        Chats
      </button>

      {/* Contacts Tab */}
      <button
        onClick={() => setActiveTab("contacts")}
        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${
            activeTab === "contacts"
              ? "bg-white/10 text-white shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
      >
        Contacts
      </button>
    </div>
  );
}

export default ActiveTabSwitch;
