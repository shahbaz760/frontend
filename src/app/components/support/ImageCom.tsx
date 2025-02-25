import imageCompression from "browser-image-compression";

/**
 * Compress an image file to approximately 50% of its original size.
 * @param {File} imageFile - The original image file.
 * @returns {Promise<File>} - A promise that resolves to the compressed image file.
 */
const compressImageToHalf = async (imageFile) => {
  const options = {
    maxSizeMB: imageFile.size / 1024 / 1024 / 2, // Reduce the size to 50%
    maxWidthOrHeight: 1024, // Adjust based on your needs for resolution
    useWebWorker: true, // Use web workers for faster compression
  };

  try {
    const compressedBlob = await imageCompression(imageFile, options);
    const compressedFile = new File([compressedBlob], imageFile.name, {
      type: imageFile.type,
    });
    return compressedFile;
  } catch (error) {
    console.error("Error compressing the image:", error);
    throw new Error("Failed to compress the image");
  }
};

export default compressImageToHalf;

// const handleImageUpload = async (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setOriginalImage(file);
//       try {
//         const compressed = await compressImageToHalf(file);
//         setCompressedImage(compressed);
//       } catch (error) {
//         console.error("Error during compression:", error);
//       }
//     }
//   };
