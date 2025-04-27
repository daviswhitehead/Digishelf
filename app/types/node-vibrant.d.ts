declare module 'node-vibrant' {
  interface Swatch {
    rgb: [number, number, number];
    hsl: [number, number, number];
    hex: string;
    population: number;
  }

  interface SwatchMap {
    Vibrant?: Swatch;
    Muted?: Swatch;
    DarkVibrant?: Swatch;
    DarkMuted?: Swatch;
    LightVibrant?: Swatch;
    LightMuted?: Swatch;
  }

  class Vibrant {
    static from(src: string | HTMLImageElement): Vibrant;
    getPalette(): Promise<SwatchMap>;
  }

  export = Vibrant;
}
