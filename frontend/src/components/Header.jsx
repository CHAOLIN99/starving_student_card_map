import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";

export default function Header({ onSearch }) {
  const loggedIn = isLoggedIn();
  const navigate = useNavigate?.();

  async function handleLogout() {
    await logout();
    navigate && navigate("/login");
  }
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
        <div style={{ display: "inline-flex", gap: 8, marginLeft: 12 }}>
          {!loggedIn && (
            <>
              <Link
                to="/login"
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: "#3b82f6",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: "#16a34a",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 13,
                }}
              >
                Register
              </Link>
            </>
          )}
          {loggedIn && (
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: "#ef4444",
                color: "#fff",
                border: "none",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
