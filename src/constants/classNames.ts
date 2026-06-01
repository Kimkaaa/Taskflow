// 공통 레이아웃
export const pageMainClass = "min-h-screen bg-app-bg px-6 py-8 text-white";
export const pageSectionClass = "mx-auto max-w-2xl";

// 뒤로가기
export const backNavigationClass =
  "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-app-soft";

// 태그
export const taskTagClass =
  "rounded-md border border-app-base bg-app-bg px-2 py-1 text-xs text-app-muted";

export const taskTagLinkClass = `${taskTagClass} transition hover:border-app-strong hover:text-white`;

// 작업 액션 버튼
export const taskActionButtonBaseClass =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-app-base bg-app-surface px-4 py-2 text-sm font-medium";

export const taskEditActionButtonClass = `${taskActionButtonBaseClass} text-app-soft`;

export const taskDeleteActionButtonClass = `${taskActionButtonBaseClass} text-red-300`;

// 다이얼로그 버튼
export const dialogActionButtonBaseClass =
  "inline-flex h-10 min-w-20 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-semibold disabled:cursor-wait";

export const dialogCancelButtonClass = `${dialogActionButtonBaseClass} text-app-soft`;

export const dialogConfirmButtonClass = `${dialogActionButtonBaseClass} bg-app-base/80 text-white`;

export const dialogListButtonClass = `${dialogActionButtonBaseClass} bg-app-base/80 text-white`;

export const dialogDangerButtonClass = `${dialogActionButtonBaseClass} bg-red-500/15 text-red-300`;

// 그룹
export const groupPanelClass =
  "rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm";

export const groupCompactPanelClass =
  "rounded-2xl border border-app-base bg-app-surface p-5 shadow-sm";

export const groupDangerPanelClass =
  "rounded-2xl border border-red-500/30 bg-red-500/5 p-6 shadow-sm";

export const groupMemberCardClass =
  "rounded-xl border border-app-base bg-app-bg px-4 py-3";

export const groupOwnerBadgeClass =
  "rounded-full bg-app-base px-2 py-1 text-xs font-medium text-white";

export const groupMemberBadgeClass =
  "rounded-full border border-app-base px-2 py-1 text-xs font-medium text-app-soft";

export const groupMemberOwnerBadgeClass =
  "rounded-full bg-app-base px-2 py-0.5 text-xs font-medium text-white";

export const groupMemberRoleTextClass = "text-xs text-app-muted";

export const groupPrimaryActionButtonClass =
  "inline-flex h-10 w-20 items-center justify-center gap-2 rounded-xl bg-app-base/80 text-sm font-semibold text-white";

export const groupSecondaryActionButtonClass =
  "inline-flex h-10 w-20 items-center justify-center gap-2 rounded-xl border border-app-base bg-app-surface text-sm font-medium text-app-soft";

export const groupSmallActionLinkClass =
  "rounded-full border border-app-base bg-app-bg px-3 py-1.5 text-xs font-medium text-app-soft transition hover:bg-app-surface-hover hover:text-white";

export const groupTaskCardLinkClass =
  "block rounded-xl border border-app-base bg-app-bg p-4 transition hover:bg-app-surface-hover";

export const groupDangerButtonClass =
  "inline-flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-semibold text-red-300";