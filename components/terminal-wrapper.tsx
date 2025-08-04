"use client"
import dynamic from "next/dynamic";

const Terminal = dynamic(
  () => import("./terminal")
);

const TerminalWrapper = () => {
  return (
    <Terminal currentSection="home" onNavigate={() => {}} />
  )
}

export default TerminalWrapper