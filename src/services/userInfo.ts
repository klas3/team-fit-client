import { getFriendships, getUserInfo, setMarkerColor } from '../other/api';
import { applicationEvents } from '../other/constants';
import { Friendship, MarkerColors } from '../other/entities';

class UserInfo {
  public id!: string;

  public login!: string;

  public email!: string;

  public markerColor!: MarkerColors;

  public friendships!: Friendship[];

  public partyId!: string;

  public async realoadInfo(): Promise<void> {
    const info = await getUserInfo();
    if (!info) {
      return;
    }
    // prettier-ignore
    const {
      id, login, email, markerColor, partyId,
    } = info;
    this.id = id;
    this.login = login;
    this.email = email;
    this.markerColor = markerColor;
    this.partyId = partyId;
    this.emitMarkerColorChanges();
  }

  public async reloadFriendships(): Promise<void> {
    const loadedFriendships = await getFriendships();
    if (!loadedFriendships) {
      return;
    }
    this.friendships = loadedFriendships;
  }

  public async changeMarkerColor(markerColor: MarkerColors): Promise<void> {
    const response = await setMarkerColor(markerColor);
    if (response.error) {
      return;
    }
    this.markerColor = markerColor;
    this.emitMarkerColorChanges();
  }

  private emitMarkerColorChanges(): void {
    applicationEvents.emit('markerColorChanged', this.markerColor);
  }
}

const userInfo = new UserInfo();

export default userInfo;
