"use client";
import React, { useState, useEffect, useRef } from "react";
import Loader from "../MicroComponents/Loader";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";
import Image from "next/image";

const VideoPlayer2 = () => {
    const [isLoading, setIsLoading] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleCanPlay = () => {
            setIsLoading(false);
            video.play().catch((error) => {
                console.error("Autoplay blocked:", error);
            });
        };

        const handleWaiting = () => setIsLoading(true);

        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("waiting", handleWaiting);

        const triggerPlayOnTouch = () => {
            video.play().catch((error) => {
                console.error("iOS touch autoplay failed:", error);
            });
        };

        window.addEventListener("touchstart", triggerPlayOnTouch, { once: true });

        return () => {
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("waiting", handleWaiting);
            window.removeEventListener("touchstart", triggerPlayOnTouch);
        };
    }, []);

    return (
        <>
            {/* {isLoading && <Loader />} */}
            <video
                ref={videoRef}
                src="/video 2.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                // className={`w-full h-full object-cover ${isLoading ? "hidden" : ""}`}
                className="w-full h-full object-cover"
            />
        </>
    );
};

const TopVideo2 = () => {
    return (
        <div className="relative ">

            <img
                src="/Demonoid text roation.gif"
                alt="Loading..."
                className="rounded-xl absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 pt-6 w-40"
            />
            <VideoPlayer2 />
        </div>



    );
};

export default TopVideo2;
