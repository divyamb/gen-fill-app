import React, { useState } from 'react';
import './App.css';

console.log('Cloud Name:', process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
console.log('Upload Preset:', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('smart_fill');

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleModeChange = (event) => {
    setMode(event.target.value);
  };

  const handleGenerativeProcess = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const uploadResult = await uploadResponse.json();
      console.log('Upload Result:', uploadResult);

      if (uploadResult.public_id) {
        let transformationUrl;
        if (mode === 'smart_fill') {
          transformationUrl = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_pad,w_1000,h_1000,b_gen_fill/f_auto,q_auto/${uploadResult.public_id}`;
        } else if (mode === 'smart_crop') {
          transformationUrl = `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/c_crop,w_1000,h_1000,g_auto/f_auto,q_auto/${uploadResult.public_id}`;
        }
        setGeneratedImage(transformationUrl);
      } else {
        throw new Error('Failed to get public_id from Cloudinary');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Smart Image Processing App</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <div>
        <label>
          <input
            type="radio"
            value="smart_fill"
            checked={mode === 'smart_fill'}
            onChange={handleModeChange}
          />
          Smart Fill
        </label>
        <label>
          <input
            type="radio"
            value="smart_crop"
            checked={mode === 'smart_crop'}
            onChange={handleModeChange}
          />
          Smart Crop
        </label>
      </div>
      <button onClick={handleGenerativeProcess} disabled={isLoading || !selectedFile}>
        {isLoading ? 'Processing...' : 'Process Image'}
      </button>
      {generatedImage && (
        <div>
          <h2>Processed Image:</h2>
          <img src={generatedImage} alt="Processed" />
          <br />
          <a href={generatedImage} download="processed_image.jpg">
            <button>Download Image</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
