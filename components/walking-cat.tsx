"use client"
import React from 'react'

const WalkingCat = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-0 overflow-visible pointer-events-none">
      <div className="relative w-full h-0">
        <div className="absolute top-0 left-0 w-full h-0">
        </div>
      </div>
      <style jsx>{`
        @keyframes cat-walk {
          0% {
            transform: translateX(-50px) scaleX(1);
          }
          48% {
            transform: translateX(calc(100vw - 20px)) scaleX(1);
          }
          50% {
            transform: translateX(calc(100vw - 20px)) scaleX(-1);
          }
          98% {
            transform: translateX(-50px) scaleX(-1);
          }
          100% {
            transform: translateX(-50px) scaleX(1);
          }
        }
        
        .animate-cat-walk {
          animation: cat-walk 12s linear infinite;
          position: absolute;
          top: -2px;
          z-index: 60;
        }
      `}</style>
    </div>
  )
}

export default WalkingCat