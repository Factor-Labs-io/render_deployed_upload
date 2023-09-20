"use client";
import Image from "next/image";
import "./globals.css";
import styles from "./globals.css";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Hero = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    setUploading(true);

    const promise = new Promise(async (resolve, reject) => {
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
            const fileInput = document.getElementById("file-input");
            if (fileInput) {
              fileInput.value = "";
            }
          } else {
            console.error(`File ${fileData.name} upload failed`);
            toast.error(`File upload failed`, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        } catch (error) {
          console.error(`Error during upload of ${fileData.name}:`, error);
          toast.error(`Error during upload: ${error.message}`, {
            position: "top-right",
            autoClose: 5000,
          });
          reject(error);
        }
      });

      try {
        await Promise.all(uploadPromises);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    // Use toast.promise to show "promise pending" notification
    const promiseId = toast.promise(promise, {
      pending: "Uploading images...", // This is the "promise pending" message
      success: "Upload complete!", // This is displayed when the promise resolves
      error: "Upload failed!", // This is displayed when the promise rejects
      closeOnClick: false, // Prevent the user from dismissing the notification
    });

    // Set up a callback to remove the "promise pending" notification when it's closed
    toast.done(promiseId);
    setUploading(false);
  };

  return (
    <main className={`${styles.container} bg-image`}>
      <div className="h-full text-center flex flex-col justify-between items-center pb-48">
        <h1 className="pt-3 text-white font-serif text-lg md:text-2xl">
          Welcome to {`Ananda and Vishal's Wedding`}
        </h1>

        <div className="flex flex-col justify-center items-center">
          <h1 className="text-white font-serif pb-2 text-lg md:text-2xl">
            Send us a photo for our gallery!
          </h1>

          <input
            id="file-input"
            className="pl-40 pb-2 md:text-xl"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />

          <button
            className="md:text-xl text-white bg-gradient-to-br from-green-700 to-green-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            onClick={handleUpload}
            disabled={uploading}
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
};

export default Hero;
