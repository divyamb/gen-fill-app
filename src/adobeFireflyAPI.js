const ADOBE_API_KEY = process.env.REACT_APP_ADOBE_API_KEY;
const ADOBE_API_ENDPOINT = 'https://image.adobe.io/sensei/generate';

export async function generateImageWithFirefly(imageFile, prompt) {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('prompt', prompt);

  try {
    const response = await fetch(ADOBE_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ADOBE_API_KEY}`,
        'x-api-key': ADOBE_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.output[0];
  } catch (error) {
    console.error('Error with Adobe Firefly API:', error);
    throw error;
  }
}