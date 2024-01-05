import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [data, setData] = useState({
    name: "",
    contact: "",
    imageURl: [],
  });
  const [uploading, setUploading] = useState(false);
  useEffect(()=>{
    if (!uploading && data.imageURl.length>0) {
      console.log(data);
    }
  }, [uploading, data])
  const uploadnow = async (e) => {
    e.preventDefault();
    setUploading(true);
    console.log(data);
    if (files.length == 0) {
      alert("Please select at least one image");
    } else {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      axios
        .post("http://localhost:3000/upload", formData)
        .then(async (response) => {
          console.log(response);
          const newImageURLs = response.data.uploadResults.map((dt) => dt.url);
          console.log(newImageURLs);
          // Update the state using the previous state
          setData((prevData) => {
            const newData = { ...prevData, imageURl: newImageURLs };
            return newData;
          });
          
          console.log(data);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    const imageFiles = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      // Check if the file is an image (you can add more image formats as needed)
      if (file.type.startsWith("image/")) {
        imageFiles.push(file);
      }
    }

    setFiles(imageFiles);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  return (
    <form action="/upload" method="post" encType="multipart/form-data">
      <label htmlFor="name">
        Enter your name: <br />
        <input type="text" name="name" onChange={handleChange} />
      </label>
      <label htmlFor="mobile">
        Enter your Contact Number: <br />
        <input type="tel" name="contact" onChange={handleChange} />
      </label>
      <input
        type="file"
        name="files"
        id=""
        onChange={handleFileChange}
        multiple
        accept="image/*"
        required
      />
      <br />
      {files.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {files.map((file, index) => (
            <div key={index} style={{ position: "relative" }}>
              <div
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "white",
                  height: "20px",
                  width: "20px",
                  borderRadius: "50%",
                }}
                className="delete-button"
                onClick={() => handleRemoveImage(index)}
              >
                &#x2715;
              </div>
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                width={200}
              />
            </div>
          ))}
        </div>
      ) : (
        <span>No image uploaded</span>
      )}
      <br />
      <button
        type="submit"
        onClick={uploadnow}
        className={`${uploading ? "inactive" : ""}`}
      >
        <span>{uploading ? "loading..." : "Upload now"}</span>
      </button>
    </form>
  );
}

export default App;
