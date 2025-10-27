# Starving_student_card_map

## Frontend

- cd into the frontend folder
- run `npm install`
- run `npm run dev`
- the local frontend website is going to be dispaly at: loalhost:5173

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
