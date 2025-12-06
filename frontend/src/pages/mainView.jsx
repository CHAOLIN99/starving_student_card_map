import React, { useEffect, useState, useRef } from "react";
import MapView from "../components/MapView";
import RestaurantList from "../components/RestaurantList";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
// import { latLng } from "leaflet";

// ```
// sample front end deal {
//     id: "asdfjl-sdfkj;l",
//     deal: "BOGO",
//     name: "CHOM",
//.    numUses: 3 // can be null for no limit
//     latlngs:[[-1,2], [3,2]]
// }
// ```
export default function MainView() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [deals, setDeals] = useState([]);
  const hasFetched = useRef(false);

  // Mobile responsiveness
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showDeals, setShowDeals] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function fetchDeals() {
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("http://localhost:3000/api/deal")
      .then((response) =>
        response.json().then((data) => {
          if (response.status === 200) {
            // console.log(data);
            const deals = [];
            for (let i = 0; i < data.length; i++) {
              const store = data[i].store;
              // console.log(store);
              const dealNoLatlng = {
                id: data[i].id,
                deal: data[i].description,
                name: store.name,
                numUses: data[i].numUses,
              };
              if (store.locations.length == 0) {
                deals.push({ ...dealNoLatlng, latlngs: null });
              } else {
                const latlngs = [];
                for (let j = 0; j < store.locations.length; j++) {
                  latlngs.push([
                    store.locations[j].lat,
                    store.locations[j].long,
                  ]);
                }
                deals.push({ ...dealNoLatlng, latlngs });
              }
            }
            // console.log("RESULT FROM FETCH Setting reformatted deals");
            // // console.log(deals);
            setDeals(deals);
          } else {
            console.log(`BAD RESPONSE -- ${response.status}:  ${data}`);
          }
        })
      )
      .catch((error) => console.log(`Error fetching deals! \n ${error.stack}`));
  }

  useEffect(() => {
    fetchDeals();
  }, []);

  function getMarkers(deals) {
    const filteredDeals = deals.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.deal.toLowerCase().includes(query.toLowerCase())
    );

    let markerCounter = 1;

    const markers = filteredDeals.flatMap((deal) =>
      (deal.latlngs ?? []).map((latlng) => ({
        ...deal,
        markerId: markerCounter++,
        latlng, // single coordinate pair
      }))
    );

    return markers;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f7f7f8",
        overflowX: "hidden",
      }}
    >
      <Header
        onSearch={setQuery}
        isMobile={isMobile}
        onToggleDeals={() => setShowDeals(true)}
      />
      <main
        style={{
          display: "flex",
          padding: isMobile ? 0 : 20,
          gap: 12,
          flex: 1,
          position: "relative",
        }}
      >
        <div style={{ flex: 1, position: "relative" }}>
          <MapView
            markers={getMarkers(deals)}
            onMarkerClick={setSelected}
            height={isMobile ? "100%" : "80vh"}
          >
            {selected && (
              <div
                style={{
                  position: "absolute",
                  right: 40,
                  top: 40,
                  background: "#fff",
                  padding: 8,
                  borderRadius: 6,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <strong>{selected.name}</strong>
                <div style={{ fontSize: 12 }}>{selected.deal}</div>
              </div>
            )}
          </MapView>
          {isMobile && (
            <button
              onClick={() => setShowDeals(!showDeals)}
              style={{
                position: "absolute",
                top: "50%",
                right: 0,
                zIndex: 1002,
                transform: "translateY(-50%)",
                background: "#fff",
                border: "1px solid #ccc",
                borderRight: "none",
                borderRadius: "8px 0 0 8px",
                padding: "10px 5px",
                cursor: "pointer",
                boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
              }}
            >
              {showDeals ? ">" : "<"}
            </button>
          )}
        </div>
        <RestaurantList
          items={deals.filter(
            (r) =>
              r.name.toLowerCase().includes(query.toLowerCase()) ||
              r.deal.toLowerCase().includes(query.toLowerCase())
          )}
          onSelect={(item) => {
            setSelected(item);
            if (isMobile) setShowDeals(false);
          }}
          showSearch={isMobile}
          onSearch={setQuery}
          style={
            isMobile
              ? {
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  zIndex: 1001,
                  margin: 0,
                  transform: showDeals ? "translateX(0)" : "translateX(100%)",
                  transition: "transform 0.3s ease-in-out",
                  maxWidth: "none",
                  padding: "20px",
                  backgroundColor: "#fff",
                  boxSizing: "border-box",
                }
              : {}
          }
        />
      </main>
      {!isMobile && <Footer />}

      <Chatbot />
    </div>
  );
}