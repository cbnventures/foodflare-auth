// Type definitions for foodflare-auth 1.0.4
// Project: https://github.com/cbnventures/foodflare-auth
// Definitions by: Jacky Liang <https://github.com/mrjackyliang>
// TypeScript Version: 3.7.5

import { Context, AuthResponse } from 'aws-lambda';

interface AuthEvent {
  type: 'REQUEST' | 'TOKEN' | 'COGNITO_USER_POOLS';
  methodArn: string;
  authorizationToken: string;
}

type AuthContext = Context;

type AuthCallback = (failed?: 'Unauthorized' | null, success?: PolicyResponse) => void;

type PolicyResponse = AuthResponse;

interface Payload {
  type: 'web' | 'app';
  ip: string;
  ua: string;
  iat: number;
  exp: number;
}
