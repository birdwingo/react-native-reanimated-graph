import { View, Text, LayoutChangeEvent } from 'react-native';
import React, {
  FC, useState, memo, useMemo,
} from 'react';
import {
  runOnJS, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue,
} from 'react-native-reanimated';
import { ExtremesProps } from '../../core/dto/extremesDTO';
import { AnimatedView } from '../Animated';
import ExtremesStyles from './Extremes.styles';
import Icon from '../Icon';

const Extremes: FC<ExtremesProps> = ( {
  width, points, data, textStyle, renderFunction,
} ) => {

  const [ values, setValues ] = useState( { max: 0, min: 0 } );
  const { max, min } = values;

  const maxLayout = useSharedValue( { width: 0, height: 0 } );
  const minLayout = useSharedValue( { width: 0, height: 0 } );

  const maxPos = useDerivedValue( () => points.value[data.value.to.y.indexOf( max ) ?? 0] );
  const minPos = useDerivedValue( () => points.value[data.value.to.y.indexOf( min ) ?? 0] );
  const maxPosReverse = useDerivedValue( () => ( width.value / 2 < maxPos.value?.x ) );
  const minPosReverse = useDerivedValue( () => ( width.value / 2 < minPos.value?.x ) );

  const labelMax = useAnimatedStyle( () => ( {
    top: ( maxPos.value?.y ?? 0 ) - maxLayout.value.height - 6,
    left: ( maxPos.value?.x ?? 0 ) - ( maxPosReverse.value ? maxLayout.value.width - 8 : 8 ),
  } ) );
  const labelMin = useAnimatedStyle( () => ( {
    top: ( minPos.value?.y ?? 0 ) + 6,
    left: ( minPos.value?.x ?? 0 ) - ( minPosReverse.value ? minLayout.value.width - 8 : 8 ),
  } ) );
  const arrowMax = useAnimatedStyle(
    () => ( { left: maxPosReverse.value ? maxLayout.value.width - 13 : 4 } ),
  );
  const arrowMin = useAnimatedStyle(
    () => ( { left: minPosReverse.value ? minLayout.value.width - 13 : 4 } ),
  );

  const findExtremes = () => {

    'worklet';

    const newMax = Math.max( ...data.value.to.y );
    const newMin = Math.min( ...data.value.to.y );

    runOnJS( setValues )( { max: newMax, min: newMin } );

  };

  useAnimatedReaction( () => data.value, () => findExtremes(), [ data.value ] );

  const roundedMax = Math.round( values.max * 100 ) / 100;
  const roundedMin = Math.round( values.min * 100 ) / 100;

  const renderedMin = useMemo( () => ( renderFunction ? renderFunction( roundedMin, 'min' ) : roundedMin ), [ roundedMin ] );
  const renderedMax = useMemo( () => ( renderFunction ? renderFunction( roundedMax, 'max' ) : roundedMax ), [ roundedMax ] );

  if ( roundedMax === roundedMin ) {

    return null;

  }

  return (
    <View>
      <AnimatedView
        style={[ ExtremesStyles.container, labelMax, ExtremesStyles.default ]}
        onLayout={( e: LayoutChangeEvent ) => {

          maxLayout.value = e.nativeEvent.layout;

        }}
      >
        {![ 'string', 'number' ].includes( typeof renderedMax )
          ? renderedMax
          : <Text style={[ ExtremesStyles.text, textStyle ]}>{renderedMax}</Text>}
        <AnimatedView style={[ arrowMax, ExtremesStyles.iconBottom ]}>
          <Icon icon="arrow" fill="#2A2A2C" />
        </AnimatedView>
      </AnimatedView>
      <AnimatedView
        style={[ ExtremesStyles.container, labelMin, ExtremesStyles.default ]}
        onLayout={( e: LayoutChangeEvent ) => {

          minLayout.value = e.nativeEvent.layout;

        }}
      >
        {![ 'string', 'number' ].includes( typeof renderedMin )
          ? renderedMin
          : <Text style={[ ExtremesStyles.text, textStyle ]}>{renderedMin}</Text>}
        <AnimatedView style={[ arrowMin, ExtremesStyles.iconTop ]}>
          <Icon icon="arrow" fill="#2A2A2C" />
        </AnimatedView>
      </AnimatedView>
    </View>
  );

};

export default memo( Extremes );
