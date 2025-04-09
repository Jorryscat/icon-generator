module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // 根据你的项目结构调整路径
  ],
  theme: {
    extend: {
      keyframes: {
        bounceX: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "50%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
      },
      animation: {
        "bounce-on-hover": "bounceX 0.6s ease-in-out",
      },
    },
  },
  plugins: [],
};