const https = require("https");

const search = async (req, res) => {
  try {
    const query = req.query.q;
    console.log("➡ ~ search ~ query:", query);

    if (!query) {
      res.status(400).json({
        statusCode: 400,
        message: 'Query parameter "q" is required.',
      });
      return;
    }

    const options = {
      hostname: "deezerdevs-deezer.p.rapidapi.com",
      path: `/search?q=${encodeURIComponent(query)}`,
      method: "GET",
      headers: {
        "x-rapidapi-key": "90ae230589msh6610d641bb67c44p1c3dbdjsn91015c7a0867",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        res.status(200).json({
          statusCode: 200,
          message: "Data fetched successfully.",
          data: JSON.parse(data),
        });
      });
    });

    request.on("error", (error) => {
      console.error("➡ ~ search ~ error:", error);
      res.status(500).json({
        statusCode: 500,
        message: "An error occurred while fetching data.",
      });
    });

    request.end();
  } catch (error) {
    console.error("➡ ~ search ~ error:", error);
    res.status(500).json({
      statusCode: 500,
      message: "An error occurred while fetching data.",
    });
  }
};

module.exports = { search };
