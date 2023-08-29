import React, { FC, useState, useEffect } from 'react';
import { useAnimatedProps, useAnimatedReaction } from 'react-native-reanimated';
import { SelectionDotProps } from '~/core/dto/selectionAreaDTO';
import { AnimatedCircle } from '../Animated';
import { findNumbersAround } from '~/core/helpers/worklets';

const SelectionDot: FC<SelectionDotProps> = ( {
  selection, opacity, color, sections, sectionsColors,
} ) => {

  const [ fill, setFill ] = useState( color );

  const animatedCircleProps = useAnimatedProps(
    () => ( { ...selection.value, opacity: sections.value.length ? 0 : opacity.value } ),
  );

  useEffect( () => {

    setFill( color );

  }, [ color ] );

  useAnimatedReaction(
    () => selection.value,
    ( res ) => {

      if ( !sectionsColors.value.length ) {

        return;

      }

      const [ start, end ] = findNumbersAround( res.cx, sections.value );

      const index = sections.value.findIndex( ( item ) => item <= end && item >= start );

      setFill( sectionsColors.value[index] ?? color );

    },
    [ selection.value ],
  );

  return (
    <>
      <AnimatedCircle animatedProps={animatedCircleProps} fill={fill} r="3" />
      <AnimatedCircle animatedProps={animatedCircleProps} fill={fill} fillOpacity="0.1" r="12" />
    </>
  );

};

export default SelectionDot;
