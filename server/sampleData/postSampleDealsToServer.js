const deals = require("./sampleDealsList");

const verbose = process.argv[2];

async function addSamples() {
  const responseStatuses = {};

  const promises = deals.map((deal, idx, arr) => {
    return fetch("http://localhost:3000/api/deal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deal),
    })
      .then((response) => {
        const key = String(response.status);
        responseStatuses[key] = (responseStatuses[key] || 0) + 1;
        if (verbose) {
          console.log(`\nResponse status (${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        if (verbose) {
          console.log(
            "Response body from Express endpoint:\n",
            JSON.stringify(data)
          );
        }
      })
      .catch((error) => {
        responseStatuses["network_error"] =
          (responseStatuses["network_error"] || 0) + 1;
        console.error("Error submitting data:", error);
      });
  });

  await Promise.all(promises).then(() => {
    console.log("\n**Post Results Statuses Summary**:", responseStatuses);
    // console.log(
    //   "\n**RUNNING AGAIN MAY ADD DUPLICATES TO DB\n--Clear Collection (!CAUTION -- will delete any other added entries!) if needed"
    // );
  });
}

console.log("Posting deals to server");
addSamples();
