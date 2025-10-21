import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const UTAH_CENTER = [39.32, -111.0937];

export default function MapView({
  children,
  markers = [],
  onMarkerClick,
  height = "70vh",
}) {
  return (
    <div
      style={{ flex: 1, borderRadius: 8, overflow: "hidden", minHeight: 200 }}
    >
      <MapContainer
        center={UTAH_CENTER}
        zoom={6}
        style={{ height: height, width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <CircleMarker
            key={m.id}
            center={m.latlng}
            radius={8}
            pathOptions={{
              color: "#ff5722",
              fillColor: "#ff9800",
              fillOpacity: 0.9,
            }}
            eventHandlers={{
              click: () => onMarkerClick?.(m),
            }}
          >
            <Popup>
              <strong>{m.name}</strong>
              <div style={{ fontSize: 12 }}>{m.deal}</div>
            </Popup>
          </CircleMarker>
        ))}
        {children}
      </MapContainer>
    </div>
  );
}
