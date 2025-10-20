import { Button } from "@heroui/react";
import { Aperture, RefreshCcw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onCapture?: (file: File) => void;
  width?: number;
  height?: number;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment"
  );

  const startCamera = async (mode: "user" | "environment") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => stopCamera();
  }, [facingMode]);

  const dataUrlToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }
    return new File([u8arr], filename, {
      type: mime,
      lastModified: Date.now(),
    });
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        const file = dataUrlToFile(dataUrl, `photo_${Date.now()}.jpg`);
        if (onCapture) onCapture(file);
      }
    }
  };

  const handleSwapCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full bg-[#000] rounded-md z-10"
        />
        <div className="absolute flex items-center w-full z-40 bottom-3">
          <div className="basis-7/12 flex justify-end mr-4 md:mr-10">
            <Button
              radius="full"
              onPress={handleCapture}
              variant="bordered"
              className="border-2 border-white"
              isIconOnly
              startContent={<Aperture className="text-white" size={23} />}
            />
          </div>
          <div className="basis-5/12 flex justify-end">
            <Button
              radius="full"
              onPress={handleSwapCamera}
              variant="bordered"
              className="!border-none !outline-none !ring-none"
              isIconOnly
              startContent={<RefreshCcw className="text-white" size={23} />}
            />
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default CameraCapture;
