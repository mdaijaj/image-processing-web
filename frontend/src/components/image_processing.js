import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState(null);
  const [format, setFormat] = useState('jpeg');
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setImage(response.data.filePath);
        setPreview(null); // Clear previous preview
      } catch (error) {
        console.error('Error uploading image', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please upload an image first.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/process', {
        filePath: image,
        brightness,
        contrast,
        saturation,
        rotation,
        crop,
        format
      }, {
        responseType: 'arraybuffer'
      });

      // Create a URL for the processed image
      const url = URL.createObjectURL(new Blob([response.data]));
      setPreview(url);
    } catch (error) {
      console.error('Error processing image', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrightnessChange = (e) => setBrightness(e.target.value);
  const handleContrastChange = (e) => setContrast(e.target.value);
  const handleSaturationChange = (e) => setSaturation(e.target.value);
  const handleRotationChange = (e) => setRotation(e.target.value);
  const handleCropChange = (e) => setCrop(e.target.value);
  const handleFormatChange = (e) => setFormat(e.target.value);

  const handleDownload = () => {
    if (preview) {
      const link = document.createElement('a');
      link.href = preview;
      link.download = `processed.${format}`;
      link.click();
    } else {
      alert('No image to download.');
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Image Processor</h1>
      <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
      <div>
        <label> Brightness:</label>
        <input type="range" min="0" max="2" step="0.1" value={brightness} onChange={handleBrightnessChange} />  

        <label style={{margin: "20px"}}> Contrast:</label>
        <input  type="range" min="0" max="2" step="0.1" value={contrast} onChange={handleContrastChange} /><br/><br/>
        <label> Saturation:</label>
        <input type="range" min="0" max="2" step="0.1" value={saturation} onChange={handleSaturationChange} />
        <label style={{margin: "20px"}}> Rotation:</label>
        <input type="range" min="0" max="360" step="1" value={rotation} onChange={handleRotationChange} /> <br/>
        <label>Crop (left,top,width,height):</label>
        <input type="text" placeholder="e.g. 10,10,100,100" onChange={handleCropChange} />
        <label>Format:</label>
        <select value={format} onChange={handleFormatChange}>
          <option value="jpeg">JPEG</option>
          <option value="png">PNG</option>
        </select>
      </div>
      <button onClick={handleSubmit} disabled={loading}>Process Image</button>
      {loading && <p>Processing...</p>}
      {preview && <img src={preview} alt="Preview" />}
      {preview && <button onClick={handleDownload}>Download</button>}
    </div>
  );
}

export default App;
