import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);

  const uploadnow = (e) => {
    e.preventDefault();
    if (files.length == 0) {
      alert("Please select at least one image");
    } else {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      axios
        .post("http://localhost:3000/upload", formData)
        .then((response) => {
          console.log(response);
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

  return (
    <form action="/upload" method="post" encType="multipart/form-data">
      <input
        type="file"
        name="files"
        id=""
        onChange={handleFileChange}
        multiple
        accept="image/*"
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
                  height:"20px",
                  width:"20px",
                  borderRadius:"50%"
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
      <button type="submit" onClick={uploadnow}>
        Upload now
      </button>
    </form>
  );
}

export default App;
