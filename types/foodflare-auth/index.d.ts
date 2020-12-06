// Type definitions for foodflare-auth 1.0.15
// Project: https://github.com/cbnventures/foodflare-auth
// Definitions by: Jacky Liang <https://github.com/mrjackyliang>
// TypeScript Version: 3.9.7

import { Context, PolicyDocument } from 'aws-lambda';

export interface AuthEvent {
  type: 'REQUEST' | 'TOKEN' | 'COGNITO_USER_POOLS';
  methodArn: string;
  authorizationToken: string;
}

export type AuthContext = Context;

export type AuthCallback = (failed?: 'Unauthorized' | null, success?: PolicyDocument) => void;

export interface Payload {
  platform: 'web' | 'mobile';
  ip: string;
  ua: string;
  iat: number;
  exp: number;
}
