import React from 'react';

interface SliderProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: number[];
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
  className?: string; 
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value = [0], max = 100, step = 1, onValueChange, className, ...props }, ref) => {
    const internalValue = value[0];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      onValueChange?.([newValue]);
    };

    return (
      <div ref={ref} className={`relative flex items-center h-4 w-full ${className}`} {...props}>
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={internalValue}
          onChange={handleChange}
          className="w-full h-1 appearance-none bg-purple-500/30 rounded-full cursor-pointer
                     [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400 [&::-webkit-slider-thumb]:appearance-none
                     [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-400 [&::-moz-range-thumb]:border-none"
        />
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };