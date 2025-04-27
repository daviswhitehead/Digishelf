declare module 'react-native-vector-icons/Ionicons' {
  import { ComponentType } from 'react';

  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }

  const Icon: ComponentType<IconProps>;
  export default Icon;
}

declare module 'colorthief' {
  export default class ColorThief {
    getColor(img: HTMLImageElement | null): [number, number, number];
    getPalette(img: HTMLImageElement | null, colorCount?: number): Array<[number, number, number]>;
  }
}

declare module 'react-native-vector-icons/Fonts/Ionicons.ttf' {
  const content: string;
  export default content;
}
