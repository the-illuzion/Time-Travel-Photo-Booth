import React, { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (base64Image: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-2xl cursor-pointer bg-gray-800/50 hover:bg-gray-800 transition-colors group">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-purple-400 transition-colors" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold group-hover:text-white transition-colors">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
        </div>
        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};
