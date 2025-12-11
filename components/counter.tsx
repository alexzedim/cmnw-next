"use client";

import { useState, useCallback } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button className="btn btn-sm btn-icon btn-ghost" onClick={decrement}>−</button>
      <div className="min-w-20 text-center">
        <span className="text-lg font-semibold">{count}</span>
      </div>
      <button className="btn btn-sm btn-icon btn-ghost" onClick={increment}>+</button>
      <button className="btn btn-sm btn-ghost" onClick={reset}>Reset</button>
    </div>
  );
};
