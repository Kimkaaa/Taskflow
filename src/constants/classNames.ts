// 공통 레이아웃
export const pageClassNames = {
  main: "min-h-screen bg-app-bg px-6 py-8 text-white",
  section: "mx-auto max-w-2xl",
  title: "text-lg font-bold tracking-tight",
} as const;

// 공통 패널
export const panelClassNames = {
  surface: "rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm",
  compactSurface:
    "rounded-2xl border border-app-base bg-app-surface p-5 shadow-sm",
  danger:
    "rounded-2xl border border-red-500/30 bg-red-500/5 p-6 shadow-sm",
  dashedSurface:
    "rounded-2xl border border-dashed border-app-base bg-app-surface p-10 text-center shadow-sm",
  messageSurface:
    "rounded-2xl border border-app-base bg-app-surface p-10 text-center shadow-sm",
} as const;

// 공통 카드
export const cardClassNames = {
  inset: "rounded-xl border border-app-base bg-app-bg px-4 py-3",
  insetLink:
    "block rounded-xl border border-app-base bg-app-bg p-4 transition hover:bg-app-surface-hover",
  surfaceLink:
    "block rounded-2xl border border-app-base bg-app-surface p-6 shadow-sm transition hover:-translate-y-0.5 hover:bg-app-surface-hover hover:shadow-md",
} as const;

// 공통 텍스트
export const textClassNames = {
  titlePrimary: "text-lg font-bold text-white",
  titleSecondary: "text-sm font-semibold text-white",
  meta: "text-xs font-medium text-app-muted",
} as const;

// 공통 버튼
const fixedPrimaryButtonBase =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-app-base/80 text-sm font-semibold";

const fixedSecondaryButtonBase =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-app-base text-sm font-medium text-app-soft";

export const buttonClassNames = {
  fixedPrimary:
    `${fixedPrimaryButtonBase} w-20 cursor-pointer text-white`,

  fixedPrimaryPending:
    `${fixedPrimaryButtonBase} w-20 cursor-pointer text-white disabled:cursor-wait`,

  fixedPrimaryInactive:
    `${fixedPrimaryButtonBase} w-20 cursor-not-allowed text-app-muted`,

  fixedPrimaryWide:
    `${fixedPrimaryButtonBase} w-[110px] cursor-pointer text-white`,

  fixedSecondary:
    `${fixedSecondaryButtonBase} w-20 bg-app-surface`,

  fixedSecondaryWide:
    `${fixedSecondaryButtonBase} w-[110px] bg-app-bg`,

  fixedDanger:
    "inline-flex h-10 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 text-sm font-semibold text-red-300",

  smallPill:
    "rounded-full border border-app-base bg-app-bg px-3 py-1.5 text-xs font-medium text-app-soft transition hover:bg-app-surface-hover hover:text-white",
} as const;

// 공통 폼
const formInputBase =
  "w-full rounded-xl border border-app-base bg-app-bg px-4 py-3 text-sm text-white outline-none transition placeholder:text-app-muted focus:border-app-focus";

export const formClassNames = {
  input: formInputBase,
  dateInput: `${formInputBase} min-w-0 appearance-none`,
} as const;

// 뒤로가기
export const navigationClassNames = {
  back: "inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-app-soft",
} as const;

// 피드백
export const feedbackClassNames = {
  errorBox:
    "rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300",
} as const;

// 다이얼로그
const dialogActionButtonBase =
  "inline-flex h-10 min-w-20 cursor-pointer items-center justify-center rounded-xl px-4 text-sm font-semibold disabled:cursor-wait";

export const dialogClassNames = {
  overlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6",
  panel:
    "w-full max-w-sm rounded-2xl border border-app-base bg-app-surface p-6 shadow-xl",
  closeButton: "cursor-pointer text-app-muted",
  actions: "flex justify-end gap-2",
  actionButtonBase: dialogActionButtonBase,
  cancelButton: `${dialogActionButtonBase} text-app-soft`,
  confirmButton: `${dialogActionButtonBase} bg-app-base/80 text-white`,
  listButton: `${dialogActionButtonBase} bg-app-base/80 text-white`,
  dangerButton: `${dialogActionButtonBase} bg-red-500/15 text-red-300`,
} as const;

// 작업
const taskTagBase =
  "rounded-md border border-app-base bg-app-bg px-2 py-1 text-xs text-app-muted";

const taskActionButtonBase =
  "inline-flex cursor-pointer items-center gap-2 rounded-full border border-app-base bg-app-surface px-4 py-2 text-sm font-medium";

export const taskClassNames = {
  tag: taskTagBase,
  tagLink: `${taskTagBase} transition hover:border-app-strong hover:text-white`,
  actionButtonBase: taskActionButtonBase,
  editActionButton: `${taskActionButtonBase} text-app-soft`,
  deleteActionButton: `${taskActionButtonBase} text-red-300`,
  floatingCreateButton:
    "fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-app-base/80 text-white shadow-lg backdrop-blur transition",
  filterScopeChipBase:
    "inline-flex h-8 cursor-pointer items-center justify-center rounded-full border px-2.5 text-sm font-medium tracking-tight transition sm:h-9 sm:px-3 sm:tracking-normal",
  filterDetailChipBase:
    "inline-flex h-8 cursor-pointer items-center justify-center rounded-full bg-app-base/60 px-2.5 text-sm font-medium tracking-tight transition sm:px-3",
  formChipBase:
    "inline-flex h-9 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition",
  formSubmitButton:
    "inline-flex h-11 w-20 cursor-pointer items-center justify-center gap-2 rounded-xl bg-app-base/80 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-80",
  formResetButton:
    "inline-flex h-11 w-11 cursor-pointer items-center justify-center text-app-muted transition hover:text-white",
  todoInput:
    "min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-app-disabled",
  todoItem:
    "flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-app-base bg-app-bg px-3 py-2",
} as const;

// 그룹
export const groupClassNames = {
  titleOwnerBadge:
    "rounded-full bg-app-base px-2 py-1 text-xs font-medium text-white",
  titleMemberBadge:
    "rounded-full border border-app-base px-2 py-1 text-xs font-medium text-app-soft",
  roleOwnerBadge:
    "rounded-full bg-app-base px-2 py-0.5 text-xs text-white",
  roleMemberBadge:
    "rounded-full bg-app-base/30 px-2 py-0.5 text-xs tex-app-muted",
} as const;