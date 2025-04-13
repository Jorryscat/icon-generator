"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/utils/api";
import useDebounce from "@/hooks/useDebounce";

export default function Home() {
  const searchParams = useSearchParams(); // 获取 URL 参数
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
  const [glassmorphismEnabled, setGlassmorphismEnabled] = useState(false); // 新增状态
  const [colorRichness, setColorRichness] = useState(1); // 新增状态

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  
  // 工具函数：将 RGB 转换为 HEX
  const rgbToHex = (rgb: string): string => {
    const [r, g, b] = rgb.split(",").map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };


  const {debouncedFunction: handleGenerate , isPending: isGenerating} = useDebounce(async () => {
    const payload = {
      icon: iconName,
      shape: baseShape,
      icon_color: hexToRgb(iconColor), // 转换为 RGB 数组
      background_color: hexToRgb(backgroundColor), // 转换为 RGB 数组
      border_color: hexToRgb(borderColor), // 转换为 RGB 数组
      corner_radius: cornerRadius,
      icon_scale: iconScale,
      border_width: borderWidth,
      glassmorphism: glassmorphismEnabled, // 新增参数
      color_richness: colorRichness, // 新增参数
      format: "svg", // 假设输出格式为 svg
    };

    setLoading(true); // 开始加载
    setGeneratedIcon(null); // 清空之前生成的图标

    try {
      const response = await api.post("/generate-flat-icon", payload);
      setGeneratedIcon(response.data.svg); // 假设后端返回的是 SVG 字符串
      console.log("发送的数据",JSON.stringify(payload)); // 打印发送的数据
      console.log("返回的数据",JSON.stringify(response.data.svg)); // 打印返回的数据
    } catch (error) {
      console.error("Failed to generate icon:", error);
    } finally {
      setLoading(false); // 结束加载
    }
  });

  const { debouncedFunction: handleSaveSvg, isPending: isSaving } = useDebounce(async () => {
    try {
      const response = await api.post("/generate-flat-icon", {
        icon: iconName,
        shape: baseShape,
        icon_color: hexToRgb(iconColor),
        background_color: hexToRgb(backgroundColor),
        border_color: hexToRgb(borderColor),
        corner_radius: cornerRadius,
        icon_scale: iconScale,
        border_width: borderWidth,
        glassmorphism: glassmorphismEnabled,
        color_richness: colorRichness,
        format: "svg",
      });

      const blob = new Blob([response.data.svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${iconName}.svg`; // 下载文件名
      link.click();
      URL.revokeObjectURL(url); // 释放 URL 对象
    } catch (error) {
      console.error("Failed to download SVG:", error);
    }
  });

  const handleReset = () => {
    setIconColor("#ffffff");
    setBackgroundColor("#3d58e8");
    setBaseShape("square");
    setBorderColor("#cccccc");
    setCornerRadius(40);
    setIconScale(0.6);
    setBorderWidth(2);
    setIconName(iconOptions[0] || "");
    setGeneratedIcon(null); // 清空之前生成的图标
    setGlassmorphismEnabled(false); // 重置 Glassmorphism 状态
    setColorRichness(1); // 重置 Color Richness 状态
  };

  // 初始化时请求图标名称
  useEffect(() => {
    const fetchIconNames = async () => {
      try {
        const response = await api.get("/icon-name"); // 请求后端接口
        setIconOptions(response.data.icons); // 设置图标名称列表
        setIconName(searchParams.get("icon") || response.data.icons[0]); // 默认选中第一个图标
      } catch (error) {
        console.error("Failed to fetch icon names:", error);
      }
    };

    fetchIconNames();
  }, []);

  useEffect(() => {
    // 从 URL 参数中初始化状态
    const icon = searchParams.get("icon");
    const shape = searchParams.get("shape");
    const iconColorParam = searchParams.get("icon_color");
    const backgroundColorParam = searchParams.get("background_color");
    const borderColorParam = searchParams.get("border_color");
    const cornerRadiusParam = searchParams.get("corner_radius");
    const iconScaleParam = searchParams.get("icon_scale");
    const colorRichnessParam = searchParams.get("color_richness");
    const glassmorphismParam = searchParams.get("glassmorphism");

    if (icon) setIconName(icon);
    if (shape) setBaseShape(shape);
    if (iconColorParam) setIconColor(rgbToHex(iconColorParam)); // 转换为 HEX
    if (backgroundColorParam) setBackgroundColor(rgbToHex(backgroundColorParam)); // 转换为 HEX
    if (borderColorParam) setBorderColor(rgbToHex(borderColorParam)); // 转换为 HEX
    if (cornerRadiusParam) setCornerRadius(Number(cornerRadiusParam));
    if (iconScaleParam) setIconScale(Number(iconScaleParam));
    if (colorRichnessParam) setColorRichness(Number(colorRichnessParam));
    if (glassmorphismParam) setGlassmorphismEnabled(glassmorphismParam === "true"); // 转换为布尔值

    // 调用生成图标的 API
    const generateIcon = async () => {
      try {
        const response = await api.post("/generate-flat-icon", {
          icon,
          shape,
          icon_color: iconColorParam?.split(",").map(Number),
          background_color: backgroundColorParam?.split(",").map(Number),
          border_color: borderColorParam?.split(",").map(Number),
          corner_radius: Number(cornerRadiusParam),
          icon_scale: Number(iconScaleParam),
          color_richness: Number(colorRichnessParam),
          glassmorphism: glassmorphismParam === "true",
          format: "svg",
        });
        setGeneratedIcon(response.data.svg);
      } catch (error) {
        console.error("Failed to generate icon:", error);
      }
    };

    generateIcon();
  }, [searchParams]);

  return (
    <div className="grid grid-cols-2 min-h-screen font-[family-name:var(--font-geist-sans)] gap-6 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center p-4 pl-10">
        <div
          className="relative flex w-2/3 items-center justify-center border-2 rounded-lg glass-effect group"
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

          {/* Save SVG Button */}
          {generatedIcon && (
            <button
              className={`absolute top-[-30] right-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer ${
                isSaving ? "text-gray-600" : "text-gray-300"
              }`}
              onClick={handleSaveSvg}
              disabled={isSaving} // 禁用按钮以防止重复点击
            >
              Save SVG
            </button>
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
              className="px-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:border-none focus:ring-gray-200 text-sm bg-gray-800 text-gray-100"
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
              <option value="triangle">Triangle</option>
              <option value="hexagon">Hexagon</option>
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

          {/* Glassmorphism Style */}
          <label className="flex flex-col relative">
            <span className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              Enhance Texture:
              <div className="relative">
                <div className="group w-4 h-4 bg-gray-500 text-white text-xs flex items-center justify-center rounded-full cursor-pointer">
                  i
                  <div className="absolute left-6 mt-[-20] w-48 bg-gray-800 text-gray-200 text-xs rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    Enable or disable the glassmorphism effect for the icon.
                  </div>
                </div>
              </div>
            </span>
            <div className="flex items-center gap-3">
              <div
                className={`relative w-12 h-6 flex items-center bg-gray-600 rounded-full p-1 cursor-pointer transition-colors`}
                style={glassmorphismEnabled ? { backgroundColor: "#105BFF" } : {}} // 设置背景颜色
                onClick={() => setGlassmorphismEnabled(!glassmorphismEnabled)} // 切换开关状态
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    glassmorphismEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
              <span className="text-sm text-gray-400">{glassmorphismEnabled ? "Enabled" : "Disabled"}</span>
            </div>
          </label>

          {/* Color Richness */}
          <label className="flex flex-col relative">
            <span className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              Color Richness:
              <div className="relative">
                <div className="group w-4 h-4 bg-gray-500 text-white text-xs flex items-center justify-center rounded-full cursor-pointer">
                  i
                  <div className="absolute left-6 mt-[-10] w-48 bg-gray-800 text-gray-200 text-xs rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    Adjust the number of colors blended into the icon.
                  </div>
                </div>
              </div>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={colorRichness}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setColorRichness(value === 0 ? 1 : value); // 强制将 0 设置为 1
                }}
                className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #105BFF ${Math.max(colorRichness * 25, 25)}%, #4B5563 ${
                    Math.max(colorRichness * 25, 25)
                  }%)`,
                }}
              />
              <span className="text-sm text-gray-400 w-10 flex justify-end">{colorRichness}</span>
            </div>
          </label>

          {/* Submit and Reset Buttons */}
          <div className="flex gap-4 mt-6 col-span-2">
            {/* Reset Button */}
            <button
              type="button"
              className="w-1/4 cursor-pointer hover:bg-gray-500 rounded-lg text-white text-sm sm:text-base bg-gray-600"
              onClick={handleReset}
            >
              Reset
            </button>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              className="flex-1 py-3 tracking-wide cursor-pointer rounded-lg text-white text-sm sm:text-base relative overflow-hidden ${}"
              style={isGenerating? {background: "#407cff"}:{background:"#105BFF"}} // 设置按钮背景颜色
              // style={{
              //   background: `linear-gradient(to right, #105BFF,rgb(51, 201, 243))`,
              // }}
              disabled={isGenerating} // 禁用按钮以防止重复点击
            >
              {/* 光效层 */}
              {isGenerating && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 animate-light-flow"></span>
              )}
              {/* <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100 animate-light-flow"></span> */}
              {/* 按钮文字 */}
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
