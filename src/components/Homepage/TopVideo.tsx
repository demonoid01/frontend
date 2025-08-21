"use client";
import React, { useState, useEffect, useRef } from "react";
import Loader from "../MicroComponents/Loader";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";

const VideoPlayer = () => {
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
        // src="https://res.cloudinary.com/diyxdjcma/video/upload/v1747546463/WhatsApp_Video_2024-10-12_at_14.37.12_rfddtx.mp4"
        src="/demonoid video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // className={`w-full h-full object-cover ${isLoading ? "hidden" : ""}`}
        className="w-full h-full object-cover "
      />
    </>
  );
};

const TopVideo = () => {

  // const handleScroll = () => {
  //   scrollTo.current?.scrollIntoView({ behavior: 'smooth' });
  // };

  return (
    <div className="sm:hidden bg-red-500 h-dvh overflow-hidden w-svw md:w-[700px] md:left-1/2 md:translate-x-[-50%] fixed top-10 -z-20">

      <div className="fixed bottom-1/4 right-1/4 z-50 p-4">
        <button className="flex flex-col items-center px-4 py-2 text-white" >
          <MdOutlineArrowDropDownCircle size={50} />
          <span className="uppercase text-2xl">Shope Now</span>
        </button>
      </div>

      <VideoPlayer />
    </div>
  );
};

export default TopVideo;
