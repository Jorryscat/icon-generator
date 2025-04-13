"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div
      className="
      relative min-h-screen flex flex-col items-center 
      justify-center text-center text-white 
      bg-gradient-to-b from-gray-900 to-gray-800 
      p-4 sm:p-10 font-[family-name:var(--font-geist-sans)]"
    >
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/cover1.png')",
        }}
      ></div>
      {/* Main Content */}
      <div className="space-y-4 z-10">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/logo.png"
            alt="Icon"
            width={40}
            height={40}
          />
          <h1 className="text-4xl font-bold sm:text-5xl ml-3">Munia Icon Generator</h1>
        </div>
        <p className="text-lg sm:text-xl text-gray-200 mt-6">
          Create stunning icons with ease and flexibility.
        </p>
        <div className="flex gap-4 justify-center mt-30">
          <button
            className="px-8 py-3 tracking-wide cursor-pointer hover:bg-blue-600 rounded-lg text-white text-sm sm:text-base bounce-on-hover"
            style={{ backgroundColor: "#105BFF" }}
            onClick={() => router.push("/main")}
          >
            创建图标
          </button>
          <button
            className="px-8 py-3 tracking-wide cursor-pointer bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm sm:text-base ml-4 bounce-on-hover"
            onClick={() => router.push("/recipes")}
          >
            在线配方
          </button>
        </div>
      </div>
    </div>
  );
}
