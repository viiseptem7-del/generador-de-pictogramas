const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // CORS para permitir solicitudes desde tu página web
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'El prompt es requerido' });
  }

  // IMPORTANTE: Lee la clave de las variables de entorno de Vercel
  const API_KEY = process.env.API_KEY; 
  // Reemplaza con la URL de la API de IA real que estés usando
  const REAL_API_URL = 'URL_DE_LA_API_REAL'; 

  try {
    const response = await fetch(REAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "512x512"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de la API de IA: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;

    res.status(200).json({ imageUrl: imageUrl });
  } catch (error) {
    console.error('Error en la función:', error);
    res.status(500).json({ error: 'Error al generar la imagen', details: error.message });
  }
};
