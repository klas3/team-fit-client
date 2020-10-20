export interface User {
  id: string;
  login: string;
  password: string;
  email: string;
  resetCode?: string;
  lastResetCodeCreationTime?: Date;
  currentLatitude?: number;
  currentLongitude?: number;
  markerColor: MarkerColors;
  partyId: string;
  // eslint-disable-next-line no-use-before-define
  party: Party;
  // eslint-disable-next-line no-use-before-define
  scores: Score[];
}

export interface Score {
  id: string;
  userId: string;
  user: User;
  date: Date;
  mileage: number;
}

export interface Party {
  id: string;
  startPointLatitude?: number;
  startPointLongitude?: number;
  endPointLatitude?: number;
  endPointLongitude?: number;
  // eslint-disable-next-line no-use-before-define
  waypoints?: Waypoint[];
  users: User[];
}

export interface Waypoint {
  id: string;
  partyId?: string;
  party?: Party;
  latitude: number;
  longitude: number;
}

export interface Friendship {
  id: string;
  isAccepted: boolean;
  initiator: User;
  receiver: User;
}

export interface PartyInvite {
  partyId: string;
  senderLogin: string;
}

export interface ServerResponse {
  data?: {};
  error?: string;
}

export interface GetResponse {
  data?: object;
}

export interface PostResponse {
  error?: string;
}

export enum MarkerColors {
  'red',
  'black',
  'blue',
  'yellow',
  'purple',
  'green',
  'orange',
  'pink',
  'brown',
  'grey',
}
