// eslint-disable-next-line no-unused-vars
import axiosClient, { AxiosInstance } from 'axios';
import { AsyncStorage } from 'react-native';
import { LatLng } from 'react-native-maps';
import { jwtStorageKeyName, serverUrl } from './constants';
// prettier-ignore
import {
  GetResponse, PostResponse, ServerResponse, User, Score, Friendship, Party, MarkerColors,
} from './entities';

let axios: AxiosInstance;

export async function updateAxiosClient(): Promise<void> {
  axios = axiosClient.create({
    timeout: 20 * 1000,
    baseURL: serverUrl,
    headers: { Authorization: `Bearer ${await AsyncStorage.getItem(jwtStorageKeyName)}` },
  });
}

async function makeRequest(
  method: 'GET' | 'POST',
  endpoint: string,
  data?: object,
): Promise<ServerResponse> {
  try {
    const responseData = (await axios.request({ method, url: endpoint, data })).data;
    return { data: responseData };
  } catch (error) {
    const errorMessage = error.response.data.message || error.response.data;
    return { error: errorMessage };
  }
}

async function getRequest(endpoint: string): Promise<GetResponse> {
  return makeRequest('GET', endpoint);
}

async function postRequest(endpoint: string, data: object): Promise<PostResponse> {
  return makeRequest('POST', endpoint, data);
}

export async function logout(): Promise<void> {
  await AsyncStorage.setItem(jwtStorageKeyName, '');
  await updateAxiosClient();
}

export async function loginToAccount(login: string, password: string): Promise<PostResponse> {
  const response = await makeRequest('POST', '/auth/login', { login, password });
  if (!response.error) {
    const { authToken } = response.data as { authToken: string };
    await AsyncStorage.setItem(jwtStorageKeyName, authToken);
    await updateAxiosClient();
  }
  return response;
}

export async function register(
  login: string,
  password: string,
  email: string,
): Promise<PostResponse> {
  return postRequest('/auth/register', { login, password, email });
}

export async function getUserInfo(): Promise<User | undefined> {
  const response = await getRequest('/user/info');
  if (!response.data) {
    return undefined;
  }
  return response.data as User;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<PostResponse> {
  return postRequest('/auth/changePassword', { oldPassword, newPassword });
}

export async function getScores(): Promise<Score[] | undefined> {
  const response = await getRequest('/user/getScores');
  if (!response.data) {
    return undefined;
  }
  return response.data as Score[];
}

export async function getFriendships(): Promise<Friendship[] | undefined> {
  const response = await getRequest('/friendship/list');
  if (!response.data) {
    return undefined;
  }
  return response.data as Friendship[];
}

export async function createFriendship(receiverLogin: string): Promise<PostResponse> {
  return postRequest('/friendship/create', { receiverLogin });
}

export async function acceptFriendship(friendshipId: string): Promise<PostResponse> {
  return postRequest('/friendship/accept', { friendshipId });
}

export async function deleteFriendship(friendshipId: string): Promise<PostResponse> {
  return postRequest('/friendship/delete', { friendshipId });
}

export async function getParty(): Promise<Party | undefined> {
  const response = await getRequest('/party/info');
  if (!response.data) {
    return undefined;
  }
  return response.data as Party;
}

export async function joinParty(partyId: string): Promise<PostResponse> {
  return postRequest('/party/join', { partyId });
}

export async function leaveParty(partyId: string): Promise<PostResponse> {
  return postRequest('/party/leave', { partyId });
}

export async function setMarkerColor(markerColor: MarkerColors): Promise<PostResponse> {
  return postRequest('/user/setMarkerColor', { markerColor });
}

export async function addScore(mileage: number): Promise<PostResponse> {
  return postRequest('/user/addScore', { mileage });
}

export async function setRoute(
  partyId: string,
  waypoints: LatLng[],
  startPointLatitude?: number,
  startPointLongitude?: number,
  endPointLatitude?: number,
  endPointLongitude?: number,
): Promise<PostResponse> {
  return postRequest('/party/setRoute', {
    partyId,
    startPointLatitude,
    startPointLongitude,
    endPointLatitude,
    endPointLongitude,
    waypoints,
  });
}

export async function requestResetPassword(email: string): Promise<PostResponse> {
  return postRequest('/auth/requestResetPassword', { email });
}

export async function verifyResetCode(email: string, code: string): Promise<PostResponse> {
  return postRequest('/auth/verifyResetCode', { email, code });
}

export async function resetPassword(
  email: string,
  code: string,
  newPassword: string,
): Promise<PostResponse> {
  return postRequest('/auth/resetPassword', { email, code, newPassword });
}
