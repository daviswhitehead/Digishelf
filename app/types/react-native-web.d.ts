declare module 'react-native-web' {
  import { ComponentType, ReactNode } from 'react';

  interface ViewStyle {
    flex?: number;
    height?: string | number;
    alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
    justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around';
    backgroundColor?: string;
  }

  interface TextStyle {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    marginBottom?: number;
  }

  interface StyleSheetStatic {
    create<T extends { [key: string]: ViewStyle | TextStyle }>(styles: T): T;
  }

  export const View: ComponentType<{
    style?: ViewStyle | ViewStyle[];
    children?: ReactNode;
  }>;

  export const Text: ComponentType<{
    style?: TextStyle | TextStyle[];
    children?: ReactNode;
  }>;

  export const StyleSheet: StyleSheetStatic;

  export const AppRegistry: {
    registerComponent: (appKey: string, getComponentFunc: () => ComponentType<any>) => void;
    getApplication: (appKey: string) => { getStyleElement: () => JSX.Element };
  };
}

declare class AnimatedValue {
  constructor(value: number);
  setValue(value: number): void;
}
