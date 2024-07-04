import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, runOnJS, useSharedValue } from 'react-native-reanimated';
import { useMemo } from 'react';
import { ReanimatedGraphProps } from '../dto/graphDTO';
import { findClosestPoint } from '../helpers/worklets';

interface GestureProps {
  onGestureStart?: ReanimatedGraphProps['onGestureStart'];
  onGestureEnd?: ReanimatedGraphProps['onGestureEnd'];
}

const useGesture = (
  { onGestureStart, onGestureEnd }: GestureProps,
  points: SharedValue<{ x: number, y: number }[]>,
  smoothAnimation: boolean,
) => {

  const x = useSharedValue( 0 );
  const active = useSharedValue( false );

  // eslint-disable-next-line new-cap
  const gesture = useMemo( () => Gesture.Pan()
    .activeOffsetX( [ -10, 10 ] )
    .onStart( ( e ) => {

      active.value = true;
      const firstPoint = points.value[0];
      const lastPoint = points.value[points.value.length - 1];

      if ( smoothAnimation ) {

        x.value = findClosestPoint( points.value, e.x ).x;

      } else {

        x.value = Math.min( lastPoint.x, Math.max( firstPoint.x, e.x ) );

      }

      if ( onGestureStart ) {

        runOnJS( onGestureStart )();

      }

    } )
    .onUpdate( ( e ) => {

      if ( active.value ) {

        const firstPoint = points.value[0];
        const lastPoint = points.value[points.value.length - 1];

        if ( smoothAnimation ) {

          x.value = findClosestPoint( points.value, e.x ).x;

        } else {

          x.value = Math.min( lastPoint.x, Math.max( firstPoint.x, e.x ) );

        }

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
