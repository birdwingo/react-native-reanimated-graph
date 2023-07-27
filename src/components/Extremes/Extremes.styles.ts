import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
  container: {
    position: 'absolute',
  },
  default: {
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2A2A2C',
  },
  text: {
    fontSize: 12,
  },
  iconBottom: {
    position: 'absolute',
    bottom: -4,
    transform: [ { rotate: '180deg' } ],
  },
  iconTop: {
    position: 'absolute',
    top: -4,
  },
} );
