import React, { FC, memo, useCallback } from 'react';
import { LayoutChangeEvent } from 'react-native';
import {
  useAnimatedProps, useAnimatedStyle, useDerivedValue, useSharedValue,
} from 'react-native-reanimated';
import { CircleProps } from 'react-native-svg';
import { PickComponentProps } from '../../core/dto/picksDTO';
import { AnimatedCircle, AnimatedView } from '../Animated';

const Pick: FC<PickComponentProps> = ( {
  x, color, renderLabel, data, points, selectedX, active,
} ) => {

  const layout = useSharedValue( { width: 0, height: 0 } );
  const index = useDerivedValue( () => data.value.to.x.indexOf( x ) );
  const position = useDerivedValue( () => ( points.value[index.value]
    ? { cx: String( points.value[index.value].x ), cy: String( points.value[index.value].y ) }
    : undefined
  ) );
  const isSelected = useDerivedValue(
    () => active.value && selectedX.value === Number( position.value?.cx ),
  );
  const labelLeft = useDerivedValue( () => ( index.value > data.value.to.x.length / 2
    ? Number( position.value?.cx ?? 0 ) - 15 - layout.value.width
    : Number( position.value?.cx ?? 0 ) + 15 ) );
  const labelTop = useDerivedValue(
    () => Number( position.value?.cy ?? 0 ) - layout.value.height / 2,
  );

  const labelStyle = useAnimatedStyle( () => ( {
    opacity: !isSelected.value || !position.value ? 0 : 1,
    position: 'absolute',
    top: labelTop.value,
    left: labelLeft.value,
  } ), [ isSelected.value, position.value ] );

  const smallPickProps = useAnimatedProps<CircleProps>( () => ( position.value
    ? { ...position.value, opacity: 1 }
    : { opacity: 0 }
  ), [ position.value ] );
  const selectedPickProps = useAnimatedProps<CircleProps>(
    () => ( { ...position.value, opacity: ( isSelected.value && position.value ) ? 1 : 0 } ),
    [ isSelected.value, position.value ],
  );

  const onLayout = useCallback( ( event: LayoutChangeEvent ) => {

    layout.value = event.nativeEvent.layout;

  }, [] );

  return (
    <>
      <AnimatedCircle animatedProps={smallPickProps} fill={color} r="4" strokeWidth="0.5" stroke="#000000" />
      <AnimatedCircle animatedProps={selectedPickProps} stroke={color} strokeWidth="2" fill="transparent" r="8" strokeDasharray="4" />
      {renderLabel && (
        <AnimatedView onLayout={onLayout} style={labelStyle}>{renderLabel()}</AnimatedView>
      )}
    </>
  );

};

export default memo( Pick );
