# Starving_student_card_map

## Frontend

- cd into the frontend folder
- run `npm install`
- run `npm run dev`
- the local frontend website is going to be display at: localhost:5173

[x] Server connected to backend localhost. Make sure to [run server](#running-server)) to see data in front end

## Backend

### SET UP (Before Running)

- cd into `server/database`

create `dbConfig.json` file with credentials from MongoDB atlas

```
// dbConfig.json
{
"hostname": "clusterName.xxxxxxx.mongodb.net",
"userName": "xxxxxxx",
"password": "xxxxxx"
}
```

### RUNNING SERVER

- cd into `server`
- run `node index.js`

To see endpoints for express server GET `http:localhost:3000/api/docs` via Curl or Browser

### Add sample data to DB

Once server is running (see above), from another terminal:

- cd into `server/sampleData`
- run `node postSampleDataToServer.js`

This loads the sample deal data by several HTTP `POST` request to the backend `/api/deal`

### Clearing deal data from db

**CAUTION** This will clear all docs from `deal` collection including any entered manually

- cd into `server/sampleData`
- run `node dropDealCollection.js`
