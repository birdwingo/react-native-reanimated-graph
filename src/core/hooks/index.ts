import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { useMemo } from 'react';
import { ReanimatedGraphProps } from '../dto/graphDTO';

interface GestureProps {
  onGestureStart?: ReanimatedGraphProps['onGestureStart'];
  onGestureEnd?: ReanimatedGraphProps['onGestureEnd'];
}

const useGesture = ( { onGestureStart, onGestureEnd }: GestureProps = {} ) => {

  const x = useSharedValue( 0 );
  const active = useSharedValue( false );

  // eslint-disable-next-line new-cap
  const gesture = useMemo( () => Gesture.Pan()
    .activeOffsetX( [ -10, 10 ] )
    .onStart( ( e ) => {

      active.value = true;
      x.value = e.x;

      if ( onGestureStart ) {

        runOnJS( onGestureStart )();

      }

    } )
    .onUpdate( ( e ) => {

      if ( active.value ) {

        x.value = e.x;

      }

    } )
    .onEnd( () => {

      active.value = false;

      if ( onGestureEnd ) {

        runOnJS( onGestureEnd )();

      }

    } ), [ active, x ] );

  return useMemo( () => ( { gesture, x, active } ), [ gesture, active, x ] );

};

export { useGesture };
