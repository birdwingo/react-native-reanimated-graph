import React, { FC, useState, useEffect } from 'react';
import { useAnimatedProps, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import { SelectionDotProps } from '../../core/dto/selectionAreaDTO';
import { AnimatedCircle } from '../Animated';
import { findNumbersAround, getValueFromPosition } from '../../core/helpers/worklets';

const SelectionDot: FC<SelectionDotProps> = ( {
  selection, opacity, color, sections, sectionsColors, data, width,
} ) => {

  const [ fill, setFill ] = useState( color );

  const animatedCircleProps = useAnimatedProps(
    () => ( { ...selection.value, opacity: opacity.value } ),
  );

  useEffect( () => {

    setFill( color );

  }, [ color ] );

  useAnimatedReaction(
    () => selection.value,
    ( res ) => {

      if ( !sectionsColors.value.length ) {

        if ( fill !== color ) {

          runOnJS( setFill )( color );

        }

        return;

      }

      const { value } = getValueFromPosition( res.cx, width.value, data.value.to.x );
      const [ end ] = findNumbersAround( value, sections.value );

      const index = sections.value.indexOf( end );
      const newFill = sectionsColors.value[index] ?? color;

      if ( fill !== newFill ) {

        runOnJS( setFill )( newFill );

      }

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
