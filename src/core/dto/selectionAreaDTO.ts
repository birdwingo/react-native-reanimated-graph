import { SharedValue } from 'react-native-reanimated';
import { Path } from 'react-native-svg';
import { DataProps, PointData, ReanimatedGraphProps } from './graphDTO';

export interface SelectionAreaProps {
  width: SharedValue<number>,
  height: number,
  x: SharedValue<number>,
  active: SharedValue<boolean>,
  selectionArea: SharedValue<ReanimatedGraphProps['selectionArea']>,
  selectionAreaData: SharedValue<ReanimatedGraphProps['selectionAreaData']>,
  showSelectionDot: ReanimatedGraphProps['showSelectionDot'],
  selectionDotRadius: ReanimatedGraphProps['selectionDotRadius'],
  selectionDotExpansion: ReanimatedGraphProps['selectionDotExpansion'],
  selectionLines: ReanimatedGraphProps['selectionLines'],
  selectionLineColor: ReanimatedGraphProps['selectionLineColor'],
  color: ReanimatedGraphProps['color'],
  pathRef: React.RefObject<Path>,
  points: SharedValue<PointData[]>,
  data: SharedValue<DataProps>,
  gestureEnabled: ReanimatedGraphProps['gestureEnabled'],
}
