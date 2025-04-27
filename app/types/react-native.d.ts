import 'react-native';

declare module 'react-native' {
  export const View: any;
  export const Text: any;
  export const Image: any;
  export const StyleSheet: any;
  export const Pressable: any;
  export const TouchableOpacity: any;
  export const TextInput: any;
  export const ScrollView: any;
  export const AppRegistry: any;
  export const useWindowDimensions: any;

  interface ViewStyle {
    position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
    height?: string | number;
    width?: string | number;
    transition?: string;
    whiteSpace?: string;
    from?: any;
    to?: any;
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  }

  interface TextStyle {
    numberOfLines?: number;
    whiteSpace?: string;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  }

  interface ImageStyle {
    overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  }

  type DimensionValue = string | number;

  interface StyleProp<T> {
    [key: string]: any;
  }
}

// Add missing module declarations
declare module 'react-native-vector-icons/Fonts/Ionicons.ttf' {
  const content: any;
  export default content;
}

declare module '../data/books' {
  const content: any;
  export default content;
}

// Extend HTMLStyleElement
interface HTMLStyleElement extends HTMLElement {
  styleSheet?: CSSStyleSheet;
}
