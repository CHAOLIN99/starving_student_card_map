import React from "react";

export default function Header({ onSearch }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #eee",
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>
          Starving Student Map
        </div>
        <div style={{ color: "#666", fontSize: 13 }}>
          Digital version of your Starving Student Card
        </div>
      </div>
      <div>
        <input
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search restaurants or deals"
          style={{
            padding: "8px 10px",
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
        />
      </div>
    </header>
  );
}
