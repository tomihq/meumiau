import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <>
      <div className="mb-8 mt-7">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-4xl">
              <Image
                src={"/tom2.webp"}
                alt={"tom"}
                layout="fill"
                className={"rounded-full"}
              />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-transparent rounded-full flex items-center justify-center animate-bounce">
            ✨
          </div>
        </div>
      </div>

      <h1 className="text-6xl font-bold mb-4 pb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent inline-block">
        {"Hi! I'm Tomás"}
      </h1>

      <p className="text-2xl text-purple-300 mb-6 font-mono">
        Computer Scientist
      </p>
    </>
  );
};

export default Hero;
