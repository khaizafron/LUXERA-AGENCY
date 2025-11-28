"use client";

export default function NavGlassItemMobile({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 rounded-xl transition-all
        ${active ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}
      `}
    >
      {children}
    </button>
  );
}
