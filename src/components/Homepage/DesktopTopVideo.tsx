"use client";
import React, { useState, useEffect, useRef } from "react";
import Loader from "../MicroComponents/Loader";
import { getOptimalVideoUrl, getCurrentQualityLevel, QualityLevel } from "@/utils/networkQuality";
import QualitySelector from "./QualitySelector";

interface HeroVideoDesktop {
  website: Array<{
    id: number;
    platform: string;
    original: string;
    qualities: {
      "480p": string;
      "720p": string;
      "1080p": string;
    };
  }>;
}

interface VideoPlayerProps {
  hroVideoDesktop: HeroVideoDesktop;
}

const VideoPlayer = ({ hroVideoDesktop }: VideoPlayerProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuality, setCurrentQuality] = useState<QualityLevel>("720p");
    const [videoUrl, setVideoUrl] = useState<string>("");
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!hroVideoDesktop?.website?.[0]?.qualities) return;

        // Get optimal video quality based on network
        const optimalUrl = getOptimalVideoUrl(hroVideoDesktop.website[0].qualities);
        const quality = getCurrentQualityLevel();
        
        setVideoUrl(optimalUrl);
        setCurrentQuality(quality);
        
        console.log(`Website Video - Quality: ${quality}, URL: ${optimalUrl}`);
    }, [hroVideoDesktop]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        const handleCanPlay = () => {
            setIsLoading(false);
            video.play().catch((error) => {
                console.error("Autoplay blocked:", error);
            });
        };

        const handleWaiting = () => setIsLoading(true);

        const handleError = () => {
            console.error("Video failed to load, trying fallback quality");
            // Try fallback to lower quality if current fails
            if (currentQuality === "1080p") {
                const fallbackUrl = hroVideoDesktop.website[0].qualities["720p"];
                setVideoUrl(fallbackUrl);
                setCurrentQuality("720p");
            } else if (currentQuality === "720p") {
                const fallbackUrl = hroVideoDesktop.website[0].qualities["480p"];
                setVideoUrl(fallbackUrl);
                setCurrentQuality("480p");
            }
        };

        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("waiting", handleWaiting);
        video.addEventListener("error", handleError);

        // Preload metadata only for faster initial load
        video.preload = "metadata";

        return () => {
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("waiting", handleWaiting);
            video.removeEventListener("error", handleError);
        };
    }, [videoUrl, currentQuality, hroVideoDesktop]);

    const handleQualityChange = (quality: QualityLevel) => {
        if (!hroVideoDesktop?.website?.[0]?.qualities) return;
        
        const newUrl = hroVideoDesktop.website[0].qualities[quality];
        setVideoUrl(newUrl);
        setCurrentQuality(quality);
        setIsLoading(true);
    };

    if (!videoUrl) {
        return (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <p>Video not available</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                    <Loader />
                    <div className="ml-3 text-white text-sm">
                        Loading {currentQuality} quality...
                    </div>
                </div>
            )}
            <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className={`w-full h-full object-cover ${isLoading ? "opacity-50" : ""}`}
            />
            {/* Quality indicator */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {currentQuality}
            </div>
            
            {/* Quality selector */}
            <QualitySelector
                currentQuality={currentQuality}
                onQualityChange={handleQualityChange}
            />
        </>
    );
};

interface DesktopTopVideoProps {
    heroVideoDesk: HeroVideoDesktop;
}

const DesktopTopVideo = ({ heroVideoDesk }: DesktopTopVideoProps) => {
    return (
        <div className="sm:block hidden sm:w-full sm:h-[80vh] bg-orange-200">
            <VideoPlayer hroVideoDesktop={heroVideoDesk} />
        </div>
    );
};

export default DesktopTopVideo;
