import { SvgProps } from 'react-native-svg';
import icons from '../constants/icons';

export interface IconProps extends SvgProps {
  icon: keyof typeof icons;
}
