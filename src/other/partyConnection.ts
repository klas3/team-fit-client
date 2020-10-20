import { NativeEventEmitter } from 'react-native';
import SocketIOClient from 'socket.io-client';
import { getParty } from './api';
import { serverUrl } from './constants';
import { Party, PartyInvite, User } from './entities';
import userInfo from './userInfo';

export const eventEmitter = new NativeEventEmitter();

class PartyConnection {
  public party!: Party;

  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = SocketIOClient(serverUrl);
    this.socket.on('newInvite', this.onNewInvite);
    this.socket.on('userJoin', this.onUserJoin);
    this.socket.on('userLeave', this.onUserLeave);
    this.socket.on('routeChanged', this.onRouteChanged);
    this.socket.on('userPositionChanged', this.onUserPositionChanged);
  }

  public sendInvite(receiverId: string, partyId: string, senderLogin: string): void {
    this.socket.emit('sendInvite', { receiverId, partyId, senderLogin });
  }

  public async loadParty(): Promise<void> {
    const party = await getParty();
    if (!party) {
      return;
    }
    this.party = party;
    this.emitPartyChanges();
  }

  public registerConnection(): void {
    const userId = userInfo.id;
    this.socket.emit('addClient', userId);
  }

  // eslint-disable-next-line class-methods-use-this
  private onNewInvite(invite: PartyInvite): void {
    eventEmitter.emit('newInvite', invite);
  }

  private emitPartyChanges(): void {
    eventEmitter.emit('partyChanged', this.party);
  }

  private onUserJoin(newUser: User): void {
    if (userInfo.id === newUser.id) {
      return;
    }
    this.party.users.push(newUser);
    this.emitPartyChanges();
  }

  private onUserLeave(leavedUserId: string): void {
    if (userInfo.id === leavedUserId) {
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
    const foundUser = this.party.users.find((user) => user.id === id);
    if (!foundUser) {
      return;
    }
    foundUser.currentLatitude = currentLatitude;
    foundUser.currentLongitude = currentLongitude;
    this.emitPartyChanges();
  }

  private onRouteChanged(party: Party): void {
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
