const express = require("express");
const cors = require('cors');
const fetch = require('node-fetch');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* Endpoint que recibe un divipola y retorna la informacion consultada a un directorio de datos de ArcGIS */

app.post("/api", async (req, res) => {
  const divipola = req.body?.divipola; // Se obtiene la divipola suministrada

  if (!divipola) { // Se verifica que la divipola esté llegando
    res.status(400).json({ error: "Divipola is required" });
    return;
  }

  const baseUrl = "https://services2.arcgis.com/RVvWzU3lgJISqdke/arcgis/rest/services/clasificacionsuelopot/FeatureServer/0";
  const keyword = "MpCodigo";
  const query = `?f=pjson&where=${keyword}%20%3D%20%27${divipola}%27`;

  const url = `${baseUrl}${query}`;

  try {
    const response = await fetch(url);

    if (response.ok) { // Se parse la respuesta siempre y cuando la petición sea exitosa

      const data = await response.text();
      const parsedData = JSON.parse(data);

      res.send(parsedData); // Se envia la respuesta

    } else {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }


})



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});