import { randomBytes } from "node:crypto";
import {
  GROUP_INVITE_EXPIRES_IN_DAYS,
  GROUP_INVITE_TOKEN_BYTES,
} from "@/constants/group";

export function createGroupInviteToken() {
  return randomBytes(GROUP_INVITE_TOKEN_BYTES).toString("base64url");
}

export function createGroupInviteExpiresAt() {
  return new Date(
    Date.now() + GROUP_INVITE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
  );
}

export function isGroupInviteExpired(expiresAt: Date) {
  return expiresAt <= new Date();
}