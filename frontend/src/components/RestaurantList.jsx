import React from "react";

export default function RestaurantList({
  items = [],
  onSelect,
  style,
  showSearch,
  onSearch,
}) {
  return (
    <div style={{ width: 320, maxWidth: 920, margin: "0 auto", ...style }}>
      <h2 style={{ marginTop: 0 }}>Restaurants</h2>
      {showSearch && (
        <input
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search restaurants or deals"
          style={{
            width: "100%",
            padding: "8px 10px",
            marginBottom: 12,
            borderRadius: 6,
            border: "1px solid #ddd",
            boxSizing: "border-box",
          }}
        />
      )}
      <div
        style={{
          maxHeight: "72vh",
          overflowY: "auto",
          border: "1px solid #eee",
          borderRadius: 8,
          background: "#fff",
        }}
      >
        <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
          {items.map((r) => (
            <li
              key={r.id}
              style={{
                padding: 12,
                borderBottom: "1px solid #f1f1f1",
                cursor: "pointer",
              }}
              onClick={() => onSelect?.(r)}
            >
              <div style={{ fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontSize: 12, color: "red" }}>{`Max uses: ${
                r.numUses === null ? "NO LIMIT" : r.numUses
              }`}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{r.deal}</div>
            </li>
          ))}
          {items.length === 0 && (
            <li style={{ padding: 12, color: "#666" }}>No restaurants yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}