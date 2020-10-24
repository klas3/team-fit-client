import { AnimatedRegion } from 'react-native-maps';
// prettier-ignore
import {
  applicationEvents, defaultMapLocation, mapDeltas, markerMovingConfig,
} from '../other/constants';
import { MarkerColors } from '../other/entities';
import partyConnection from './partyConnection';
import userInfo from './userInfo';

class UsersMarkers {
  public usersRegions: AnimatedRegion[];

  constructor() {
    this.usersRegions = [];
    this.changeUserMarkerColor = this.changeUserMarkerColor.bind(this);
    applicationEvents.addListener('markerColorChanged', this.changeUserMarkerColor);
  }

  public resetPartyMembersMarkers(): void {
    if (!partyConnection.party || !partyConnection.party.users) {
      return;
    }
    const regions = partyConnection.party.users.map((user) => {
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
    if (!partyConnection.party || !partyConnection.party.users) {
      return;
    }
    const userIndex = partyConnection.party.users.findIndex((partyUser) => partyUser.id === userId);
    if (userIndex === -1) {
      return;
    }
    // prettier-ignore
    this.usersRegions[userIndex].timing({
      latitude, longitude, ...mapDeltas, ...markerMovingConfig,
    }).start();
  }

  // eslint-disable-next-line class-methods-use-this
  private changeUserMarkerColor(markerColor: MarkerColors): void {
    if (!partyConnection.party || !partyConnection.party.users) {
      return;
    }
    const user = partyConnection.party.users.find((partyUser) => partyUser.id === userInfo.id);
    if (!user) {
      return;
    }
    user.markerColor = markerColor;
    this.resetPartyMembersMarkers();
  }
}

const usersMarkers = new UsersMarkers();

export default usersMarkers;
