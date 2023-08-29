import React, { FC, memo, useState } from 'react';
import {
  cancelAnimation, interpolate, runOnJS, useAnimatedProps, useAnimatedReaction, useDerivedValue,
  useSharedValue, withDelay, withRepeat, withTiming,
} from 'react-native-reanimated';
import { BlinkingDotProps } from '../../core/dto/blinkingDotDTO';
import { ANIMATION_DURATION } from '../../core/constants/data';
import { AnimatedCircle } from '../Animated';
import { findNumbersAround } from '../../core/helpers/worklets';

const BlinkingDot: FC<BlinkingDotProps> = ( {
  show, color, points, sectionsColors, data, sections,
} ) => {

  const [ fill, setFill ] = useState( color );

  const animation = useSharedValue( 0 );

  const blinkingDot = useDerivedValue( () => {

    const { x: cx, y: cy } = points.value[points.value.length - 1];

    return {
      cx, cy, opacity: show.value ? 1 : 0,
    };

  } );

  const animatedProps = useAnimatedProps( () => ( blinkingDot.value ) );
  const animationProps = useAnimatedProps( () => ( show.value ? {
    ...blinkingDot.value,
    r: interpolate( animation.value, [ 0, 1 ], [ 3, 13 ] ),
    opacity: interpolate( animation.value, [ 0, 1 ], [ 1, 0.1 ] ),
  } : blinkingDot.value ) );

  const toggleAnimation = ( value = true ) => {

    'worklet';

    if ( value && show.value ) {

      animation.value = withRepeat( withDelay(
        2000,
        withTiming( 1, { duration: ANIMATION_DURATION } ),
      ), -1, false, () => {

        animation.value = 0;

      } );

    } else {

      cancelAnimation( animation );

    }

  };

  useAnimatedReaction(
    () => show.value,
    ( res, prev ) => res !== prev && toggleAnimation(),
    [ show.value ],
  );

  useAnimatedReaction(
    () => sectionsColors.value,
    ( res ) => {

      const [ end ] = findNumbersAround(
        data.value.to.x[data.value.to.x.length - 1],
        sections.value,
      );

      const index = sections.value.indexOf( end );
      const newFill = res[index] ?? color;

      if ( fill !== newFill ) {

        runOnJS( setFill )( newFill );

      }

    },
    [ sectionsColors.value, data.value ],
  );

  return (
    <>
      <AnimatedCircle animatedProps={animatedProps} fill={fill} r="3" testID="blinkingDot" />
      <AnimatedCircle animatedProps={animationProps} fill={fill} />
    </>
  );

};

export default memo( BlinkingDot );
