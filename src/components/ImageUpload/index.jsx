import { useEffect, useState } from "react";
import { UploadIcon, XIcon } from "@/assets/icons/commonIcons";
import { fileService } from "@/services/file.service";
import { Box, FormLabel, Text } from "@chakra-ui/react";
import { mediaService } from "@/services/media.service";
import { customToast } from "@/utils/toastify";
import noImageSrc from '@/assets/images/no_image.png';

const ImageUpload = ({ 
  image, 
  setImage,
  w='full',
  h='full',
  placeholder = 'Upload',
  maxFileSize = 15 * 1024 * 1024, // 15 MB
  rounded = 0,
  disabled = false,
}) => {
  console.log("image image:", image) // log
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [tryCount, setTryCount] = useState(0)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > maxFileSize) {
      setError("File size exceeds 15MB limit");
      return;
    }

    setIsLoading(true)
    fileService.upload(file)
      .then(res => {
        if(res?.data?.success){
          setImage({
            id: res?.data?.data?.id,
            url: ''
          });
        }
      })
      .catch(err => {
        customToast("error", "Couldn't upload")
      })
      .finally(() => {
        setIsLoading(false)
      })
  };

  const removeImage = () => {
    setImage({
      id: '',
      url: ''
    });
  };

  const getImage = () => {
    setIsLoading(true)
    mediaService.getById(image.id)
      .then(res => {
        const blob = res.data;
        const url = URL.createObjectURL(blob);
        setImage((prev) => ({
          id: prev.id,
          url: url
        }))
      })
      .catch(err => {
        console.log("image err:", err) // log
        setTryCount(oldV => oldV + 1)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if(!image?.id || image?.url) return;
    getImage()
  }, [image])

  useEffect(() => {
    if(!image?.id || image?.url || tryCount >= 3) return;
    getImage()
  }, [tryCount])

  return (
    <Box w={w} h={h}>
      {image?.url ? (
        <Box position='relative' w='full' h='full' overflow='hidden'>
          <img
            src={image?.url}
            alt="Preview"
            className={`w-full h-full object-cover`}
            style={{ borderRadius: rounded }}
          />
          {!disabled && (
            <Box
              onClick={removeImage}
              position='absolute'
              top='-10px'
              right='-10px'
              cursor='pointer'
            >
              <XIcon />
            </Box>
          )}
        </Box>
      ) : isLoading ? (
        <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      ) : (
        <FormLabel 
          h='full' 
          w='full' 
          display='flex' 
          justifyContent='center' 
          alignItems='center'
          flexDirection='column'
          cursor='pointer'
        >
          {disabled ? (
            <img
              src={noImageSrc}
              alt="Preview"
              className={`w-full h-full object-cover`}
              style={{ borderRadius: rounded }}
            />
          ) : (
            <>
              <UploadIcon />
              {placeholder && <Text fontSize='sm'>{placeholder}</Text>}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </>
          )}
        </FormLabel>
      )}
      {Boolean(error && !isLoading) && <p className="text-red-500 text-sm">{error}</p>}
    </Box>
  );
};

export default ImageUpload;
