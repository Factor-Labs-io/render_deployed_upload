"use client";
import Image from "next/image";
// import "./styles/globals.css";
import React, { useState } from "react";
import axios from "axios";

const Hero = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileData = e.target.result;
        setSelectedFile({ name: file.name, data: fileData });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected for upload.");
      return;
    }

    console.log("Begin upload");

    try {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(new Blob([selectedFile.data]));

      fileReader.onload = async () => {
        const base64Data = fileReader.result.split(",")[1]; // Get the Base64-encoded data part

        const data = {
          name: selectedFile.name,
          fileData: base64Data, // Send the Base64-encoded data
        };

        try {
          const response = await axios.post("/upload", data, {
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
          });

          if (response.status === 200) {
            console.log("File uploaded successfully");
            // You can handle success (e.g., display a success message) here.
          } else {
            console.error("File upload failed");
            // Handle errors (e.g., display an error message) here.
          }
        } catch (error) {
          console.error("Error during upload:", error);
          // Handle errors (e.g., display an error message) here.
        }
      };
    } catch (error) {
      console.error("Error reading file:", error);
      // Handle errors (e.g., display an error message) here.
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="border-2 border-red-500 h-[550px] text-center flex-col justify-between space-y-[425px]">
        <h1 className="text-white font-serif">
          <h1 className="text-white font-serif">
            Welcome to {`Ananda and Vishal's Wedding`}
          </h1>
        </h1>

        <div className="border-2 border-blue-500 flex-col justify-center items-center">
          <h1 className="text-white font-serif pb-2">
            Send us a photo for our Gallery!
          </h1>

          <input
            className="pl-40 pb-2"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />

          <button
            className="text-white bg-gradient-to-br from-green-700 to-green-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={handleUpload}
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
};

export default Hero;
