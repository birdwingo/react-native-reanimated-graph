import React, { forwardRef, useImperativeHandle, useState } from 'react';
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { ChartLabelProps, ChartLabelPublicMethods, LabelsData } from '~/core/dto/graphDTO';
import LabelStyles from './Labels.styles';

const AnimatedView = Animated.createAnimatedComponent( View );

const Labels = forwardRef<ChartLabelPublicMethods, ChartLabelProps>( ( { width, points }, ref ) => {

  const [ data, setData ] = useState<LabelsData>();

  const labelMaxWidth = useSharedValue( 0 );
  const labelMinWidth = useSharedValue( 0 );

  const labels = useDerivedValue( () => ( {
    max: points.value[data?.max.index || 0], min: points.value[data?.min.index || 0],
  } ) );
  const labelMaxPosReverse = useDerivedValue( () => ( width.value / 2 < labels.value.max?.x ) );
  const labelMinPosReverse = useDerivedValue( () => ( width.value / 2 < labels.value.min?.x ) );

  const labelMax = useAnimatedStyle( () => ( {
    top: ( labels.value.max?.y ?? 0 ) - 31,
    left: ( labels.value.max?.x ?? 0 ) - ( labelMaxPosReverse.value ? labelMaxWidth.value - 8 : 8 ),
  } ) );
  const labelMin = useAnimatedStyle( () => ( {
    top: ( labels.value.min?.y ?? 0 ) + 6,
    left: ( labels.value.min?.x ?? 0 ) - ( labelMinPosReverse.value ? labelMinWidth.value - 8 : 8 ),
  } ) );

  useImperativeHandle( ref, () => ( { setData } ) );

  if ( !data || data?.max.value === data?.min.value ) {

    return null;

  }

  return (
    <View>
      <AnimatedView
        style={[ LabelStyles.container, labelMax ]}
        onLayout={( e: LayoutChangeEvent ) => {

          labelMaxWidth.value = e.nativeEvent.layout.width;

        }}
      >
        <Text>{data.max.value}</Text>
      </AnimatedView>
      <AnimatedView
        style={[ LabelStyles.container, labelMin ]}
        onLayout={( e: LayoutChangeEvent ) => {

          labelMinWidth.value = e.nativeEvent.layout.width;

        }}
      >
        <Text>{data.min.value}</Text>
      </AnimatedView>
    </View>
  );

} );

export default Labels;
