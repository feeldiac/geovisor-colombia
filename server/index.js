const express = require("express");
const cors = require('cors');
// const fetch = require('node-fetch');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.post("/api", async (req, res) => {
  const divipola = req.body?.divipola;

  if (!divipola) {
    res.status(400).json({ error: "Divipola is required" });
    return;
  }

  console.log(`Divipola: ${divipola}`);

  const baseUrl = "https://services2.arcgis.com/RVvWzU3lgJISqdke/arcgis/rest/services/clasificacionsuelopot/FeatureServer/0";
  const keyword = "MpCodigo";
  const query = `?fpjson&where=${keyword}%20%3D%20%27${divipola}%27`;

  const url = `${baseUrl}${query}`;

  const response = await fetch(url)
  const data = await response.json();

  if (response.ok) {
    res.status(200).json(data);
  } else {
    res.status(500).json({ error: "Failed to fetch data" });
  }

})



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});