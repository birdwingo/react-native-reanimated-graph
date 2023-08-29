import { SharedValue } from 'react-native-reanimated';
import { DataProps } from './graphDTO';

export interface SectionItemProps {
  color: string;
  index: number;
  sections: SharedValue<number[]>;
  data: SharedValue<DataProps>;
  points: SharedValue<{ x: number, y: number }[]>;
}

export interface GraphSectionsProps {
  sections: SharedValue<number[]>;
  sectionsColors: SharedValue<string[]>;
  data: SharedValue<DataProps>;
  points: SharedValue<{ x: number, y: number }[]>;
}
