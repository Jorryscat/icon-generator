"use client";
import { useState, useEffect } from "react";
import api from "@/utils/api";

export default function Home() {
  const [iconColor, setIconColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#3d58e8");
  const [borderColor, setBorderColor] = useState("#cccccc");
  const [cornerRadius, setCornerRadius] = useState(40); // Default: 50 (0-100)
  const [iconScale, setIconScale] = useState(0.6); // Default: 0.5 (0.1-1)
  const [borderWidth, setBorderWidth] = useState(2); // Default: 2 (0-10)
  const [iconName, setIconName] = useState(""); // 当前选中的图标名称
  const [baseShape, setBaseShape] = useState("square"); // 基础形状
  const [iconOptions, setIconOptions] = useState<string[]>([]); // 图标名称列表
  const [loading, setLoading] = useState(false); // 控制 loading 状态
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null); // 存储生成的图标



  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // 处理 Generate 按钮点击事件
  const handleGenerate = async () => {
    const payload = {
      icon: iconName,
      shape: baseShape,
      icon_color: hexToRgb(iconColor), // 转换为 RGB 数组
      background_color: hexToRgb(backgroundColor), // 转换为 RGB 数组
      border_color: hexToRgb(borderColor), // 转换为 RGB 数组
      corner_radius: cornerRadius,
      icon_scale: iconScale,
      border_width: borderWidth,
      format: "svg", // 假设输出格式为 svg
    };

    setLoading(true); // 开始加载
    setGeneratedIcon(null); // 清空之前生成的图标

    try {
      const response = await api.post("/generate-flat-icon", payload);
      setGeneratedIcon(response.data.svg); // 假设后端返回的是 SVG 字符串
    } catch (error) {
      console.error("Failed to generate icon:", error);
    } finally {
      setLoading(false); // 结束加载
    }
  };


    // 初始化时请求图标名称
    useEffect(() => {
      const fetchIconNames = async () => {
        try {
          const response = await api.get("/icon-name"); // 请求后端接口
          setIconOptions(response.data.icons); // 设置图标名称列表
          setIconName(response.data.icons[0] || ""); // 默认选中第一个图标
        } catch (error) {
          console.error("Failed to fetch icon names:", error);
        }
      };
  
      fetchIconNames();
    }, []);

  return (
    <div className="grid grid-cols-2 min-h-screen font-[family-name:var(--font-geist-sans)] gap-6 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center p-4 pl-10">
        <div
          className="flex w-2/3 items-center justify-center border-2 rounded-lg glass-effect"
          style={{ aspectRatio: "1 / 1" }}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          ) : generatedIcon ? (
            <div
              dangerouslySetInnerHTML={{ __html: generatedIcon }}
              className="w-full h-full flex items-center justify-center"
            ></div>
          ) : (
            <p className="text-gray-400 text-sm">Your generated SVG will appear here.</p>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-col justify-center gap-6 pr-40 ml-[-20]">
        {/* Title with Logo */}
        <div className="flex items-center justify-start gap-4">
          {/* Logo */}
          <img
            src="/logo.png" // 替换为实际的 logo 图片路径
            alt="Logo"
            className="w-10 h-10 object-contain" // 调整大小以保持协调
          />
          {/* Title */}
          <h1 className="text-3xl font-semibold text-white">Collect generate rules:</h1>
        </div>

        {/* Form */}
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
          onSubmit={(e) => e.preventDefault()} // 阻止表单默认提交行为, 防止强制刷新页面
        >
          {/* Icon Name */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Icon Name:</span>
            <select
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-800 text-gray-100"
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon} className="bg-gray-800 text-gray-100 hover:bg-gray-700">
                  {icon}
                </option>
              ))}
            </select>
          </label>

          {/* Shape */}
          <label className="flex flex-col">
            <span className="text-sm font-medium text-gray-300 mb-2">Base Shape:</span>
            <select
              value={baseShape}
              className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-none focus:ring-1 focus:ring-gray-200 text-sm bg-gray-800 text-gray-100"
              onChange={(e) => setBaseShape(e.target.value)}
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="hexagon">hexagon</option>
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
                setBackgroundColor("#3d58e8");
                setBaseShape("square");
                setBorderColor("#cccccc");
                setCornerRadius(40);
                setIconScale(0.6);
                setBorderWidth(2);
                setIconName(iconOptions[0] || "");
                setGeneratedIcon(null); // 清空之前生成的图标
              }}
            >
              Reset
            </button>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              className="flex-1 py-3 tracking-wide cursor-pointer rounded-lg text-white text-sm sm:text-base relative overflow-hidden"
              style={{ backgroundColor: "#105BFF" }}
            >
              {/* 光效层 */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 animate-light-flow"></span>
              {/* 按钮文字 */}
              <span className="relative z-10">Generate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
