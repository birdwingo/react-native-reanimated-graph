import React, { FC } from 'react';
import { useAnimatedProps, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { View } from 'react-native';
import { PickComponentProps } from '../../core/dto/picksDTO';
import { AnimatedCircle } from '../Animated';

const Pick: FC<PickComponentProps> = ( {
  xValue, color, renderLabel, data, points, selectedX,
} ) => {

  const isSelected = useDerivedValue( () => selectedX.value === xValue );
  const index = useDerivedValue( () => data.value.to.x.indexOf( xValue ) );
  const position = useDerivedValue( () => points.value[index.value] );

  const labelStyle = useAnimatedStyle( () => ( isSelected.value
    ? { display: 'none' }
    : {
      position: 'absolute',
      top: position.value.y - 20,
      left: position.value.x - 20,
    } ) );
  const smallPickProps = useAnimatedProps( () => ( { ...position.value } ) );
  const selectedPickProps = useAnimatedProps(
    () => ( { ...position.value, opacity: isSelected ? 1 : 0 } ),
  );

  return (
    <>
      <AnimatedCircle animatedProps={smallPickProps} fill={color} r="3" />
      <AnimatedCircle animatedProps={selectedPickProps} stroke={color} strokeWidth="1" fill="transparent" r="12" />
      {renderLabel && <View style={labelStyle}>{renderLabel()}</View>}
    </>
  );

};

export default Pick;
