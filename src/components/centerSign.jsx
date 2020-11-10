import React, { useEffect } from "react";
import hazard from "../assets/hazard.png";
import go from "../assets/go.png";

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
