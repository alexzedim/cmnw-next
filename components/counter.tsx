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
        color="danger"
        variant="flat"
        onPress={decrement}
        isIconOnly
        size="sm"
      >
        -
      </Button>
      <div className="min-w-20 text-center">
        <span className="text-lg font-semibold">{count}</span>
      </div>
      <Button
        color="success"
        variant="flat"
        onPress={increment}
        isIconOnly
        size="sm"
      >
        +
      </Button>
      <Button color="default" variant="light" onPress={reset} size="sm">
        Reset
      </Button>
    </div>
  );
};
