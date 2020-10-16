// eslint-disable-next-line no-unused-vars
import axiosClient, { AxiosInstance } from 'axios';
import { AsyncStorage } from 'react-native';
import { jwtStorageKeyName, serverUrl } from './constants';
import { GetResponse, PostResponse, ServerResponse, User, Score } from './entities';

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

function getRequest(endpoint: string): Promise<GetResponse> {
  return makeRequest('GET', endpoint);
}

function postRequest(endpoint: string, data: object): Promise<PostResponse> {
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

export function register(login: string, password: string, email: string): Promise<PostResponse> {
  return postRequest('/auth/register', { login, password, email });
}

export async function getUserInfo(): Promise<User | undefined> {
  const response = await getRequest('/user/info');
  if (!response.data) {
    return undefined;
  }
  return response.data as User;
}

export function changePassword(oldPassword: string, newPassword: string): Promise<PostResponse> {
  return postRequest('/auth/changePassword', { oldPassword, newPassword });
}

export async function getScores(): Promise<Score[] | undefined> {
  const response = await getRequest('/user/getScores');
  if (!response.data) {
    return undefined;
  }
  return response.data as Score[];
}
