import React, { FC } from 'react';
import { useAnimatedProps, useAnimatedStyle, useDerivedValue } from 'react-native-reanimated';
import { CircleProps } from 'react-native-svg';
import { PickComponentProps } from '../../core/dto/picksDTO';
import { AnimatedCircle, AnimatedView } from '../Animated';

const Pick: FC<PickComponentProps> = ( {
  x, color, renderLabel, data, points, selectedX,
} ) => {

  const index = useDerivedValue( () => data.value.to.x.indexOf( x ) );
  const position = useDerivedValue( () => ( points.value[index.value]
    ? { cx: String( points.value[index.value].x ), cy: String( points.value[index.value].y ) }
    : undefined
  ) );
  const isSelected = useDerivedValue( () => selectedX.value === Number( position.value?.cx ) );

  const labelStyle = useAnimatedStyle( () => ( ( !isSelected.value || !position.value )
    ? { display: 'none' }
    : {
      position: 'absolute',
      top: Number( position.value.cy ) - 20,
      left: Number( position.value.cx ) - 20,
    } ) );

  const smallPickProps = useAnimatedProps<CircleProps>( () => ( position.value
    ? { ...position.value }
    : { opacity: 0 }
  ) );
  const selectedPickProps = useAnimatedProps<CircleProps>(
    () => ( { ...position.value, opacity: ( isSelected && position.value ) ? 1 : 0 } ),
  );

  return (
    <>
      <AnimatedCircle animatedProps={smallPickProps} fill={color} r="3" />
      <AnimatedCircle animatedProps={selectedPickProps} stroke={color} strokeWidth="2" fill="transparent" r="8" />
      {renderLabel && <AnimatedView style={labelStyle}>{renderLabel()}</AnimatedView>}
    </>
  );

};

export default Pick;
