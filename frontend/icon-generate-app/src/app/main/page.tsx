"use client";
import { useState } from "react";

export default function Home() {
  const [iconColor, setIconColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#cccccc");
  const [cornerRadius, setCornerRadius] = useState(40); // Default: 50 (0-100)
  const [iconScale, setIconScale] = useState(0.6); // Default: 0.5 (0.1-1)
  const [borderWidth, setBorderWidth] = useState(2); // Default: 2 (0-10)

  return (
    <div className="grid grid-cols-2 min-h-screen font-[family-name:var(--font-geist-sans)] gap-6 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center p-4 pl-10">
        <div
          className="flex w-2/3 items-center justify-center border-2 rounded-lg glass-effect"
          style={{ aspectRatio: "1 / 1" }}
        >
          {/* Placeholder for SVG rendering */}
          <p className="text-gray-400 text-sm">Your generated SVG will appear here.</p>
        </div>
      </div>
      {/* Right Section */}
      <div className="flex flex-col justify-center gap-6 pr-40 ml-[-20] ">
        {/* Title */}
        <div className="flex items-center justify-start gap-2">
          <h1 className="text-3xl font-semibold text-white">Collect generate rules:</h1>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Icon Name */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Icon Name:</span>
            <input
              type="text"
              placeholder="e.g., camera"
              className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-none focus:ring-1 focus:ring-gray-200 text-sm bg-gray-800 text-gray-100 placeholder-gray-500"
            />
          </label>

          {/* Shape */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Base Shape:</span>
            <select
              className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-none focus:ring-1 focus:ring-gray-200 text-sm bg-gray-800 text-gray-100"
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="rounded-square">Rounded Square</option>
            </select>
          </label>

          {/* Icon Color */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Icon Color:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
                className="w-8 h-6 rounded-lg cursor-pointer bg-gray-800 p-0"
              />
              <span className="text-sm text-gray-400">{iconColor}</span>
            </div>
          </label>

          {/* Corner Radius */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Corner Radius:</span>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={cornerRadius}
                onChange={(e) => setCornerRadius(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #105BFF ${cornerRadius}%, #4B5563 ${cornerRadius}%)`,
                }}
              />
              <span className="text-sm text-gray-400 w-10 flex justify-end">{cornerRadius}px</span>
            </div>
          </label>

          {/* Background Color */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Background Color:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-8 h-6 rounded-lg cursor-pointer bg-gray-800 p-0"
              />
              <span className="text-sm text-gray-400">{backgroundColor}</span>
            </div>
          </label>

          {/* Icon Scale */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Icon Scale:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100" // 将范围映射到整数
                step="10" // 对应小数的步长
                value={iconScale * 100} // 将小数值映射到整数
                onChange={(e) => setIconScale(Number(e.target.value) / 100)} // 转换回小数值
                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #105BFF ${iconScale * 100}%, #4B5563 ${
                    iconScale * 100
                  }%)`,
                }}
              />
              <span className="text-sm text-gray-400 w-10 flex justify-end">{iconScale.toFixed(1)}</span>
            </div>
          </label>

          {/* Border Color */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Border Color:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-8 h-6 rounded-lg cursor-pointer bg-gray-800 p-0"
              />
              <span className="text-sm text-gray-400">{borderColor}</span>
            </div>
          </label>

          {/* Border Width */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Border Width:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={borderWidth}
                onChange={(e) => setBorderWidth(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #105BFF ${borderWidth * 10}%, #4B5563 ${
                    borderWidth * 10
                  }%)`,
                }}
              />
              <span className="text-sm text-gray-400 w-10 flex justify-end">{borderWidth}px</span>
            </div>
          </label>

          {/* Submit and Reset Buttons */}
          <div className="flex gap-4 mt-6 col-span-2">
            {/* Reset Button */}
            <button
              type="button"
              className="w-1/4 cursor-pointer hover:bg-gray-500 rounded-lg text-white text-sm sm:text-base bg-gray-600"
              onClick={() => {
                setIconColor("#ffffff");
                setBackgroundColor("#000000");
                setBorderColor("#cccccc");
                setCornerRadius(40);
                setIconScale(0.6);
                setBorderWidth(2);
              }}
            >
              Reset
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex-1 py-3 tracking-wide cursor-pointer hover:bg-blue-600 rounded-lg text-white text-sm sm:text-base"
              style={{ backgroundColor: "#105BFF" }}
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
