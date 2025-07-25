import { SharedValue } from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import { PointData } from './graphDTO';

export interface GraphPathProps {
  pathRef: React.RefObject<Path>,
  points: SharedValue<PointData[]>,
  strokeWidth?: number,
  strokeLinecap?: 'butt' | 'round' | 'square',
  strokeDasharray?: number[],
}
