const express = require("express");
const uuid = require("uuid");

const dealRouter = express.Router();

orderRouter.endpoints = [
  {
    method: "GET",
    path: "/api/deal",
    description: "Get all deals",
    example: `curl localhost:3000/api/deal`,
    response: [
      {
        id: "58a24cf9-0be4-4287-8352-e1612021994d",
        description: "BOGO shakes",
        store: {
          name: "McDonald's",
          locations: [
            {
              address: "1225 S University Ave, Provo, UT 84601",
              lat: 40.233845,
              long: -111.658531,
            },
          ],
        },
      },
    ],
  },

  {
    method: "GET",
    path: "/api/deal/:dealId",
    description: "Get deal by id",
    example: `curl localhost:3000/api/deal/58a24cf9-0be4-4287-8352-e1612021994d`,
    response: {
      id: "58a24cf9-0be4-4287-8352-e1612021994d",
      description: "BOGO shakes",
      store: {
        name: "McDonald's",
        locations: [
          {
            address: "1225 S University Ave, Provo, UT 84601",
            lat: 40.233845,
            long: -111.658531,
          },
        ],
      },
    },
  },
  {
    method: "POST",
    path: "/api/deal",
    requiresAuth: true, //- TODO
    description: "Add new deal",
    example: `curl -X POST http://localhost:3000/api/deal -H "Content-Type: application/json"  -d '{"description":"BOGO shakes","storeName":"McDonalds","addresses":["1225 S University Ave, Provo, UT 84601"]}'`,
    response: {
      id: "33407f7e-9a10-43eb-b074-a79a3d5dbab4",
      dealDescription: "BOGO shakes",
      store: {
        name: "McDonalds",
        locations: [
          {
            address: "1225 S University Ave, Provo, UT 84601",
            lat: 40.233845,
            long: -111.658531,
          },
        ],
      },
    },
  },

  {
    method: "PUT",
    path: "/api/deal",
    requiresAuth: true, //- TODO,
    description: "Update existing Deal",
    example: `curl -X POST http://localhost:3000/api/deal/33407f7e-9a10-43eb-b074-a79a3d5dbab4 -H "Content-Type: application/json"  -d '{"description":"BOGO shakes - of equal or lesser value","storeName":"McDonalds","addresses":["1225 S University Ave, Provo, UT 84601","211 W 1230 N, Provo, UT 84604"]}'`,
    response: {
      id: "33407f7e-9a10-43eb-b074-a79a3d5dbab4",
      dealDescription: "BOGO shakes - of equal or lesser value",
      store: {
        name: "McDonalds",
        locations: [
          {
            address: "1225 S University Ave, Provo, UT 84601",
            lat: 40.233845,
            long: -111.658531,
          },
          {
            address: "211 West 1230 North, Provo, UT 84604",
            lat: 40.250228,
            long: -111.662518,
          },
        ],
      },
    },
  },
];

// get singular deal
dealRouter.get("/:dealID", (req, res) => {
  //TODO CHANGE TO IF DEALID NOT IN DB
  if (req.params.dealID == 1) {
    res.status(404).send({ message: "Could not find deal matching dealID" });
    return;
  }
  res.send({ message: `NOT IMPLEMENTED. Getting deal ${req.params.dealID}!` });
});

//all deals
dealRouter.get("/", (req, res) => {
  res.send({ message: "NOT IMPLEMENTED. Getting all deals" });
});

//add new deal
dealRouter.post("/", async (req, res) => {
  dealWithCoords = await dealHandler(null, req, res);

  res.send(dealWithCoords);
});

//update deal
dealRouter.put("/:dealID", async (req, res) => {
  //TODO CHANGE TO IF DEALID NOT IN DB
  if (req.params.dealID == 1) {
    res.status(404).send({ message: "Could not find deal matching dealID" });
    return;
  }

  dealWithCoords = await dealHandler(req.params.dealID, req, res);

  res.send(dealWithCoords);
});

async function dealHandler(dealID, req, res) {
  const dealDescription = req.body.description;
  const storeName = req.body.storeName;
  const addresses = req.body.addresses;

  if (!storeName || !dealDescription || !addresses) {
    res.status(400).send({
      message: "Missing Store name, deal description, or addresses",
    });
    return;
  }

  if (!Array.isArray(addresses)) {
    res.status(400).send({
      message: "Addresses must be an array ",
    });
    return;
  } else if (addresses.length < 1) {
    res.status(400).send({
      message:
        "Address array must contain 1 or more addresses (must be non empty)",
    });
    return;
  }

  const locations = [];

  for (let i = 0; i < addresses.length; i++) {
    const a = addresses[i];
    const location = await getLocationFromAddress(a);
    // console.log(location);
    if (!location) {
      res.status(500).send({
        message: `Failed to fetch address location (formatted address and coordinates) from 3rd party API.`,
      });
      return;
    } else if (location == -1) {
      res.status(500).send({
        message: `Could not find location (formatted address and coordinates) for one or more addresses`,
      });
      return;
    }

    locations.push(location);
  }

  return {
    id: dealID ?? uuid.v4(),
    dealDescription,
    store: {
      name: storeName,
      locations: locations,
    },
  };
}
async function getLocationFromAddress(address) {
  const uriEncodedAddress = encodeURIComponent(address);
  const requestOptions = {
    method: "GET",
  };

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${uriEncodedAddress}&apiKey=1158afccfcb24389ba80300fac4aeca0`,
      requestOptions
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      // console.log("properties for " + address);
      // console.log(data.features[0].properties);
      const { housenumber, street, city, state_code, postcode, lat, lon } =
        data.features[0].properties;

      if (housenumber == null || street == null) {
        return -1;
      }

      const formattedAddress = `${housenumber} ${street}, ${city}, ${state_code} ${postcode}`;

      return {
        address: formattedAddress,
        lat,
        long: lon,
      };
    } else {
      return -1;
    }
  } catch (error) {
    console.error("Error fetching geocode");
    return null;
  }
}

module.exports = dealRouter;
