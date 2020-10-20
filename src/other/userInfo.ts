import { getFriendships, getUserInfo } from './api';
import { Friendship, MarkerColors } from './entities';

class UserInfo {
  public id!: string;

  public login!: string;

  public email!: string;

  public markerColor!: MarkerColors;

  public friendships!: Friendship[];

  public async realoadInfo(): Promise<void> {
    const info = await getUserInfo();
    if (!info) {
      return;
    }
    // prettier-ignore
    const {
      id, login, email, markerColor,
    } = info;
    this.id = id;
    this.login = login;
    this.email = email;
    this.markerColor = markerColor;
  }

  public async reloadFriendships(): Promise<void> {
    const loadedFriendships = await getFriendships();
    if (!loadedFriendships) {
      return;
    }
    this.friendships = loadedFriendships;
  }
}

const userInfo = new UserInfo();

export default userInfo;
