"use client";
import React from "react";
import { QualityLevel, NetworkQualityDetector } from "@/utils/networkQuality";

interface QualitySelectorProps {
  currentQuality: QualityLevel;
  onQualityChange: (quality: QualityLevel) => void;
  isVisible?: boolean;
}

const QualitySelector = ({ currentQuality, onQualityChange, isVisible = true }: QualitySelectorProps) => {
  const qualities: QualityLevel[] = ["480p", "720p", "1080p"];

  const handleQualityChange = (quality: QualityLevel) => {
    NetworkQualityDetector.getInstance().forceQuality(quality);
    onQualityChange(quality);
  };

  if (!isVisible) return null;

  return (
    <div className="absolute top-4 right-4 bg-black/70 text-white rounded-lg p-2 z-20">
      <div className="text-xs mb-2 text-center">Quality</div>
      <div className="flex flex-col gap-1">
        {qualities.map((quality) => (
          <button
            key={quality}
            onClick={() => handleQualityChange(quality)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              currentQuality === quality
                ? "bg-white text-black font-semibold"
                : "hover:bg-white/20"
            }`}
          >
            {quality}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QualitySelector;
