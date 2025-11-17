import React from "react";

export default function RestaurantList({ items = [], onSelect }) {
  return (
    <div style={{ width: 320, maxWidth: 920, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Restaurants</h2>
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
