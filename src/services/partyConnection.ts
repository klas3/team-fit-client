import SocketIOClient from 'socket.io-client';
import { getParty } from '../other/api';
import { applicationEvents, serverUrl } from '../other/constants';
import { Party, PartyInvite, User } from '../other/entities';
import userInfo from './userInfo';
import usersRegions from './usersMarkers';

class PartyConnection {
  public party!: Party;

  public inviteId!: string;

  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = SocketIOClient(serverUrl);
    this.onUserJoin = this.onUserJoin.bind(this);
    this.onUserLeave = this.onUserLeave.bind(this);
    this.onNewInvite = this.onNewInvite.bind(this);
    this.onRouteChanged = this.onRouteChanged.bind(this);
    this.onUserPositionChanged = this.onUserPositionChanged.bind(this);
    this.socket.on('newInvite', this.onNewInvite);
    this.socket.on('userJoin', this.onUserJoin);
    this.socket.on('userLeave', this.onUserLeave);
    this.socket.on('routeChanged', this.onRouteChanged);
    this.socket.on('userPositionChanged', this.onUserPositionChanged);
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

  // eslint-disable-next-line class-methods-use-this
  private onNewInvite(invite: PartyInvite): void {
    this.inviteId = invite.partyId;
    applicationEvents.emit('newInvite', invite.senderLogin);
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
    usersRegions.moveUserMarker(id, currentLatitude, currentLongitude);
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
