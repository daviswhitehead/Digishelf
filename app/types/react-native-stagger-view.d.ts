declare module '@mindinventory/react-native-stagger-view' {
  import { ComponentType } from 'react';
  import { ViewStyle, StyleProp } from 'react-native';

  interface StaggerViewProps {
    containerStyle?: StyleProp<ViewStyle>;
    animationDuration?: number;
    delay?: number;
    children: React.ReactNode;
  }

  const StaggerView: ComponentType<StaggerViewProps>;
  export default StaggerView;
}
