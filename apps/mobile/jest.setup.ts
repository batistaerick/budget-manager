import { jest } from '@jest/globals';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8080';
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);
