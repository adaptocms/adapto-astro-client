import { AdaptoSDK } from 'adapto-client-sdk';
import { API_URL, API_KEY } from '../../settings.ts';

export const adapto = new AdaptoSDK({
    baseUrl: API_URL,
    apiKey: API_KEY,
});
