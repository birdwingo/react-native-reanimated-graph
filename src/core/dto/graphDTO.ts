import { ReactNode } from 'react';
import { LayoutChangeEvent, ViewProps, TextProps } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
// eslint-disable-next-line import/no-cycle
import { PickProps } from './picksDTO';

export interface ReanimatedGraphProps {
  // props
  xAxis?: number[],
  yAxis?: number[],
  picks?: PickProps[],
  color?: string,
  widthRatio?: number,
  selectionArea?: 'none' | 'default' | 'custom',
  selectionAreaData?: number[],
  height?: number,
  defaultWidth?: number,
  animated?: boolean,
  animationDuration?: number,
  smoothAnimation?: boolean,
  type?: 'curve' | 'line',
  maxPoints?: number,
  showXAxisLegend?: boolean,
  xAxisLegendQuantity?: number,
  showYAxisLegend?: boolean,
  yAxisLegendQuantity?: number,
  showExtremeValues?: boolean,
  showBlinkingDot?: boolean,
  blinkingDotRadius?: number,
  blinkingDotExpansion?: number,
  showSelectionDot?: boolean,
  selectionDotRadius?: number,
  selectionDotExpansion?: number,
  selectionLines?: 'horizontal' | 'vertical' | 'both' | 'none',
  selectionLineColor?: string,
  gestureEnabled?: boolean,
  containerStyle?: ViewProps['style'],
  graphStyle?: ViewProps['style'],
  textStyle?: TextProps['style'],
  // stroke
  strokeWidth?: number,
  strokeLinecap?: 'butt' | 'round' | 'square',
  strokeDasharray?: number[],
  // render functions
  renderXAxisLegend?: ( value: number, index: number ) => ReactNode | string | number,
  renderYAxisLegend?: ( value: number, index: number ) => ReactNode | string | number,
  renderExtremeValue?: ( value: number, type: 'min' | 'max' ) => ReactNode | string | number,
  // callbacks
  onGestureStart?: () => void,
  onGestureEnd?: () => void,
  onGestureUpdate?: ( xValue: number, yValue: number, index: number ) => void,
}

export type ReanimatedGraphPublicMethods = {
  updateData: ( data : {
    xAxis: ReanimatedGraphProps['xAxis'],
    yAxis: ReanimatedGraphProps['yAxis'],
    picks?: ReanimatedGraphProps['picks'],
    color?: ReanimatedGraphProps['color'],
    widthRatio?: ReanimatedGraphProps['widthRatio'],
    selectionArea?: ReanimatedGraphProps['selectionArea'],
    selectionAreaData?: ReanimatedGraphProps['selectionAreaData'],
    showBlinkingDot?: ReanimatedGraphProps['showBlinkingDot'], }
  ) => void
};

export interface PointData {
  x: number,
  y: number,
}

export interface RawDataProps {
  x: number[],
  y: number[],
}

export type DataProps = {
  from: PointData[],
  to: RawDataProps,
  picks: PickProps[],
};

export interface GraphWrapperProps {
  children: React.ReactNode;
  width: SharedValue<number>;
  height: number;
  style?: ViewProps['style'];
  onLayout: ( e: LayoutChangeEvent ) => void;
}
