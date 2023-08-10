import { StyleSheet } from 'react-native';

export default StyleSheet.create( {
  yContainer: {
    justifyContent: 'space-between',
    maxWidth: 50,
  },
  xContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 50,
    alignSelf: 'flex-end',
  },
  flexEnd: {
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
} );
