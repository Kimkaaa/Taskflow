export type GroupInviteActionState = {
  error?: string;
  invite?: {
    invitePath: string;
    expiresAt: string;
  };
};

export type GroupActionState = {
  error?: string;
};

export const initialGroupActionState: GroupActionState = {};
export const initialGroupInviteActionState: GroupInviteActionState = {};