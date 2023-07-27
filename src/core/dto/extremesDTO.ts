import { SharedValue } from 'react-native-reanimated';
import { DataProps, PointData, ReanimatedGraphProps } from './graphDTO';

export interface ExtremesProps {
  width: SharedValue<number>,
  points: SharedValue<PointData[]>,
  data: SharedValue<DataProps>,
  textStyle: ReanimatedGraphProps['textStyle'],
  renderFunction: ReanimatedGraphProps['renderExtremeValue']
}
