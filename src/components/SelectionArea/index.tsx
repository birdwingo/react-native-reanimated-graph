import React, { FC, memo, useCallback } from 'react';
import {
  runOnJS, useAnimatedProps, useAnimatedReaction, useDerivedValue, useSharedValue,
} from 'react-native-reanimated';
import { SelectionAreaProps } from '../../core/dto/selectionAreaDTO';
import { AnimatedCircle, AnimatedPath, AnimatedRect } from '../Animated';
import { findPointOnPath } from '../../core/helpers';
import { MASK_ID } from '../../core/constants/data';
import { findNumbersAround } from '../../core/helpers/worklets';

const SelectionArea: FC<SelectionAreaProps> = ( {
  width,
  height,
  x,
  active,
  selectionArea,
  selectionAreaData,
  showSelectionDot,
  selectionDotRadius,
  selectionDotExpansion,
  selectionLines,
  selectionLineColor,
  color,
  pathRef,
  points,
  data,
  gestureEnabled,
} ) => {

  const selection = useSharedValue( { cx: '0', cy: '0', opacity: active.value ? 1 : 0 } );

  const opacity = useDerivedValue( () => ( active.value ? selection.value.opacity : 0 ) );

  const selectionAreaProps = useAnimatedProps( () => {

    if ( !opacity.value || selectionArea.value === 'none' ) {

      return { x: '0', width: String( width.value ) };

    }

    if ( selectionArea.value === 'custom' ) {

      if ( !selectionAreaData.value?.length ) {

        return { x: '0', width: String( width.value ) };

      }

      const { length } = data.value.to.x;
      const step = width.value / ( length - 1 );
      const index = Number( selection.value.cx ) / step;
      const normalizedIndex = Math.max( 0, Math.min( length - 1, Math.round( index ) ) );
      const value = data.value.to.x[normalizedIndex];

      const [ startIndex, endIndex ] = findNumbersAround( value, selectionAreaData.value );

      const start = points.value[data.value.to.x.indexOf( startIndex )]?.x ?? 0;
      const end = points.value[data.value.to.x.indexOf( endIndex )]?.x ?? width.value;

      return { x: String( start ), width: String( end - start ) };

    }

    return { x: '0', width: selection.value.cx };

  } );
  const selectionHorizontal = useAnimatedProps( () => ( { opacity: opacity.value, d: `M0 ${selection.value.cy}L${width.value} ${selection.value.cy}` } ) );
  const selectionVertical = useAnimatedProps( () => ( { opacity: opacity.value, d: `M${selection.value.cx} 0L${selection.value.cx} ${height}` } ) );
  const animatedCircleProps = useAnimatedProps(
    () => ( { ...selection.value, opacity: opacity.value } ),
  );

  const updateSelection = useCallback( () => {

    if ( !active.value ) {

      selection.value = { cx: '0', cy: '0', opacity: 0 };

    } else if ( points.value.length === 1 ) {

      selection.value = {
        cx: String( points.value[0].x ),
        cy: String( points.value[0].y ),
        opacity: 1,
      };

    } else {

      const { x: cx, y: cy } = findPointOnPath( pathRef, x.value );

      selection.value = { cx: String( cx || 0 ), cy: String( cy || 0 ), opacity: 1 };

    }

  }, [] );

  useAnimatedReaction(
    () => x.value,
    ( res, prev ) => res !== prev && runOnJS( updateSelection )(),
    [ x.value ],
  );

  useAnimatedReaction(
    () => active.value,
    ( res, prev ) => res !== prev && runOnJS( updateSelection )(),
    [ active.value ],
  );

  const showVertical = selectionLines === 'both' || selectionLines === 'vertical';
  const showHorizontal = selectionLines === 'both' || selectionLines === 'horizontal';

  if ( !gestureEnabled ) {

    return <AnimatedRect mask={`url(#${MASK_ID})`} fill={color} x="0" y="0" width="100%" height="100%" />;

  }

  return (
    <>
      <AnimatedRect mask={`url(#${MASK_ID})`} testID="graphPath" fill={color} x="0" y="0" width="100%" height="100%" fillOpacity={0.5} />
      <AnimatedRect mask={`url(#${MASK_ID})`} animatedProps={selectionAreaProps} fill={color} y="0" height="100%" testID="selectionArea" />
      {showHorizontal && <AnimatedPath animatedProps={selectionHorizontal} stroke={selectionLineColor} strokeDasharray="4,4" />}
      {showVertical && <AnimatedPath animatedProps={selectionVertical} stroke={selectionLineColor} strokeDasharray="4,4" />}
      {showSelectionDot && (
        <>
          <AnimatedCircle animatedProps={animatedCircleProps} fill={color} r={selectionDotRadius} />
          <AnimatedCircle animatedProps={animatedCircleProps} fill={color} fillOpacity="0.1" r={selectionDotRadius + selectionDotExpansion} />
        </>
      )}
    </>
  );

};

export default memo( SelectionArea );
