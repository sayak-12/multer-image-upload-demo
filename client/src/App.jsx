import { useState } from 'react'
import axios from 'axios';
import './App.css'

function App() {
  const [file, setFile] = useState(null);
const uploadnow=(e)=>{
  e.preventDefault();
  const formData = new FormData();
  formData.append('file', file);
  console.log(formData.get('file'));
  axios.post("http://localhost:3000/upload", formData)
  .then((response)=>{
    console.log(response);
  })
  .catch((error)=>{console.log(error);})
}
  return (
    <>
      <h1>Uploading images in multer</h1>
      <form action="/upload" method="post" encType='multipart/form-data'>
        <input type="file" name="file" id="" onChange={(e)=>{setFile(e.target.files[0])}} /><br />
        <button type="submit" onClick={uploadnow}>Upload now</button>
      </form>
    </>
  )
}

export default App
