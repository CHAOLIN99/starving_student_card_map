// index.js
const app = require("./service.js");
const port = process.env.PORT || 3000;

// Start the server only in development (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

// Export the app for Vercel serverless functions
module.exports = app;