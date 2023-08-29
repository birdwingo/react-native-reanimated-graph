import { SharedValue } from 'react-native-reanimated';
import { DataProps, PointData, ReanimatedGraphProps } from './graphDTO';

export interface BlinkingDotProps {
  show: SharedValue<ReanimatedGraphProps['showBlinkingDot']>,
  color: ReanimatedGraphProps['color'],
  points: SharedValue<PointData[]>,
  sectionsColors: SharedValue<string[]>,
  data: SharedValue<DataProps>,
  sections: SharedValue<number[]>,
}
