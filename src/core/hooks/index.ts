import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { useMemo } from 'react';

const useGesture = () => {

  const x = useSharedValue( 0 );
  const active = useSharedValue( false );

  // eslint-disable-next-line new-cap
  const gesture = useMemo( () => Gesture.Pan()
    .activeOffsetX( [ -10, 10 ] )
    .onStart( ( e ) => {

      active.value = true;
      x.value = e.x;

    } )
    .onUpdate( ( e ) => {

      x.value = e.x;

    } )
    .onEnd( () => {

      active.value = false;

    } ), [ active, x ] );

  return useMemo( () => ( { gesture, x, active } ), [ gesture, active, x ] );

};

export { useGesture };
