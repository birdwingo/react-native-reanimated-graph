import { View, Text } from 'react-native';
import React, {
  FC, useState, memo, useMemo,
} from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { ExtremeValuesProps, ExtremesProps } from '../../core/dto/extremesDTO';
import ExtremesStyles from './Extremes.styles';
import Icon from '../Icon';
import { calculatePoints, compareObjects } from '../../core/helpers/worklets';
import { EXTREME_COLOR, EXTREME_PADDING } from '../../core/constants/data';

const Extremes: FC<ExtremesProps> = ( {
  width, height, data, yAxisQuantity, textStyle, renderFunction,
} ) => {

  const [ values, setValues ] = useState<ExtremeValuesProps>( {
    max: { value: 0, pos: { x: 0, y: 0 }, reverse: false },
    min: { value: 0, pos: { x: 0, y: 0 }, reverse: false },
  } );

  const max = values?.max;
  const min = values?.min;

  const labelStyle = useMemo( () => ( {
    max: {
      bottom: height - max.pos.y + EXTREME_PADDING * 2,
      ...( max.reverse
        ? { right: width.value - max.pos.x - EXTREME_PADDING * 2 }
        : { left: max.pos.x - EXTREME_PADDING * 2 } ),
      opacity: max.value === min.value ? 0 : 1,
    },
    min: {
      top: min.pos.y + EXTREME_PADDING * 2,
      ...( min.reverse
        ? { right: width.value - min.pos.x - EXTREME_PADDING * 2 }
        : { left: min.pos.x - EXTREME_PADDING * 2 } ),
      opacity: max.value === min.value ? 0 : 1,
    },
  } ), [ values ] );

  const arrowStyle = useMemo( () => ( {
    max: max.reverse ? { right: EXTREME_PADDING } : { left: EXTREME_PADDING },
    min: min.reverse ? { right: EXTREME_PADDING } : { left: EXTREME_PADDING },
  } ), [ values ] );

  const findExtremes = () => {

    'worklet';

    const newMax = Math.max( ...data.value.to.y );
    const newMin = Math.min( ...data.value.to.y );

    const points = calculatePoints( data.value, 1, width.value, height, yAxisQuantity );

    const maxIndex = data.value.to.y.indexOf( newMax );
    const minIndex = data.value.to.y.indexOf( newMin );

    const newMaxPos = points[maxIndex];
    const newMinPos = points[minIndex];

    const newMaxPosReverse = width.value / 2 < newMaxPos.x;
    const newMinPosReverse = width.value / 2 < newMinPos.x;

    const newValues = {
      max: { value: newMax, pos: newMaxPos, reverse: newMaxPosReverse },
      min: { value: newMin, pos: newMinPos, reverse: newMinPosReverse },
    };

    if ( compareObjects( values, newValues ) ) {

      return;

    }

    runOnJS( setValues )( newValues );

  };

  useAnimatedReaction( () => data.value, () => findExtremes(), [ data.value, width.value ] );

  const roundedMax = useMemo( () => Math.round( max.value * 100 ) / 100, [ max.value ] );
  const roundedMin = useMemo( () => Math.round( min.value * 100 ) / 100, [ min.value ] );

  const renderedMin = useMemo( () => ( renderFunction ? renderFunction( roundedMin, 'min' ) : roundedMin ), [ roundedMin ] );
  const renderedMax = useMemo( () => ( renderFunction ? renderFunction( roundedMax, 'max' ) : roundedMax ), [ roundedMax ] );

  return (
    <View style={[ { height }, ExtremesStyles.container ]}>
      <View style={[ ExtremesStyles.extreme, labelStyle.max ]}>
        {![ 'string', 'number' ].includes( typeof renderedMax )
          ? renderedMax
          : <Text style={[ ExtremesStyles.text, textStyle ]}>{renderedMax}</Text>}
        <View style={[ arrowStyle.max, ExtremesStyles.iconBottom ]}>
          <Icon icon="arrow" fill={EXTREME_COLOR} />
        </View>
      </View>
      <View style={[ ExtremesStyles.extreme, labelStyle.min ]}>
        {![ 'string', 'number' ].includes( typeof renderedMin )
          ? renderedMin
          : <Text style={[ ExtremesStyles.text, textStyle ]}>{renderedMin}</Text>}
        <View style={[ arrowStyle.min, ExtremesStyles.iconTop ]}>
          <Icon icon="arrow" fill={EXTREME_COLOR} />
        </View>
      </View>
    </View>
  );

};

export default memo( Extremes );
