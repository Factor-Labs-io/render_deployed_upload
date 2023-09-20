"use client";
import Image from "next/image";
import "./globals.css";
import React, { useState } from "react";
import axios from "axios";

const Hero = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const fileDataArray = [];

      for (const file of files) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const fileData = e.target.result;
          fileDataArray.push({ name: file.name, data: fileData });

          // If all files have been read, update the state with the array of file data
          if (fileDataArray.length === files.length) {
            setSelectedFiles(fileDataArray);
          }
        };

        reader.readAsDataURL(file); // Read the file as a Data URL
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error("No files selected for upload.");
      return;
    }

    console.log("Begin upload");

    const uploadPromises = selectedFiles.map(async (fileData) => {
      try {
        const base64Data = fileData.data.split(",")[1]; // Get the Base64-encoded data part

        if (!base64Data) {
          throw new Error(`Invalid file data for ${fileData.name}`);
        }

        const data = {
          name: fileData.name,
          fileData: base64Data, // Send the Base64-encoded data
        };

        const response = await axios.post("/upload", data, {
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
        });

        if (response.status === 200) {
          console.log(`File ${fileData.name} uploaded successfully`);
          // You can handle success (e.g., display a success message) here.
        } else {
          console.error(`File ${fileData.name} upload failed`);
          // Handle errors (e.g., display an error message) here.
        }
      } catch (error) {
        console.error(`Error during upload of ${fileData.name}:`, error);
        // Handle errors (e.g., display an error message) here.
      }
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);

    console.log("All files uploaded.");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-10">
      <div className="h-[550px] text-center flex-col justify-between space-y-[425px]">
        <h1 className="text-white font-serif">
          <h1 className="text-white font-serif">
            Welcome to {`Ananda and Vishal's Wedding`}
          </h1>
        </h1>

        <div className="flex-col justify-center items-center">
          <h1 className="text-white font-serif pb-2">
            Send us a photo for our Gallery!
          </h1>

          <input
            className="pl-40 pb-2"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
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
