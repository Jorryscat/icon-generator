import { useCallback, useRef, useState } from "react";

export default function useDebounce(
  callback: (...args: any[]) => Promise<void> | void,
  delay: number = 1000
) {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [isPending, setIsPending] = useState(false); // 用于管理防抖期间的状态

  const debouncedFunction = useCallback(
    async (...args: any[]) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      setIsPending(true); // 设置为加载中状态

      timer.current = setTimeout(async () => {
        try {
          await callback(...args); // 执行传入的回调函数
        } finally {
          setIsPending(false); // 防抖结束后恢复状态
        }
      }, delay);
    },
    [callback, delay]
  );

  return { debouncedFunction, isPending };
}