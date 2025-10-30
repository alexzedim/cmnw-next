"use client";

import { useState, useCallback } from "react";
import { Button } from "@heroui/button";

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
      <Button
        isIconOnly
        color="danger"
        size="sm"
        variant="flat"
        onPress={decrement}
      >
        -
      </Button>
      <div className="min-w-20 text-center">
        <span className="text-lg font-semibold">{count}</span>
      </div>
      <Button
        isIconOnly
        color="success"
        size="sm"
        variant="flat"
        onPress={increment}
      >
        +
      </Button>
      <Button color="default" size="sm" variant="light" onPress={reset}>
        Reset
      </Button>
    </div>
  );
};
