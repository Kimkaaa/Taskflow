export type GroupInviteActionState = {
  error?: string;
  invite?: {
    invitePath: string;
    expiresAt: string;
  };
};

export type GroupInviteDeleteActionState = {
  error?: string;
  deleted?: boolean;
};

export type GroupActionState = {
  error?: string;
};

export const initialGroupActionState: GroupActionState = {};
export const initialGroupInviteActionState: GroupInviteActionState = {};
export const initialGroupInviteDeleteActionState: GroupInviteDeleteActionState =
  {};