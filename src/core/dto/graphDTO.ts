import { DerivedValue, SharedValue } from 'react-native-reanimated';

export interface ChartProps {
  width?: number,
  height?: number,
  padding?: number,
  onHover?: ( profit: number, timestamp: number, index: number ) => void,
  onPaning?: ( val: boolean ) =>void,
}

export interface ChartLabelProps {
  width: SharedValue<number>,
  points: DerivedValue<{ x: number, y: number }[]>,
}

export type Period = '1D' | '1W' | '1M' | '1Y' | 'A';

export interface LabelsProps {
  max: { x: number, y: number },
  min: { x: number, y: number }
}

export interface LabelsData {
  max: { value: number, index: number },
  min: { value: number, index: number },
}

export interface ChartCaptionProps {
  height?: number,
  extremeValues: DerivedValue<number[]>,
  period: SharedValue<Period>,
}

export type ChartPublicMethods = {
  updateData: (
    xAxis: number[],
    yAxis: number[],
    profit: number,
    period: Period,
  ) => void
};

export type ChartLabelPublicMethods = {
  setData: ( { max, min } : LabelsData ) =>void,
};
