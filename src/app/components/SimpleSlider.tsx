import * as React from "react";

interface SliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  max?: number;
  step?: number;
  className?: string;
}

export function SimpleSlider({ value, onValueChange, max = 100, step = 1, className = "" }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([parseFloat(e.target.value)]);
  };

  return (
    <input
      type="range"
      min={0}
      max={max}
      step={step}
      value={value[0] || 0}
      onChange={handleChange}
      className={`w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer slider-thumb ${className}`}
      style={{
        background: `linear-gradient(to right, rgb(220, 38, 38) 0%, rgb(220, 38, 38) ${(value[0] / max) * 100}%, rgb(39, 39, 42) ${(value[0] / max) * 100}%, rgb(39, 39, 42) 100%)`
      }}
    />
  );
}
