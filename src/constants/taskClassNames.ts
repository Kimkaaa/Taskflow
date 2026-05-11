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
  "inline-flex h-9 cursor-pointer items-center justify-center rounded-xl px-3 text-sm font-semibold disabled:cursor-wait disabled:opacity-80";

export const dialogCancelButtonClass = `${dialogActionButtonBaseClass} w-14 text-app-soft`;

export const dialogConfirmButtonClass = `${dialogActionButtonBaseClass} w-14 bg-app-base/80 text-white`;

export const dialogListButtonClass = `${dialogActionButtonBaseClass} text-app-soft`;

export const dialogDangerButtonClass = `${dialogActionButtonBaseClass} w-14 bg-red-500/15 text-red-300`;