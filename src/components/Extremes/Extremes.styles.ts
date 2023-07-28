import { StyleSheet } from 'react-native';
import { EXTREME_COLOR, EXTREME_PADDING } from '../../core/constants/data';

export default StyleSheet.create( {
  container: {
    flex: 1,
    width: '100%',
  },
  extreme: {
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
    padding: EXTREME_PADDING,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EXTREME_COLOR,
    position: 'absolute',
  },
  text: {
    fontSize: 12,
  },
  iconBottom: {
    position: 'absolute',
    bottom: -EXTREME_PADDING,
    transform: [ { rotate: '180deg' } ],
  },
  iconTop: {
    position: 'absolute',
    top: -EXTREME_PADDING,
  },
} );
