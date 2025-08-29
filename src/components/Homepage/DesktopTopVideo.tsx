"use client";
import React, { useState, useEffect, useRef } from "react";
import Loader from "../MicroComponents/Loader";
import { autoSwitchVideoQuality, retryHigherVideoQuality, QualityLevel } from "@/utils/networkQuality";

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

        // Start automatic quality switching
        const initializeVideo = async () => {
            try {
                const url = await autoSwitchVideoQuality(
                    hroVideoDesktop.website[0].qualities,
                    (quality, url) => {
                        setCurrentQuality(quality);
                        setVideoUrl(url);
                        console.log(`Auto-switched to ${quality}`);
                    }
                );
                setVideoUrl(url);
            } catch (error) {
                console.error("Error in auto quality switching:", error);
                // Fallback to 720p
                setVideoUrl(hroVideoDesktop.website[0].qualities["720p"]);
                setCurrentQuality("720p");
            }
        };

        initializeVideo();
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

    // Retry higher quality after some time
    useEffect(() => {
        if (!hroVideoDesktop?.website?.[0]?.qualities) return;

        const retryTimer = setTimeout(async () => {
            try {
                await retryHigherVideoQuality(
                    hroVideoDesktop.website[0].qualities,
                    (quality, url) => {
                        setCurrentQuality(quality);
                        setVideoUrl(url);
                        console.log(`Retry upgraded to ${quality}`);
                    }
                );
            } catch (error) {
                console.error("Error in quality retry:", error);
            }
        }, 5000); // Wait 5 seconds before retrying

        return () => clearTimeout(retryTimer);
    }, [hroVideoDesktop]);

    return (
        <div className="relative w-full h-[100vh] hidden sm:block">
            {isLoading && <Loader />}
            <video
                ref={videoRef}
                src={videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className={`w-full h-full object-cover ${isLoading ? "hidden" : ""}`}
            />
            {/* Quality indicator (optional, for debugging) */}
            <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {currentQuality}
            </div>
        </div>
    );
};

const DesktopTopVideo = ({ heroVideoDesk }: { heroVideoDesk: HeroVideoDesktop }) => {
    return <VideoPlayer hroVideoDesktop={heroVideoDesk} />;
};

export default DesktopTopVideo;

