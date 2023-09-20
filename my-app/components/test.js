const handleUpload = async () => {
  if (!selectedFiles || selectedFiles.length === 0) {
    console.error("No files selected for upload.");
    return;
  }

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
          toast.success(`File ${fileData.name} uploaded successfully`, {
            position: "top-right",
            autoClose: 5000,
          });
        } else {
          console.error(`File ${fileData.name} upload failed`);
          toast.error(`File ${fileData.name} upload failed`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.error(`Error during upload of ${fileData.name}:`, error);
        toast.error(
          `Error during upload of ${fileData.name}: ${error.message}`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
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
};
