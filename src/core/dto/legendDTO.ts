import { SharedValue } from 'react-native-reanimated';
import { RawDataProps, ReanimatedGraphProps } from './graphDTO';

export interface LegendProps {
  type: 'x' | 'y',
  height: number,
  width: SharedValue<number>,
  data: SharedValue<RawDataProps>,
  quantity: ReanimatedGraphProps['yAxisLegendQuantity'] | ReanimatedGraphProps['xAxisLegendQuantity'],
  textStyle: ReanimatedGraphProps['textStyle'],
  renderFunction: ReanimatedGraphProps['renderXAxisLegend'] | ReanimatedGraphProps['renderYAxisLegend'],
}
