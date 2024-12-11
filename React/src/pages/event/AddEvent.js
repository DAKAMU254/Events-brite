import React, { useState, useEffect } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { useEvents } from "../../context/EventContext";

const AddEvent = () => {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    image: null,
    imageUrl: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const { uploadImage, addEvent } = useEvents();

  const validateForm = () => {
    const newErrors = {};
    if (!formState.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formState.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formState.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formState.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formState.image && !formState.imageUrl) {
      newErrors.image = "Please upload an image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async(file) => {
    if (file) {
      if (file.type.startsWith("image/")) {
        const response = await uploadImage(file);
        setFormState((prev) => ({
          ...prev,
          image: file,
          imageUrl: response.imageUrl,
        }));
        setPreview(URL.createObjectURL(file));
        console.log(`Preview URL: ${preview}`);
        console.log( `Image uploaded successfully. URL: ${response.imageUrl}`);
      } else {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload an image file",
        }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Form submitted:", formState);
        addEvent(formState.title, formState.description, formState.imageUrl)
        setFormState({
          title: "",
          description: "",
          image: null,
          imageUrl: null,
        });
        setPreview(null);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 mx-auto'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
            Add New Event
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Fill in the details to create a new event
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ease-in-out ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            } ${errors.image ? "border-red-500" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type='file'
              id='image-upload'
              className='hidden'
              accept='image/*'
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
            <label
              htmlFor='image-upload'
              className='cursor-pointer block text-center'
            >
              {preview ? (
                <div className='relative mx-auto w-32 h-32'>
                  <img
                  
                    src={preview}
                    alt='Preview'
                    className='w-full h-full object-cover rounded-lg'
                  />
                  <div className='absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200'>
                    <Camera className='w-8 h-8 text-white' />
                  </div>
                </div>
              ) : (
                <div className='text-center'>
                  <Upload className='mx-auto h-12 w-12 text-gray-400' />
                  <p className='mt-1 text-sm text-gray-600'>
                    Drag and drop an image or click to upload
                  </p>
                </div>
              )}
            </label>
            {errors.image && (
              <p className='mt-2 text-sm text-red-600'>{errors.image}</p>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700'
            >
              Event Title
            </label>
            <div className='mt-1'>
              <input
                id='title'
                name='title'
                type='text'
                value={formState.title}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder='Enter event title'
              />
              {errors.title && (
                <p className='mt-2 text-sm text-red-600'>{errors.title}</p>
              )}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700'
            >
              Event Description
            </label>
            <div className='mt-1'>
              <textarea
                id='description'
                name='description'
                value={formState.description}
                onChange={handleChange}
                rows='4'
                className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder='Enter event description'
              />
              {errors.description && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' />
                  Processing...
                </>
              ) : (
                "Add Event"
              )}
            </button>
          </div>

          <div className='mt-4 text-center'>
            <p className='text-xs text-gray-500'>
              By clicking Add Event, you agree to the terms of use.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
