import { useState } from "react";
import { UploadIcon, XIcon } from "@/assets/icons/commonIcons";
import { fileService } from "@/services/file.service";
import { Box } from "@chakra-ui/react";

const ImageUpload = ({ onUpload, preview, onRemove, inline=false }) => {
  const [image, setImage] = useState(preview || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  const allowedFormats = [
    "image/jpeg",
    "image/png",
    "image/jpg"
  ];

  const maxFileSize = 15 * 1024 * 1024; // 50MB

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > maxFileSize) {
      setError("File size exceeds 2MB limit");
      return;
    }

    setIsLoading(true)
    fileService.upload(file)
      .then(res => {
        console.log("upload res:", res) // log
        if(res?.data?.success){
          const imageUrl = URL.createObjectURL(file);
          setImage(imageUrl);
          onUpload(res?.cloudURL, imageUrl)
        }
      })
      .catch(err => {
        console.log("upload err:", err) // log
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  const removeImage = () => {
    setImage(null);
    onRemove()
  };

  return (
    <div className={`flex ${
        inline ? "p-2" : "min-h-[54px] p-4"
      } flex-col items-center justify-center shadow-sm gap-4 rounded-[50%] w-full h-full`}>
      {image ? (
        <div className="relative w-full h-full rounded-[50%]">
          <img
            src={image}
            alt="Preview"
            className="w-full h-full object-cover rounded-[50%]"
          />
          <Box
            onClick={removeImage}
            // className="absolute top-3 right-3 text-white p-1 rounded-full shadow-md hover:shadow-sm"
            position='absolute'
            top='-10px'
            right='-10px'
            cursor='pointer'
          >
            <XIcon />
          </Box>
        </div>
      ) : isLoading ? (
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      ) : (
        <label className={`flex flex-col items-center cursor-pointer`}>
          <UploadIcon />
          <span className="text-sm text-center text-gray-600">upload image</span>
          <span className="text-xs text-center text-gray-600">Maximum size: 10MB</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      )}
      {Boolean(error && !isLoading) && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ImageUpload;
