import React, {
  forwardRef, useImperativeHandle, useEffect, useRef, useState, useCallback, memo, useMemo,
} from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { Path } from 'react-native-svg';
import {
  runOnJS, useAnimatedReaction, useDerivedValue,
  useSharedValue, withTiming,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import {
  DataProps, RawDataProps, ReanimatedGraphProps, ReanimatedGraphPublicMethods,
} from '../../core/dto/graphDTO';
import GraphStyles from './Graph.styles';
import { useGesture } from '../../core/hooks';
import {
  ANIMATION_DURATION, AXIS_LEGEND_QUANTITY, CHART_OFFSET, DEFAULT_HEIGHT, MAX_POINTS, WAIT,
} from '../../core/constants/data';
import GraphWrapper from './graphWrapper';
import GraphPath from '../GraphPath';
import {
  calculatePoints, reducePoints, compareObjects, checkRatio,
} from '../../core/helpers/worklets';
import SelectionArea from '../SelectionArea';
import BlinkingDot from '../BlinkingDot';
import Legend from '../Legend';
import Extremes from '../Extremes';

const ReanimatedGraph = forwardRef<ReanimatedGraphPublicMethods, ReanimatedGraphProps>( ( {
  xAxis = [ 0, 1 ],
  yAxis = [ 0, 0 ],
  color = '#FFFFFF',
  widthRatio = 1,
  selectionArea = 'default',
  selectionAreaData = [],
  height = DEFAULT_HEIGHT,
  animated = true,
  animationDuration = ANIMATION_DURATION,
  type = 'curve',
  maxPoints = MAX_POINTS,
  showXAxisLegend = false,
  xAxisLegendQuantity = AXIS_LEGEND_QUANTITY,
  showYAxisLegend = false,
  yAxisLegendQuantity = AXIS_LEGEND_QUANTITY,
  showExtremeValues = true,
  showBlinkingDot = false,
  showSelectionDot = true,
  selectionLines = 'both',
  selectionLineColor = '#D4D4D4',
  gestureEnabled = true,
  containerStyle = {},
  graphStyle = {},
  textStyle = {},
  renderYAxisLegend,
  renderXAxisLegend,
  renderExtremeValue,
  onGestureStart,
  onGestureEnd,
  onGestureUpdate,
}, ref ) => {

  const { x, active, gesture } = useGesture( { onGestureStart, onGestureEnd } );

  const pathRef = useRef<Path>( null );

  const [ colorValue, setColorValue ] = useState( color );

  const lastCall = useSharedValue( Date.now() );
  const width = useSharedValue( 0 );
  const widthRatioValue = useSharedValue( checkRatio( widthRatio ) );
  const graphWidth = useDerivedValue( () => width.value * widthRatioValue.value );

  const progress = useSharedValue( animated ? 0 : 1 );

  const rawData = useSharedValue<RawDataProps>( { x: xAxis, y: yAxis } );
  const data = useSharedValue<DataProps>( {
    from: [ { x: 0, y: 0 }, { x: 0, y: 0 } ],
    to: { x: reducePoints( xAxis, maxPoints ), y: reducePoints( yAxis, maxPoints ) },
  } );
  const selectionAreaValue = useSharedValue<ReanimatedGraphProps['selectionArea']>( selectionArea );
  const selectionAreaDataValue = useSharedValue<ReanimatedGraphProps['selectionAreaData']>( selectionAreaData );
  const showBlinkingDotValue = useSharedValue<ReanimatedGraphProps['showBlinkingDot']>( showBlinkingDot );

  const points = useDerivedValue( () => calculatePoints(
    data.value,
    progress.value,
    graphWidth.value,
    height,
    yAxisLegendQuantity,
  ), [ data.value, progress.value, graphWidth.value, height ] );

  const animate = useCallback( () => {

    if ( animated ) {

      progress.value = 0;
      progress.value = withTiming( 1, { duration: animationDuration } );

    } else {

      progress.value = 1;

    }

  }, [] );

  const updateData: ReanimatedGraphPublicMethods['updateData'] = useCallback( ( newData ) => {

    if ( newData.color ) {

      setColorValue( newData.color );

    }

    widthRatioValue.value = withTiming( checkRatio( newData.widthRatio ?? widthRatio ) );
    selectionAreaValue.value = newData.selectionArea ?? selectionArea;
    selectionAreaDataValue.value = newData.selectionAreaData ?? selectionAreaData;
    showBlinkingDotValue.value = newData.showBlinkingDot ?? showBlinkingDot;

    const { xAxis: newXAxis, yAxis: newYAxis } = newData;

    let newValues = { x: [ 0, 1 ], y: [ 0, 0 ] };

    if ( newXAxis?.length && newYAxis?.length ) {

      if ( compareObjects( { x: newXAxis, y: newYAxis }, rawData.value ) ) {

        return;

      }

      newValues = { x: newXAxis, y: newYAxis };

    }

    rawData.value = newValues;
    data.value = {
      from: points.value,
      to: {
        x: reducePoints( newValues.x, maxPoints ),
        y: reducePoints( newValues.y, maxPoints ),
      },
    };

    animate();

  }, [] );

  const callback = useCallback( () => {

    const { length } = rawData.value.x;
    const step = ( graphWidth.value - CHART_OFFSET * 2 ) / ( length - 1 );
    const index = ( x.value - CHART_OFFSET ) / step;
    const normalizedIndex = Math.max( 0, Math.min( length - 1, Math.round( index ) ) );

    if ( onGestureUpdate ) {

      onGestureUpdate(
        rawData.value.x[normalizedIndex],
        rawData.value.y[normalizedIndex],
        normalizedIndex,
      );

    }

  }, [] );

  const onGestureEvent = () => {

    'worklet';

    if ( active.value
      && ( lastCall.value < Date.now() - WAIT || [ graphWidth.value, 0 ].includes( x.value ) ) ) {

      lastCall.value = Date.now();
      runOnJS( callback )();

    }

  };

  const onLayout = useCallback( ( e: LayoutChangeEvent ) => {

    width.value = e.nativeEvent.layout.width;

  }, [] );

  const Graph = useMemo( () => (
    <GraphWrapper width={width} height={height} onLayout={onLayout} style={graphStyle}>
      <GraphPath pathRef={pathRef} points={points} type={type} />
      <SelectionArea
        width={graphWidth}
        height={height}
        x={x}
        active={active}
        selectionArea={selectionAreaValue}
        selectionAreaData={selectionAreaDataValue}
        showSelectionDot={showSelectionDot}
        selectionLines={selectionLines}
        selectionLineColor={selectionLineColor}
        color={colorValue}
        pathRef={pathRef}
        points={points}
        data={data}
        gestureEnabled={gestureEnabled}
      />
      <BlinkingDot show={showBlinkingDotValue} color={colorValue} points={points} />
      {showExtremeValues && (
      <Extremes
        width={graphWidth}
        height={height}
        data={data}
        yAxisQuantity={yAxisLegendQuantity}
        textStyle={textStyle}
        renderFunction={renderExtremeValue}
      />
      )}
    </GraphWrapper>
  ), [ colorValue ] );

  useAnimatedReaction(
    () => x.value,
    ( res, prev ) => res !== prev && onGestureEvent(),
    [ x.value ],
  );
  useImperativeHandle( ref, () => ( { updateData } ) );
  useEffect( animate, [] );

  return (
    <View style={containerStyle} testID="graphContainer">
      <View style={[ GraphStyles.container, { height } ]}>
        {showYAxisLegend && <Legend type="y" height={height} width={width} data={rawData} quantity={yAxisLegendQuantity} textStyle={textStyle} renderFunction={renderYAxisLegend} />}
        {gestureEnabled ? <GestureDetector gesture={gesture}>{Graph}</GestureDetector> : Graph}
      </View>
      {showXAxisLegend && <Legend type="x" height={height} width={width} data={rawData} quantity={xAxisLegendQuantity} textStyle={textStyle} renderFunction={renderXAxisLegend} />}
    </View>
  );

} );

export default memo( ReanimatedGraph );
