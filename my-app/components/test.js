const promise = new Promise(async (resolve) => {
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
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log(`File ${fileData.name} uploaded successfully`);
      } else {
        console.error(`File ${fileData.name} upload failed`);
      }
    } catch (error) {
      console.error(`Error during upload of ${fileData.name}:`, error);
    }
  });

  try {
    await Promise.all(uploadPromises);
    resolve();
  } catch (error) {
    console.error("Error during upload:", error);
  }
});

// Use toast.promise to show "promise pending" notification
const promiseId = toast.promise(promise, {
  pending: "Uploading images...",
  success: "Upload complete!",
  error: "Upload failed!",
  closeOnClick: false,
});

// Set up a callback to remove the "promise pending" notification when it's closed
toast.done(promiseId);
setUploading(false);
