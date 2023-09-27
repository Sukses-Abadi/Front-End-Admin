import React from "react";

const ImagePreview = ({ imageFiles, handleRemoveImage }) => {
  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="mt-4">
      {imageFiles?.map((image, index) => (
        <div
          key={index}
          className="flex items-center bg-gray-100 p-2 rounded-lg mb-2"
        >
          <img
            src={image.previewURL}
            alt={image.name}
            className="w-16 h-auto rounded-lg mr-2"
          />
          <div>
            <p className="text-sm font-medium">{image.name}</p>
            <p className="text-xs text-gray-500">{formatSize(image.size)}</p>
          </div>
          <button
            type="button"
            className="ml-auto text-red-500 hover:text-red-600"
            onClick={() => handleRemoveImage(index)}
          >
            <svg
              className="mr-2 w-5 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
