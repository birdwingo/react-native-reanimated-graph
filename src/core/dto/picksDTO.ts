import { SharedValue } from 'react-native-reanimated';
// eslint-disable-next-line import/no-cycle
import { DataProps } from './graphDTO';

export interface PickProps {
  x: number,
  y: number,
  color: string,
  renderLabel?: () => JSX.Element,
}

export interface PickComponentProps extends PickProps {
  data: SharedValue<DataProps>,
  points: SharedValue<{ x: number, y: number }[]>,
  selectedX: SharedValue<number>,
}

export interface PicksProps {
  data: SharedValue<DataProps>,
  points: SharedValue<{ x: number, y: number }[]>,
  selectedX: SharedValue<number>,
}
