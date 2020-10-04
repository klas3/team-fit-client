// eslint-disable-next-line no-unused-vars
import axiosClient, { AxiosInstance } from 'axios';
import { AsyncStorage } from 'react-native';
import { jwtStorageKeyName, serverUrl } from './constants';
import { User } from './entities';

let axios: AxiosInstance;

export async function updateAxiosClient(): Promise<void> {
  axios = axiosClient.create({
    timeout: 20 * 1000,
    baseURL: serverUrl,
    headers: { Authorization: `Bearer ${await AsyncStorage.getItem(jwtStorageKeyName)}` },
  });
}

async function getRequest(endpoint: string): Promise<{} | any[] | undefined> {
  try {
    const response = (await axios.get(endpoint)).data;
    return !response ? {} : response;
  } catch {
    return undefined;
  }
}

async function postRequest(endpoint: string, data: {}): Promise<{} | any[] | undefined> {
  try {
    const response = (await axios.post(endpoint, data)).data;
    return !response ? {} : response;
  } catch {
    return undefined;
  }
}

async function postRequestWithError(endpoint: string, data: {}): Promise<{ error: string }> {
  try {
    return { error: (await axios.post(endpoint, data)).data };
  } catch (error) {
    return { error: error.response.data.message };
  }
}

export async function logout(): Promise<void> {
  await AsyncStorage.setItem(jwtStorageKeyName, '');
  await updateAxiosClient();
}

export async function loginToAccount(login: string, password: string): Promise<{} | undefined> {
  const response = await postRequest('/auth/login', { login, password });
  if (!response) {
    return undefined;
  }
  const { authToken } = response as { authToken: string };
  await AsyncStorage.setItem(jwtStorageKeyName, authToken);
  await updateAxiosClient();
  return {};
}

export async function register(
  login: string,
  password: string,
  email: string,
): Promise<{ error: string }> {
  return postRequestWithError('/auth/register', { login, password, email });
}

export async function getUserInfo(): Promise<User | undefined> {
  const response = await getRequest('/user/info');
  if (!response) {
    return undefined;
  }
  return response as User;
}

export async function changePassword(
  oldPassword: string,
  newPassword: string,
): Promise<{ error: string }> {
  return postRequestWithError('/auth/changePassword', { oldPassword, newPassword });
}
