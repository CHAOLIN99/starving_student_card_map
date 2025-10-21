import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #eee",
        padding: 12,
        textAlign: "center",
        fontSize: 13,
        color: "#666",
      }}
    >
      © {new Date().getFullYear()} Starving Student Card Map Group from BYU CS 428.
    </footer>
  );
}
