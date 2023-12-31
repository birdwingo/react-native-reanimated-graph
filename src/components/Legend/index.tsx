import { Text } from 'react-native';
import React, {
  FC, useState, Fragment, memo, useCallback, useEffect,
} from 'react';
import { runOnJS, useAnimatedReaction, useAnimatedStyle } from 'react-native-reanimated';
import { LegendProps } from '../../core/dto/legendDTO';
import { calculateExtremeValues, compareObjects } from '../../core/helpers/worklets';
import LegendStyles from './Legend.styles';
import { AnimatedView } from '../Animated';

const Legend: FC<LegendProps> = ( {
  type, height, width, data, quantity, textStyle, renderFunction,
} ) => {

  const [ values, setValues ] = useState<number[]>( [] );

  const animatedStyle = useAnimatedStyle( () => ( type === 'x' ? { width: width.value } : { height } ) );

  const updateData = () => {

    'worklet';

    const newValues = calculateExtremeValues( data.value[type], quantity ).values.reverse();

    if ( compareObjects( newValues, values ) ) {

      return;

    }

    runOnJS( setValues )( newValues );

  };

  useAnimatedReaction(
    () => data.value,
    ( res, prev ) => res !== prev && updateData(),
    [ data.value ],
  );

  useEffect( () => updateData(), [] );

  const renderItem = useCallback( ( item: number, index: number ) => {

    const renderedItem = renderFunction ? renderFunction( item, index ) : item;

    if ( [ 'string', 'number' ].includes( typeof renderedItem ) ) {

      return <Text numberOfLines={1} adjustsFontSizeToFit style={textStyle}>{renderedItem}</Text>;

    }

    return renderedItem;

  }, [] );

  return (
    <AnimatedView style={[ LegendStyles[`${type}Container`], animatedStyle, values.length === 1 && LegendStyles.flexEnd ]} testID={`${type}Axis`}>
      {values?.map( ( item, index ) => (
        <Fragment key={item}>
          {renderItem( item, index )}
        </Fragment>
      ) )}
    </AnimatedView>
  );

};

export default memo( Legend );
