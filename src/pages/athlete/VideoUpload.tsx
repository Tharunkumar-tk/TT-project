import React, { useState } from 'react';
import { Upload, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import Button from '../../components/UI/Button';

interface VideoUploadProps {}

export const VideoUpload: React.FC<VideoUploadProps> = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus('uploading');
    
    // Simulate upload process
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadStatus('success');
    } catch (error) {
      setUploadStatus('error');
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Upload</h1>
        <p className="text-gray-600">Upload your training videos for analysis and feedback</p>
      </div>

      <Card className="p-8">
        {uploadStatus === 'idle' && (
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-blue-400 transition-colors">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Training Video</h3>
              <p className="text-gray-600 mb-6">Select a video file to upload for analysis</p>
              
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                Choose Video File
              </label>
            </div>

            {selectedFile && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Video className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{selectedFile.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                    <Button onClick={handleUpload} className="px-4 py-2">
                      Upload Video
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {uploadStatus === 'uploading' && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Uploading Video...</h3>
            <p className="text-gray-600">Please wait while we process your video</p>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Successful!</h3>
            <p className="text-gray-600 mb-6">Your video has been uploaded and is ready for analysis</p>
            <Button onClick={resetUpload} variant="outline">
              Upload Another Video
            </Button>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Failed</h3>
            <p className="text-gray-600 mb-6">There was an error uploading your video. Please try again.</p>
            <Button onClick={resetUpload} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VideoUpload;