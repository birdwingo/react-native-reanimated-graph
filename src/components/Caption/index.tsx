import React, { FC, useState } from 'react';
import { View, Text } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { ChartCaptionProps } from '~/core/dto/graphDTO';
import CaptionStyles from './Caption.styles';

const CaptionText: FC<ChartCaptionProps> = ( { height = 175, extremeValues, period } ) => {

  const [ data, setData ] = useState<number[]>( [] );

  const calculateCaption = () => {

    const [ max, min ] = extremeValues.value;
    const diff = ( max - min ) / 3;

    if ( period.value === '1D' ) {

      setData( [
        Math.round( max * 10 ) / 10,
        Math.round( ( max - diff ) * 10 ) / 10,
        Math.round( ( min + diff ) * 10 ) / 10,
        Math.round( min * 10 ) / 10,
      ] );

    } else {

      setData( max !== min ? [ max, max - diff, min + diff, min ] : [] );

    }

  };

  useAnimatedReaction(
    () => extremeValues.value,
    ( res, prev ) => JSON.stringify( res ) !== JSON.stringify( prev )
    && runOnJS( calculateCaption )(),
    [ extremeValues.value ],
  );

  const formatNumber = ( value: number ) => {

    const number = value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );

    if ( value >= 1000 && value < 1000000 && value === Math.round( value ) ) {

      return number.replace( ',000', 'K' );

    }

    if ( value >= 1000000 && value === Math.round( value ) ) {

      return number.replace( ',000,000', 'M' );

    }

    return number;

  };

  return (
    <View style={[ CaptionStyles.container, { height } ]}>
      {data?.map( ( item, index ) => (
        <Text numberOfLines={1} key={`caption${index.toString()}`} adjustsFontSizeToFit>
          {formatNumber( item )}
        </Text>
      ) )}
    </View>
  );

};

export default CaptionText;
