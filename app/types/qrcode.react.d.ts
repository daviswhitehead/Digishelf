declare module 'qrcode.react' {
  import { ComponentType } from 'react';

  export interface QRProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    imageSettings?: {
      src: string;
      height: number;
      width: number;
      excavate: boolean;
      x?: number;
      y?: number;
      opacity?: number;
    };
  }

  export const QRCodeSVG: ComponentType<QRProps>;
  export const QRCodeCanvas: ComponentType<QRProps>;
}
