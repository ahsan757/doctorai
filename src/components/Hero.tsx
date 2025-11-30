"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

const Hero = () => {
  const animationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && animationRef.current) {
      const circles = animationRef.current.querySelectorAll(".random-circle");

      const getRadius = () => (window.innerWidth >= 1024 ? 185 : 80);

      const radius = getRadius();
      const centerX = 200;
      const centerY = 200;
      const offsetX = -20;
      const offsetY = -20;
      let angle = 0;

      function updateCirclePositions() {
        circles.forEach((circle, index) => {
          const angleOffset = index * (360 / circles.length);
          const x = centerX + radius * Math.cos((angle + angleOffset) * (Math.PI / 180)) + offsetX;
          const y = centerY + radius * Math.sin((angle + angleOffset) * (Math.PI / 180)) + offsetY;

          (circle as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
        });
      }

      updateCirclePositions();
      const interval = setInterval(() => {
        angle += 1;
        updateCirclePositions();
      }, 20);

      return () => clearInterval(interval);
    }
  }, []);

  return (
    <section className="relative w-full min-h-screen flex lg:flex-row flex-col-reverse items-center justify-center bg-gradient-to-r from-cyan-100 to-green-100 overflow-hidden">
      {/* Left Text Content */}
      <div className="md:w-1/2 text-left px-8">
        <p className="text-blue-500 font-semibold">Welcome to Doctor AI</p>
        <h1 className="text-4xl md:text-5xl font-bold leading-snug">
          We Are Committed <br /> To Your Health
        </h1>
        <p className="text-gray-600 mt-4">
          <b>Stay safe, stay healthy – your AI-powered healthcare partner is just a click away!</b>
        </p>
        <Link href="/chat">
          <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-green-500 transition">
            Chat With Doctor AI
          </button>
        </Link>

        {/* Stats */}
        <div className="flex gap-6 mt-6">
          {[
            { label: "Recovered Patients", value: "355k+" },
            { label: "Good Review", value: "98%" },
            { label: "Popular Doctors", value: "120+" },
          ].map((stat, index) => (
            <div key={index} className="text-lg font-semibold">
              <span className="text-2xl">{stat.value}</span>
              <br />
              <small>{stat.label}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side Hero Animation */}
      <div ref={animationRef} className="relative mb-10 lg:mb-0 w-[350px] h-[350px] mt-24 lg:w-[540px] lg:h-[540px] flex items-center justify-center">
        {/* Outer Gray Circle */}
        <div className="absolute w-[365px] h-[365px] lg:w-[540px] lg:h-[540px] bg-[#bbe4ec] rounded-full flex items-center justify-center"></div>

        {/* Middle Green Circle */}
        <div className="absolute w-[250px] h-[250px] lg:w-[450px] lg:h-[450px] bg-[#4cf17e] rounded-full flex items-center justify-center">
          {/* White Inner Circle */}
          <div className="absolute w-[175px] h-[175px] lg:w-[375px] lg:h-[375px] border-4 border-white rounded-full"></div>
        </div>

        {/* Floating Circles (Now Positioned Correctly) */}
        <div className="random-circle absolute left-[-12px] top-[-12px] lg:left-[80px] lg:top-[80px] w-[15px] h-[15px] bg-white rounded-full"></div>
        <div className="random-circle absolute left-[-12px] top-[-12px] lg:left-[80px] lg:top-[80px] w-[15px] h-[15px] bg-white rounded-full"></div>
        <div className="random-circle absolute left-[-12px] top-[-12px] lg:left-[80px] lg:top-[80px] w-[15px] h-[15px] bg-white rounded-full"></div>
        <div className="random-circle absolute left-[-12px] top-[-12px] lg:left-[80px] lg:top-[80px] w-[15px] h-[15px] bg-white rounded-full"></div>
        <div className="random-circle absolute left-[-12px] top-[-12px] lg:left-[80px] lg:top-[80px] w-[15px] h-[15px] bg-white rounded-full"></div>

        {/* Icons (Surrounding the Circle) */}
        <div className="absolute top-[30%] left-[5%] transform -translate-x-1/2 -translate-y-1/2">
          <Image src="/icon_msg.png" alt="Message Icon" width={50} height={50} />
        </div>
        <div className="absolute top-[1%] left-[60%] transform -translate-x-1/2 -translate-y-1/2">
          <Image src="/icon_call.png" alt="Call Icon" width={50} height={50} />
        </div>
        <div className="absolute top-[50%] right-[-15%] lg:right-[-9%] transform -translate-x-1/2 -translate-y-1/2">
          <Image src="/icon_videocall.png" alt="Video Call Icon" width={50} height={50} />
        </div>

        {/* Doctor Image */}
        <div className="w-full h-full">
          <img src="/doctor_2.png" alt="Doctor" className="w-[48%] lg:w-full h-auto relative top-[30%] left-[25%] lg:left-[-2%] lg:top-[13%] z-10" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
