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
  // La URL REAL de la API de OpenAI para generar imágenes
  const REAL_API_URL = 'https://api.openai.com/v1/images/generations'; 

  try {
    const response = await fetch(REAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "dall-e-2", // Puedes usar "dall-e-3" si tienes acceso
        prompt: prompt,
        n: 1,
        size: "512x512"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de OpenAI:', errorText); // Para depuración
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
