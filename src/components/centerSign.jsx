import React, { useEffect } from "react";
import hazard from "../assets/hazard.png";
import go from "../assets/go.png";

/** This small component is incharge of the warning/go sign */
export default function CenterSign({ isMoving, started, className }) {
  return (
    <>
      {isMoving && started ? (
        <img draggable={false} src={go} className={className} />
      ) : started ? (
        <img draggable={false} src={hazard} className={className} />
      ) : (
        <></>
      )}
    </>
  );
}
