import { monthNames } from './constants';
import { MarkerColors } from './entities';

export const getTimeFromDate = (timeDate: Date) => {
  const hours = timeDate.getHours();
  const minutes = timeDate.getMinutes();
  return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

// prettier-ignore
export const formatDate = (date: Date) => `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

export const getMarkerColorLiteral = (
  markerColor: MarkerColors,
):
  | 'red'
  | 'black'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'green'
  | 'orange'
  | 'pink'
  | 'brown'
  | 'grey' => {
  switch (markerColor) {
    case MarkerColors.black:
      return 'black';
    case MarkerColors.blue:
      return 'blue';
    case MarkerColors.brown:
      return 'brown';
    case MarkerColors.green:
      return 'green';
    case MarkerColors.grey:
      return 'grey';
    case MarkerColors.orange:
      return 'orange';
    case MarkerColors.pink:
      return 'pink';
    case MarkerColors.purple:
      return 'purple';
    case MarkerColors.red:
      return 'red';
    case MarkerColors.yellow:
      return 'yellow';
    default:
      return 'black';
  }
};
