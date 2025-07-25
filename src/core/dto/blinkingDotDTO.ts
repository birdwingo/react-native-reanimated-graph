import { SharedValue } from 'react-native-reanimated';
import { PointData, ReanimatedGraphProps } from './graphDTO';

export interface BlinkingDotProps {
  show: SharedValue<ReanimatedGraphProps['showBlinkingDot']>,
  color: ReanimatedGraphProps['color'],
  points: SharedValue<PointData[]>,
  radius: ReanimatedGraphProps['blinkingDotRadius'],
  expansion: ReanimatedGraphProps['blinkingDotExpansion'],
}
