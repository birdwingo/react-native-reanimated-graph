import React, {
  forwardRef, useImperativeHandle, useEffect, useRef, useState, RefObject, useCallback,
} from 'react';
import {
  Circle, Mask, Path, Rect, Svg,
} from 'react-native-svg';
import Animated, {
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedProps, useAnimatedReaction, useDerivedValue,
  useSharedValue, withDelay, withRepeat, withTiming,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { Dimensions, View } from 'react-native';
import {
  ChartLabelPublicMethods, ChartProps,
  ChartPublicMethods, Period,
} from '~/core/dto/graphDTO';
import ChartStyles from './Chart.styles';
import Labels from '../Labels';
import CaptionText from '../Caption';
import { useGesture } from '~/core/hooks';
import { vibrate } from '~/core/helpers';

const AnimatedPath = Animated.createAnimatedComponent( Path );
const AnimatedCircle = Animated.createAnimatedComponent( Circle );
const AnimatedRect = Animated.createAnimatedComponent( Rect );
const AnimatedSvg = Animated.createAnimatedComponent( Svg );

const ANIMATION_DURATION = 750;
const CHART_OFFSET = 10;
const WAIT = 250;
const MAX_POINTS = 512;

const WIDTH = Dimensions.get( 'window' ).width;

const findPointOnPath = ( pathRef: RefObject<Path>, x: number ) => {

  const length = pathRef.current?.getTotalLength() || 0;
  let start = 0;
  let end = length;

  while ( start <= end ) {

    const middle = ( start + end ) / 2;
    const point = pathRef.current?.getPointAtLength( middle ) as { x: number, y:number };

    if ( point?.x < x ) {

      start = middle + 1;

    } else if ( point?.x > x ) {

      end = middle - 1;

    } else {

      return point;

    }

  }

  return pathRef.current?.getPointAtLength(
    Math.max( 0, Math.min( Math.floor( length ), ( start + end ) / 2 ) ),
  );

};

const reducePoints = ( originalPoints : number[] ) => {

  if ( originalPoints.length <= MAX_POINTS ) {

    return originalPoints;

  }

  const points = [ originalPoints[0] ];

  for ( let i = 1; i <= MAX_POINTS; ++i ) {

    const index = ( originalPoints.length - 1 ) * i / MAX_POINTS;

    if ( Math.abs( index - Math.round( index ) ) < 0.00001 ) {

      points.push( originalPoints[index] );

    } else {

      const j = Math.floor( index );
      const a = index - Math.floor( index );
      const b = Math.ceil( index ) - index;

      points.push( originalPoints[j] * b + originalPoints[j + 1] * a );

    }

  }

  return points;

};

const Chart = forwardRef<ChartPublicMethods, ChartProps>( ( {
  width = WIDTH, height = 175, padding = 16, onHover, onPaning,
}, ref ) => {

  const { x, active, gesture } = useGesture();

  const pathRef = useRef<Path>( null );
  const labelRef = useRef<ChartLabelPublicMethods>( null );
  const lastCall = useRef<number>( Date.now() );
  const maxChartWidth = width - 50 - padding * 2;

  const chartWidth = useSharedValue( maxChartWidth );
  const rawData = useSharedValue( { x: [ 0, 0 ], y: [ 0, 0 ] } );
  const animation = useSharedValue( {
    from: [ { x: 1, y: 0 }, { x: chartWidth.value, y: 0 } ],
    to: { x: [ 0, chartWidth.value ], y: [ 0, 0 ] },
  } );
  const animationProgress = useSharedValue( 0 );
  const selection = useSharedValue( { opacity: 0, cx: chartWidth.value, cy: 0 } );
  const period = useSharedValue<Period>( 'A' );
  const currentX = useSharedValue<number | undefined>( undefined );
  const showBlinkingDot = useSharedValue( false );
  const blinkingDotAnimation = useSharedValue( 0 );

  const [ chartColor, setChartColor ] = useState<string>( '#36B475' );

  const extremeValues = useDerivedValue( () => {

    const { y: data } = animation.value.to;

    const max = Math.max( ...data );
    const min = Math.min( ...data );

    if ( period.value === '1D' ) {

      return [ max, min ];

    }

    const { length } = String( Math.round( max ) );
    const add = length === 2 ? 5 : 10 ** Math.max( length - 2, 0 );
    let roundedMax = Math.ceil( max / ( add ) ) * add;
    let roundedMin = Math.floor( min / ( add ) ) * add;

    while ( ( roundedMax - roundedMin ) % 3 ) {

      roundedMax += add;

      if ( ( roundedMax - roundedMin ) % 3 && roundedMin >= add ) {

        roundedMin -= add;

      }

    }

    return [ roundedMax, roundedMin ];

  } );

  const points = useDerivedValue( () => {

    const { x: xAxis, y: yAxis } = animation.value.to;
    const [ maxY, minY ] = extremeValues.value;
    const between = ( a: number, b: number ) => a + ( b - a ) * animationProgress.value;

    if ( maxY === minY ) {

      return [
        { x: 0, y: height - CHART_OFFSET }, { x: chartWidth.value, y: height - CHART_OFFSET },
      ];

    }

    const step = {
      x: ( chartWidth.value - CHART_OFFSET * 2 ) / ( ( xAxis.length - 1 ) || 1 ),
      y: ( height - CHART_OFFSET * 2 ) / ( maxY - minY ),
    };
    const newPoints = [];

    for ( let i = 0; i < yAxis.length; i++ ) {

      if ( animationProgress.value < 1 ) {

        const oldDataIndex = Math.floor( animation.value.from.length / yAxis.length * i );
        newPoints.push( {
          x: CHART_OFFSET + step.x * i,
          y: between(
            animation.value.from[oldDataIndex].y,
            CHART_OFFSET + ( maxY - yAxis[i] ) * step.y,
          ),
        } );

      } else {

        newPoints.push( {
          x: CHART_OFFSET + step.x * i,
          y: CHART_OFFSET + ( maxY - yAxis[i] ) * step.y,
        } );

      }

    }

    return newPoints;

  } );

  const animatedPath = useDerivedValue( () => {

    let path = `M${points.value[0].x},${points.value[0].y}`;

    if ( animation.value.to.x.length === 1 ) {

      return `${path}L${chartWidth.value},${points.value[0].y}`;

    }

    for ( let i = 0; i < points.value.length - 1; i++ ) {

      const previousPoint = points.value[Math.max( i - 1, 0 )];
      const point = points.value[i];
      const nextPoint = points.value[i + 1];
      const nextPoint2 = points.value[Math.min( i + 2, points.value.length - 1 )];

      path += `C
        ${( -previousPoint.x + nextPoint.x ) / 6 + point.x},
        ${( Math.max( -previousPoint.y + nextPoint.y, -1500 / points.value.length ) ) / 6 + point.y},
        ${( point.x - nextPoint2.x ) / 6 + nextPoint.x},
        ${( Math.min( point.y - nextPoint2.y, 1500 / points.value.length ) ) / 6 + nextPoint.y},
        ${nextPoint.x},${nextPoint.y},
      `;

    }

    return path;

  }, [ animationProgress, chartWidth ] );

  const selectionOpacity = useDerivedValue(
    () => ( active.value ? selection.value.opacity : 0 ),
    [ active ],
  );

  const selectionArea = useDerivedValue( () => {

    const getDateValue = ( value: number, type: Period ) => {

      if ( type === '1W' ) {

        return new Date( value * 1000 ).getDate();

      }

      return new Date( value * 1000 ).toLocaleDateString( undefined, { year: '2-digit', month: '2-digit' } );

    };

    if ( !selectionOpacity.value ) {

      return { x: 0, width: chartWidth.value };

    }

    if ( period.value === '1W' || period.value === '1Y' ) {

      const currentValue = animation.value.to.x[currentX.value ?? 0];
      const selectionData = animation.value.to.x.filter(
        ( item ) => getDateValue( item, period.value )
        === getDateValue( currentValue, period.value ),
      );

      const start = points.value[animation.value.to.x.indexOf( Math.min( ...selectionData ) )]?.x
        ?? 0;
      const end = points.value[animation.value.to.x.indexOf( Math.max( ...selectionData ) )]?.x
        ?? 0;

      return { x: start, width: end - start };

    }

    return { x: 0, width: selection.value.cx };

  } );

  const blinkingDot = useDerivedValue( () => {

    if ( !showBlinkingDot.value ) {

      return { opacity: 0, cx: 0, cy: 0 };

    }

    const { x: cx, y: cy } = points.value[points.value.length - 1];

    return { cx, cy, opacity: 1 };

  } );

  const animatedPathProps = useAnimatedProps( () => ( { d: animatedPath.value } ) );
  const animatedCircleProps = useAnimatedProps( () => ( {
    ...selection.value, opacity: selectionOpacity.value,
  } ) );
  const selectionHorizontal = useAnimatedProps( () => ( { opacity: selectionOpacity.value, d: `M0,${selection.value.cy}L${chartWidth.value},${selection.value.cy}` } ) );
  const selectionVertical = useAnimatedProps( () => ( { opacity: selectionOpacity.value, d: `M${selection.value.cx},0L${selection.value.cx},${height}` } ) );
  const selectionAreaProps = useAnimatedProps( () => ( selectionArea.value ) );
  const blinkingDotProps = useAnimatedProps( () => ( blinkingDot.value ) );
  const blinkingDotAnimationProps = useAnimatedProps( () => ( showBlinkingDot.value ? {
    ...blinkingDot.value,
    r: interpolate( blinkingDotAnimation.value, [ 0, 1 ], [ 3, 13 ] ),
    opacity: interpolate( blinkingDotAnimation.value, [ 0, 1 ], [ 1, 0.1 ] ),
  } : blinkingDot.value ) );

  const updateData = ( xAxis: number[], yAxis: number[], profit: number, newPeriod: '1D' | '1W' | '1M' | '1Y' | 'A' ) => {

    if ( JSON.stringify( xAxis ) === JSON.stringify( rawData.value.x ) ) {

      return;

    }

    if ( !xAxis.length ) {

      const timestamp = Number( new Date() ) / 1000;
      xAxis = [ timestamp, timestamp ];
      yAxis = [ 0, 0 ];

    }

    rawData.value = { x: xAxis, y: yAxis };
    xAxis = reducePoints( xAxis );
    yAxis = reducePoints( yAxis );

    animation.value = { from: points.value, to: { x: xAxis, y: yAxis } };
    period.value = newPeriod;
    animationProgress.value = 0;
    animationProgress.value = withTiming( 1, { duration: ANIMATION_DURATION } );
    setChartColor( profit >= 0 ? '#36B475' : '#FFE4FB' );

    const max = Math.max( ...yAxis );
    const filteredY = yAxis.filter( ( value ) => value );
    const min = Math.min( ...( filteredY.length ? filteredY : yAxis ) );

    labelRef.current?.setData( {
      max: { value: max, index: yAxis.indexOf( max ) },
      min: { value: min, index: yAxis.indexOf( min ) },
    } );

  };

  const onActive = useCallback( () => {

    if ( !active.value ) {

      return;

    }

    const { x: cx, y: cy } = findPointOnPath( pathRef, x.value )
    ?? { x: selection.value.cx, y: selection.value.cy };
    selection.value = { opacity: 1, cx, cy };

    const step = ( chartWidth.value - CHART_OFFSET * 2 ) / ( rawData.value.x.length - 1 );
    const index = ( cx - CHART_OFFSET ) / step;
    const normalizedIndex = Math.max(
      0,
      Math.min( rawData.value.x.length - 1, Math.round( index ) ),
    );

    if ( onHover && normalizedIndex !== currentX.value && ( lastCall.current < Date.now() - WAIT
    || normalizedIndex === 0 || normalizedIndex === rawData.value.x.length - 1 ) ) {

      lastCall.current = Date.now();
      onHover(
        rawData.value.y[normalizedIndex],
        rawData.value.x[normalizedIndex],
        normalizedIndex,
      );

    }

    currentX.value = normalizedIndex;

  }, [] );

  const toggleAnimation = ( value = true ) => {

    'worklet';

    if ( value && showBlinkingDot.value ) {

      blinkingDotAnimation.value = withRepeat( withDelay(
        2000,
        withTiming( 1, { duration: ANIMATION_DURATION } ),
      ), -1, false, () => {

        blinkingDotAnimation.value = 0;

      } );

    } else {

      cancelAnimation( blinkingDotAnimation );

    }

  };

  useAnimatedReaction( () => x.value, () => active.value && runOnJS( onActive )(), [ x, active ] );
  useAnimatedReaction( () => active.value, ( res, prev ) => {

    if ( res !== prev ) {

      if ( onPaning ) {

        runOnJS( onPaning )( active.value );

      }

      if ( res ) {

        runOnJS( vibrate )();

      }

      currentX.value = undefined;
      selection.value = { opacity: 0, cx: 0, cy: 0 };

    }

  }, [ active ] );
  useAnimatedReaction(
    () => showBlinkingDot.value,
    ( res, prev ) => res !== prev && toggleAnimation(),
    [ showBlinkingDot ],
  );

  useImperativeHandle( ref, () => ( { updateData } ) );

  useEffect( () => {

    animationProgress.value = withTiming( 1, { duration: ANIMATION_DURATION } );

  }, [] );

  return (
    <View style={[ ChartStyles.container, { padding, width } ]}>
      <CaptionText height={height} extremeValues={extremeValues} period={period} />
      <GestureDetector gesture={gesture}>
        <AnimatedSvg width={maxChartWidth} height={height}>
          <Mask id="mask">
            <AnimatedPath ref={pathRef} animatedProps={animatedPathProps} stroke="white" strokeWidth="2" strokeLinecap="round" />
          </Mask>
          <AnimatedRect mask="url(#mask)" fill={chartColor} x="0" y="0" width="100%" height="100%" fillOpacity={0.5} />
          <AnimatedRect mask="url(#mask)" fill={chartColor} animatedProps={selectionAreaProps} y="0" height="100%" />
          <AnimatedPath animatedProps={selectionHorizontal} stroke="#D4D4D4" strokeDasharray="4,4" />
          <AnimatedPath animatedProps={selectionVertical} stroke="#D4D4D4" strokeDasharray="4,4" />
          <AnimatedCircle animatedProps={animatedCircleProps} fill={chartColor} r="3" />
          <AnimatedCircle animatedProps={animatedCircleProps} fill={chartColor} fillOpacity="0.1" r="13" />
          <AnimatedCircle animatedProps={blinkingDotProps} fill={chartColor} r="3" />
          <AnimatedCircle animatedProps={blinkingDotAnimationProps} fill={chartColor} />
          <Labels ref={labelRef} points={points} width={chartWidth} />
        </AnimatedSvg>
      </GestureDetector>
    </View>
  );

} );

export default Chart;
