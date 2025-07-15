'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, AlertCircle, Upload } from 'lucide-react';
import Image from 'next/image';
import { confirmPickup } from '@/features/order/services';
import { uploadMultipleImages } from '@/utils/imageUpload';
import dynamic from 'next/dynamic';

const Webcam = dynamic<any>(() => import('react-webcam').then(mod => mod.default), { ssr: false });

function PickupConfirmPage({ itemId }: { itemId: number }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const webcamRef = useRef<any>(null);
  const [showWebcam, setShowWebcam] = useState(false);

  const handleTakePhoto = () => {
    setShowWebcam(true);
  };

  const handleCapture = () => {
    if (webcamRef.current) {
      // @ts-ignore
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        fetch(imageSrc)
          .then(res => res.arrayBuffer())
          .then(buf => {
            const file = new File([buf], `webcam_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setSelectedFiles([file]);
            setShowWebcam(false);
          });
      }
    }
  };

  const handleConfirmPickup = async () => {
    if (selectedFiles.length === 0) {
      setError('Please take a photo');
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const uploadResults = await uploadMultipleImages(selectedFiles, `pickups/${itemId}`);
      const urls = uploadResults.filter(r => r.success && r.url).map(r => r.url!);
      if (urls.length === 0) {
        setError('Failed to upload images.');
        setIsProcessing(false);
        return;
      }
      await confirmPickup(itemId, urls);
      window.location.href = '/shipper?success=pickup-confirmed';
    } catch (err) {
      setError('Error confirming pickup.');
    }
    setIsProcessing(false);
  };

  const removePhoto = (index: number) => {
    setSelectedFiles([]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-white to-gray-100 z-10">
      <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-2xl p-10 flex flex-col items-center border border-gray-200 max-h-[95vh] overflow-y-auto">
        <h1 className="font-metal text-4xl font-bold text-center mb-4 text-black">Pickup Confirmation</h1>
        <p className="text-center text-gray-700 mb-6 text-xl">
          Please take a photo with your webcam as proof of pickup.
        </p>
        <div className="w-full flex flex-col gap-4 items-center mb-6">
          <Button
            variant="outline"
            className="w-full border-2 border-black flex items-center justify-center gap-2 text-2xl py-4 text-black hover:bg-black hover:text-white transition-colors duration-200"
            onClick={handleTakePhoto}
            disabled={selectedFiles.length >= 1}
          >
            <Camera className="w-7 h-7" />
            Take Photo
          </Button>
        </div>
        <div className="text-gray-400 text-base mb-4">You must take 1 photo as proof of pickup.</div>
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-1 gap-4 mt-4 w-full">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`Photo ${index + 1}`}
                  width={600}
                  height={450}
                  className="w-full h-96 object-contain rounded-xl border shadow"
                />
                <Button
                  onClick={() => removePhoto(index)}
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 w-9 h-9 p-0 opacity-80 group-hover:opacity-100 transition-colors duration-200 bg-white text-black hover:bg-red-100 hover:text-red-700 border border-red-200 text-xl"
                  title="Remove"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div className="text-red-600 text-center font-semibold mt-6 text-lg">{error}</div>
        )}
        <Button
          onClick={handleConfirmPickup}
          disabled={selectedFiles.length !== 1 || isProcessing}
          className="w-full bg-black text-white hover:bg-gray-900 border-2 border-black font-metal text-2xl py-4 mt-8 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
        >
          {isProcessing ? 'Confirming...' : 'Confirm Pickup'}
        </Button>
      </div>
      {/* Webcam Modal Overlay */}
      {showWebcam && selectedFiles.length < 1 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center border border-gray-200 max-w-[98vw] max-h-[95vh]">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={600}
              height={450}
              videoConstraints={{ facingMode: 'environment', width: 600, height: 450 }}
              className="rounded-2xl border shadow-lg max-w-full h-auto"
              style={{ objectFit: 'cover', maxWidth: '98vw', maxHeight: '80vh' }}
            />
            <div className="flex gap-8 justify-center w-full mt-6">
              <Button onClick={handleCapture} className="bg-black text-white px-12 text-2xl py-3 hover:bg-gray-900 transition-colors duration-200 shadow-md">Capture</Button>
              <Button onClick={() => setShowWebcam(false)} variant="outline" className="px-12 text-2xl py-3 border-2 border-red-400 text-black hover:bg-red-100 hover:text-red-700 transition-colors duration-200">Cancel</Button>
            </div>
          </div>
        </div>
      )}
      {/* Ẩn input file */}
      <input
        type="file"
        accept="image/*"
        multiple={false}
        capture="environment"
        onChange={() => {}}
        className="hidden"
        id="photo-upload"
        disabled
      />
    </div>
  );
}

export default PickupConfirmPage; 