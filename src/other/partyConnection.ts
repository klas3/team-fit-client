import { AnimatedRegion } from 'react-native-maps';
import SocketIOClient from 'socket.io-client';
import { getParty } from './api';
// prettier-ignore
import {
  applicationEvents, defaultMapLocation, mapDeltas, markerMovingConfig, serverUrl,
} from './constants';
// prettier-ignore
import {
  MarkerColors, Party, PartyInvite, User,
} from './entities';
import userInfo from './userInfo';

class PartyConnection {
  public party!: Party;

  public inviteId!: string;

  public usersRegions!: AnimatedRegion[];

  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = SocketIOClient(serverUrl);
    this.onUserJoin = this.onUserJoin.bind(this);
    this.onUserLeave = this.onUserLeave.bind(this);
    this.onNewInvite = this.onNewInvite.bind(this);
    this.onRouteChanged = this.onRouteChanged.bind(this);
    this.onUserPositionChanged = this.onUserPositionChanged.bind(this);
    this.changeUserMarkerColor = this.changeUserMarkerColor.bind(this);
    this.usersRegions = [];
    this.socket.on('newInvite', this.onNewInvite);
    this.socket.on('userJoin', this.onUserJoin);
    this.socket.on('userLeave', this.onUserLeave);
    this.socket.on('routeChanged', this.onRouteChanged);
    this.socket.on('userPositionChanged', this.onUserPositionChanged);
    applicationEvents.addListener('markerColorChanged', this.changeUserMarkerColor);
  }

  public sendInvite(receiverId: string, senderLogin: string): void {
    if (!this.party) {
      return;
    }
    const partyId = this.party.id;
    this.socket.emit('sendInvite', { receiverId, partyId, senderLogin });
  }

  public async loadParty(): Promise<void> {
    const party = await getParty();
    if (!party) {
      return;
    }
    userInfo.partyId = party.id;
    this.party = party;
    this.emitPartyChanges();
  }

  public registerConnection(): void {
    const { partyId } = userInfo;
    const userId = userInfo.id;
    this.socket.emit('addClient', { userId, partyId });
  }

  public emitUserLocationChanges(currentLatitude: number, currentLongitude: number): void {
    this.socket.emit('changeCurrentPosition', {
      partyId: this.party.id,
      clientUser: { id: userInfo.id, currentLatitude, currentLongitude },
    });
  }

  public resetPartyMembersMarkers(): void {
    if (!this.party || !this.party.users) {
      return;
    }
    const regions = this.party.users.map((user) => {
      const region = new AnimatedRegion({ ...defaultMapLocation, ...mapDeltas });
      // prettier-ignore
      region.timing({
        latitude: user.currentLatitude,
        longitude: user.currentLongitude,
        useNativeDriver: false,
        ...mapDeltas,
      }).start();
      return region;
    });
    this.usersRegions = regions;
  }

  public moveUserMarker(userId: string, latitude: number, longitude: number) {
    if (!this.party || !this.party.users) {
      return;
    }
    const userIndex = this.party.users.findIndex((partyUser) => partyUser.id === userId);
    if (userIndex === -1) {
      return;
    }
    // prettier-ignore
    this.usersRegions[userIndex].timing({
      latitude, longitude, ...mapDeltas, ...markerMovingConfig,
    }).start();
  }

  private changeUserMarkerColor(markerColor: MarkerColors): void {
    if (!this.party || !this.party.users) {
      return;
    }
    const user = this.party.users.find((partyUser) => partyUser.id === userInfo.id);
    if (!user) {
      return;
    }
    user.markerColor = markerColor;
    this.emitPartyChanges();
  }

  // eslint-disable-next-line class-methods-use-this
  private onNewInvite(invite: PartyInvite): void {
    this.inviteId = invite.partyId;
    applicationEvents.emit('newInvite', invite);
  }

  private emitPartyChanges(): void {
    applicationEvents.emit('partyChanged', this.party);
  }

  private onUserJoin(newUser: User): void {
    if (!this.party || !this.party.users || userInfo.id === newUser.id) {
      return;
    }
    this.party.users.push(newUser);
    this.emitPartyChanges();
  }

  private onUserLeave(leavedUserId: string): void {
    if (!this.party || !this.party.users || userInfo.id === leavedUserId) {
      return;
    }
    const index = this.party.users.findIndex((user) => leavedUserId === user.id);
    if (index === -1) {
      return;
    }
    this.party.users.splice(index, 1);
    this.emitPartyChanges();
  }

  private onUserPositionChanged(userWithNewPosition: User): void {
    const { id, currentLatitude, currentLongitude } = userWithNewPosition;
    if (
      !this.party
      || !this.party.users
      || userInfo.id === id
      || !currentLatitude
      || !currentLongitude
    ) {
      return;
    }
    const foundUser = this.party.users.find((user) => user.id === id);
    if (!foundUser) {
      return;
    }
    foundUser.currentLatitude = currentLatitude;
    foundUser.currentLongitude = currentLongitude;
    this.moveUserMarker(id, currentLatitude, currentLongitude);
  }

  private onRouteChanged(party: Party): void {
    if (!this.party) {
      return;
    }
    const {
      startPointLatitude,
      startPointLongitude,
      endPointLatitude,
      endPointLongitude,
      waypoints,
    } = party;
    this.party.startPointLatitude = startPointLatitude;
    this.party.startPointLongitude = startPointLongitude;
    this.party.endPointLatitude = endPointLatitude;
    this.party.endPointLongitude = endPointLongitude;
    this.party.waypoints = waypoints;
    this.emitPartyChanges();
  }
}

const partyConnection = new PartyConnection();

export default partyConnection;
