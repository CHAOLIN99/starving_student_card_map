import React, { useState } from "react";
import MapView from "../components/MapView";
import RestaurantList from "../components/RestaurantList";
import Header from "../components/Header";
import Footer from "../components/Footer";

// fake restaurant data. Replace it with real back end.
const sample = [
  {
    id: 1,
    name: "Tasty Noodles",
    deal: "50% off lunch specials",
    latlng: [40.7608, -111.891],
  },
  {
    id: 2,
    name: "Burger Barn",
    deal: "Buy 1 get 1",
    latlng: [37.2692, -113.0263],
  },
  {
    id: 3,
    name: "Green Salads",
    deal: "Free drink with any salad",
    latlng: [40.2338, -111.6585],
  },
  { id: 4, name: "Desert Diner", deal: "15% off", latlng: [38.9686, -112.094] },
  {
    id: 5,
    name: "Canyon Coffee",
    deal: "Buy 1 get 1 coffee",
    latlng: [37.2982, -113.026],
  },
  {
    id: 6,
    name: "Plate & Spoon",
    deal: "Free appetizer with entree",
    latlng: [40.7601, -111.8908],
  },
  {
    id: 7,
    name: "Ute Eats",
    deal: "Student discount 10%",
    latlng: [40.2336, -111.6579],
  },
  {
    id: 8,
    name: "Pioneer Pies",
    deal: "Slice $2",
    latlng: [40.7607, -111.8912],
  },
  {
    id: 9,
    name: "Red Rock BBQ",
    deal: "$5 off orders over $25",
    latlng: [37.1041, -113.5843],
  },
  {
    id: 10,
    name: "Beehive Bistro",
    deal: "Free side with burger",
    latlng: [40.487, -111.7895],
  },
  {
    id: 11,
    name: "Wasatch Wraps",
    deal: "2 for $10",
    latlng: [40.7764, -111.8881],
  },
  {
    id: 12,
    name: "Salt & Sage",
    deal: "Happy hour 3-6pm",
    latlng: [40.7587, -111.901],
  },
  {
    id: 13,
    name: "Mountain Munchies",
    deal: "Free delivery over $20",
    latlng: [40.774, -111.857],
  },
  {
    id: 14,
    name: "Valley Veg",
    deal: "10% off vegan menu",
    latlng: [40.2854, -111.6458],
  },
  {
    id: 15,
    name: "Temple Tacos",
    deal: "Taco Tuesday 50% off",
    latlng: [40.7605, -111.8911],
  },
  {
    id: 16,
    name: "Olive Orchard",
    deal: "Free dessert with dinner",
    latlng: [40.25, -111.65],
  },
  {
    id: 17,
    name: "Granite Grill",
    deal: "Kids eat free Sun",
    latlng: [40.667, -111.882],
  },
  {
    id: 18,
    name: "Trailside Treats",
    deal: "10% off coffee",
    latlng: [40.624, -111.92],
  },
  {
    id: 19,
    name: "Lone Peak Pizza",
    deal: "Large pizza $12",
    latlng: [40.5765, -111.887],
  },
  {
    id: 20,
    name: "Capitol Crepes",
    deal: "Crepe + coffee $6",
    latlng: [41.223, -111.9738],
  },
  {
    id: 21,
    name: "Great Salt Grill",
    deal: "Combo meals $8",
    latlng: [40.7609, -111.8915],
  },
  {
    id: 22,
    name: "Summit Sushi",
    deal: "Half-price rolls Mon",
    latlng: [40.766, -111.858],
  },
  {
    id: 23,
    name: "Deseret Deli",
    deal: "Sandwich + drink $7",
    latlng: [40.77, -111.9],
  },
  {
    id: 24,
    name: "Cedar Cafe",
    deal: "Free cookie with coffee",
    latlng: [38.7681, -112.0828],
  },
  {
    id: 25,
    name: "Parkway Pasta",
    deal: "Pasta night 2 for 1",
    latlng: [40.745, -111.842],
  },
  {
    id: 26,
    name: "Alpine Alehouse",
    deal: "$3 draft beers",
    latlng: [40.588, -111.938],
  },
  {
    id: 27,
    name: "Riverton Ramen",
    deal: "Lunch special $9",
    latlng: [40.5218, -111.9391],
  },
  {
    id: 28,
    name: "Oasis Omelette",
    deal: "Brunch free mimosa",
    latlng: [40.512, -111.908],
  },
  {
    id: 29,
    name: "Sunset Sandwiches",
    deal: "Two sandwiches $10",
    latlng: [40.7473, -111.8882],
  },
  {
    id: 30,
    name: "Wasatch Waffles",
    deal: "Waffle combo $5",
    latlng: [40.702, -111.891],
  },
  {
    id: 31,
    name: "Pinecone Pub",
    deal: "Open mic night discounts",
    latlng: [40.633, -111.86],
  },
  {
    id: 32,
    name: "Canyon Curry",
    deal: "10% off takeout",
    latlng: [37.184, -113.015],
  },
  {
    id: 33,
    name: "Red Butte Bakery",
    deal: "Fresh loaf $3",
    latlng: [40.769, -111.844],
  },
  {
    id: 34,
    name: "Plateau Pizzeria",
    deal: "Weeknight special $9",
    latlng: [38.967, -112.098],
  },
  {
    id: 35,
    name: "Homestead Hamburgers",
    deal: "Fries free with burger",
    latlng: [40.285, -111.705],
  },
  {
    id: 36,
    name: "Juniper Juice Bar",
    deal: "Smoothie $4",
    latlng: [40.776, -111.867],
  },
  {
    id: 37,
    name: "Sagebrush Steakhouse",
    deal: "Steak night 20% off",
    latlng: [40.49, -111.705],
  },
  {
    id: 38,
    name: "Happy Hummus",
    deal: "Free pita with hummus",
    latlng: [40.759, -111.88],
  },
  {
    id: 39,
    name: "Riverfront Rotisserie",
    deal: "Chicken for two $15",
    latlng: [40.664, -111.87],
  },
  {
    id: 40,
    name: "Civic Street Cafe",
    deal: "Student coffee $1",
    latlng: [40.758, -111.887],
  },
  {
    id: 41,
    name: "Red Cliffs Cantina",
    deal: "Margarita $5",
    latlng: [37.1688, -113.0066],
  },
  {
    id: 42,
    name: "Desert Bloom",
    deal: "Two salads $9",
    latlng: [40.227, -111.664],
  },
  {
    id: 43,
    name: "Sunnyside Subs",
    deal: "3 subs $12",
    latlng: [40.739, -111.85],
  },
  {
    id: 44,
    name: "Bear River Bistro",
    deal: "Weekend brunch special",
    latlng: [41.6516, -111.904],
  },
  {
    id: 45,
    name: "Trailhead Tacos",
    deal: "Free salsa with order",
    latlng: [40.587, -111.9],
  },
  {
    id: 46,
    name: "Plate & Paddle",
    deal: "$4 boat special",
    latlng: [40.7765, -111.89],
  },
  {
    id: 47,
    name: "Salt Flats Snacks",
    deal: "Energy bowl $6",
    latlng: [40.72, -113.881],
  },
  {
    id: 48,
    name: "Quarry Quesadillas",
    deal: "Quesadilla $5",
    latlng: [40.65, -111.84],
  },
  {
    id: 49,
    name: "Meadow Muffins",
    deal: "Muffin + coffee $3",
    latlng: [40.737, -111.845],
  },
  {
    id: 50,
    name: "Rock Canyon Cafe",
    deal: "Lunch combo $8",
    latlng: [40.7745, -111.855],
  },
  {
    id: 51,
    name: "Summit Sweets",
    deal: "Dessert half off Wed",
    latlng: [40.772, -111.8585],
  },
  {
    id: 52,
    name: "Valley Vine",
    deal: "Wine flight $10",
    latlng: [40.252, -111.67],
  },
  {
    id: 53,
    name: "Hearth & Home",
    deal: "Family meal deal",
    latlng: [40.268, -111.678],
  },
];

export default function MainView() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#f7f7f8",
      }}
    >
      <Header onSearch={setQuery} />
      <main style={{ display: "flex", padding: 20, gap: 12, flex: 1 }}>
        <div style={{ flex: 1 }}>
          <MapView
            markers={sample.filter(
              (r) =>
                r.name.toLowerCase().includes(query.toLowerCase()) ||
                r.deal.toLowerCase().includes(query.toLowerCase())
            )}
            onMarkerClick={setSelected}
            height={"80vh"}
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
        </div>
        <RestaurantList
          items={sample.filter(
            (r) =>
              r.name.toLowerCase().includes(query.toLowerCase()) ||
              r.deal.toLowerCase().includes(query.toLowerCase())
          )}
          onSelect={setSelected}
        />
      </main>
      <Footer />
    </div>
  );
}
