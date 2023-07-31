import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  Circle, Path, Rect, Svg,
} from 'react-native-svg';

export const AnimatedPath = Animated.createAnimatedComponent( Path );
export const AnimatedCircle = Animated.createAnimatedComponent( Circle );
export const AnimatedRect = Animated.createAnimatedComponent( Rect );
export const AnimatedSvg = Animated.createAnimatedComponent( Svg );
export const AnimatedView = Animated.createAnimatedComponent( View );
