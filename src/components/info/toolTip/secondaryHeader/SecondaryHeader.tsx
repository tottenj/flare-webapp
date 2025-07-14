import React from "react";

export default function SecondaryHeader({header, text}: {header: string | React.ReactNode, text?: string | null}) {
  return (
    <div className="mb-2 flex items-center gap-2 text-sm text-gray-700">
      <span className="font-bold">{header}</span>
      <span>{text}</span>
    </div>
  );
}