import React, { useEffect } from 'react';
import { loadModules } from 'esri-loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const ColombianMap = ({ setMap }) => {
  // Se carga el mapa base suministrado al cargar la página
  useEffect(() => {
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/Basemap', 'esri/layers/VectorTileLayer'], { css: true }) // Se cargan los módulos de ArcGIS API for JavaScript
      .then(([Map, MapView, Basemap, VectorTileLayer]) => {

        const mapBaseLayer = new VectorTileLayer({ // Se crea un VectorTileLayer desde la url de un recurso
          url: "https://tiles.arcgis.com/tiles/RVvWzU3lgJISqdke/arcgis/rest/services/Mapa_base_topografico/VectorTileServer",
        });

        const customBasemap = new Basemap({ // Se crea el mapa base de acuerdo con el VectorTileLayer
          baseLayers: [mapBaseLayer],
          title: "Mapa base topográfico",
        });

        const map = new Map({ // Se crea el mapa de acuerdo con el customBasemap
          basemap: customBasemap
        });

        setMap(map); // Se 'guarda' el mapa para accederlo posteriormente

        new MapView({
          container: 'mapContainer', // Id del container
          map: map,
          center: [-74, 4], // Coordenadas con centro en Colombia
          zoom: 4, // Zoom inicial que permita la visualización de todo el territorio
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return <div id="mapContainer" style={{ height: '575px' }}></div>;
};

function App() {
  const [map, setMap] = React.useState(null);
  const [data, setData] = React.useState({});

  const onClientService = () => {
    if (!map || !data?.divipola) return;

    loadModules(['esri/layers/FeatureLayer',], { css: true })
      .then(([FeatureLayer]) => {

        const baseUrl = 'https://mapas.igac.gov.co/server/rest/services/carto/ProductosCartograficosVigentes/MapServer/0';
        const keyword = 'DIVIPOLA';
        const query = `?fpjson&where=${keyword}%20%3D%20%27${data?.divipola}%27`;

        const featureLayer = new FeatureLayer({
          url: `${baseUrl}${query}`,
        });

        map.add(featureLayer)
      })
      .catch((err) => {
        console.error(err);
      });
  }

  const onServerService = async () => {
    if (!data?.divipola) return;

    const url = 'http://localhost:3001/api';
    const body = { divipola: data?.divipola };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options)
    const json = await response.json();
    console.log(json);
  }

  return (
    <div className="App">
      <h1 className="mt-2 text-center">Geovisor de Colombia</h1>
      <div className='d-flex justify-content-center align-items-start gap-3 mb-3'>
        <Form.Group style={{ width: '300px' }}>
          <Form.Control type="text" placeholder="Divipola" onChange={(e) => setData({ ...data, divipola: e.target.value })} />
          <Form.Text className="text-muted">
            {data?.divipola?.length !== 5 && `Se deben introducir 5 caracteres`}
          </Form.Text>
        </Form.Group>
        <Button variant='outline-primary' style={{ width: '200px' }} onClick={onClientService}>Servicio web</Button>
        <Button variant='outline-primary' style={{ width: '200px' }} onClick={onServerService}>Backend</Button>
      </div>
      <ColombianMap map={map} setMap={setMap} />
    </div>
  );
}

export default App;
