import { SharedValue } from 'react-native-reanimated';
import { DataProps, ReanimatedGraphProps } from './graphDTO';

export interface ExtremesProps {
  width: SharedValue<number>,
  height: number,
  data: SharedValue<DataProps>,
  yAxisQuantity: number,
  textStyle: ReanimatedGraphProps['textStyle'],
  renderFunction: ReanimatedGraphProps['renderExtremeValue']
}

interface ExtremeValueProps {
  value: number,
  pos: { x: number, y: number },
  reverse: boolean,
}

export interface ExtremeValuesProps {
  min: ExtremeValueProps,
  max: ExtremeValueProps,
}
