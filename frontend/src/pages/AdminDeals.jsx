import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { authHeaders, isAdmin } from "../utils/auth";

export default function AdminDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    description: "",
    storeName: "",
    numUses: 1,
    addresses: [""],
    type: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/admin/login");
      return;
    }
    fetchDeals();
  }, []);

  async function fetchDeals() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/deal");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch deals");
      setDeals(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function addDeal(e) {
    e.preventDefault();
    setError("");
    const payload = {
      description: form.description,
      storeName: form.storeName,
      numUses: form.numUses === "" ? null : Number(form.numUses),
      type: form.type || null,
      addresses: form.addresses?.filter((a) => a?.trim()) ?? undefined,
    };
    try {
      const res = await fetch("http://localhost:3000/api/deal", {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to add deal");
      setForm({
        description: "",
        storeName: "",
        numUses: 1,
        addresses: [""],
        type: "",
      });
      await fetchDeals();
    } catch (e) {
      setError(e.message);
    }
  }

  async function deleteDeal(id) {
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/api/deal/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to delete deal");
      }
      await fetchDeals();
    } catch (e) {
      setError(e.message);
    }
  }

  function updateAddress(idx, val) {
    const next = [...form.addresses];
    next[idx] = val;
    setForm({ ...form, addresses: next });
  }

  function addAddressField() {
    setForm({ ...form, addresses: [...(form.addresses || []), ""] });
  }

  function removeAddressField(idx) {
    const next = [...form.addresses];
    next.splice(idx, 1);
    setForm({ ...form, addresses: next });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f7f7f8",
      }}
    >
      <Header />
      <main style={{ flex: 1, padding: 20, maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>Admin: Manage Deals</h2>
          <button
            onClick={() => navigate("/admin/login")}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          >
            Switch Account
          </button>
        </div>

        {error && (
          <div
            style={{
              background: "#ffecec",
              color: "#b20000",
              padding: "8px 10px",
              borderRadius: 6,
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <section
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Add New Deal</h3>
          <form
            onSubmit={addDeal}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={{ fontSize: 12 }}>Description</label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12 }}>Store Name</label>
              <input
                value={form.storeName}
                onChange={(e) =>
                  setForm({ ...form, storeName: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12 }}>
                Num Uses (empty = no limit)
              </label>
              <input
                type="number"
                min="1"
                value={form.numUses}
                onChange={(e) => setForm({ ...form, numUses: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12 }}>Type (optional)</label>
              <input
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              />
            </div>

            <div style={{ gridColumn: "1 / span 2" }}>
              <label style={{ fontSize: 12 }}>Addresses (optional)</label>
              {(form.addresses || []).map((addr, idx) => (
                <div
                  key={idx}
                  style={{ display: "flex", gap: 8, marginTop: 6 }}
                >
                  <input
                    value={addr}
                    onChange={(e) => updateAddress(idx, e.target.value)}
                    placeholder="123 Main St, City, ST 00000"
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeAddressField(idx)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addAddressField}
                style={{
                  marginTop: 8,
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #ddd",
                }}
              >
                Add address
              </button>
            </div>

            <div style={{ gridColumn: "1 / span 2" }}>
              <button
                type="submit"
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  fontWeight: 600,
                }}
              >
                Create Deal
              </button>
            </div>
          </form>
        </section>

        <section
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 16,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Existing Deals</h3>
          {loading ? (
            <div>Loading...</div>
          ) : deals.length === 0 ? (
            <div>No deals found.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {deals.map((d) => (
                <li
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    padding: "8px 0",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {d.store?.name} — {d.description}
                    </div>
                    <div style={{ color: "#666", fontSize: 12 }}>
                      Uses: {d.numUses ?? "No limit"}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteDeal(d.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
