"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

interface ConfigList {
  icon: string;
  shape: string;
  icon_color: [number, number, number];
  background_color: [number, number, number];
  format: string;
  corner_radius: number;
  icon_scale: number;
  border_color: [number, number, number];
  border_width: number;
  glassmorphism: boolean;
  color_richness: number;
}

interface Recipe {
  svg_item: string; // SVG 数据
  config_list: ConfigList; // 配置参数
}

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const router = useRouter(); // 使用 Next.js 的路由

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get("/recipes"); // 请求后端获取配方数据
        console.log("配方数据", response.data); // 打印配方数据
        setRecipes(response.data.recipes); // 设置配方列表
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleCardClick = (recipe: Recipe) => {
    // 跳转到 /main 页面并携带参数
    const queryString = new URLSearchParams(
      Object.entries(recipe.config_list).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value) ? value.join(",") : value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    router.push(`/main?${queryString}`); // 将配方参数传递到 /main 页面
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 p-6">
      {/* Header */}
      <div className="mt-30 text-center mb-10">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Icon Recipes</h1>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl">
        {recipes.map((recipe, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center cursor-pointer bg-gray-800 rounded-lg p-3 shadow-lg glass-effect hover:shadow-xl hover:scale-105 transition-all duration-300 mb-3"
            onClick={() => handleCardClick(recipe)} // 添加点击事件
          >
            {/* SVG */}
            <div className="flex items-center justify-center overflow-hidden">
              <div
                style={{ transform: "scale(0.8)" }}
                dangerouslySetInnerHTML={{ __html: recipe.svg_item }}
                className="w-full h-full"
              ></div>
            </div>
            {/* Name */}
            <p className="text-gray-300 text-sm mt-2">{recipe.config_list.icon}</p>
          </div>
        ))}
      </div>
    </div>
  );
}