import { CSSProperties } from 'react';

export interface LiquidChromeProps {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
  style?: CSSProperties;
  className?: string;
}

declare const LiquidChrome: React.FC<LiquidChromeProps>;
export default LiquidChrome;
