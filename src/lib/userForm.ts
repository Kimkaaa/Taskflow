import {
  USER_NICKNAME_MAX_LENGTH,
  USER_NICKNAME_MIN_LENGTH,
} from "@/constants/user";

const NICKNAME_PATTERN = /^[가-힣A-Za-z0-9_-]+$/;

export type UserProfileFormInput = {
  nickname: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function parseUserProfileFormData(
  formData: FormData,
): UserProfileFormInput {
  return {
    nickname: getStringValue(formData, "nickname"),
  };
}

export function validateNickname(nickname: string) {
  if (!nickname) {
    throw new Error("닉네임을 입력해주세요.");
  }

  if (nickname.length < USER_NICKNAME_MIN_LENGTH) {
    throw new Error(
      `닉네임은 ${USER_NICKNAME_MIN_LENGTH}자 이상 입력해주세요.`,
    );
  }

  if (nickname.length > USER_NICKNAME_MAX_LENGTH) {
    throw new Error(
      `닉네임은 ${USER_NICKNAME_MAX_LENGTH}자 이하로 입력해주세요.`,
    );
  }

  if (!NICKNAME_PATTERN.test(nickname)) {
    throw new Error("닉네임은 한글, 영문, 숫자, -, _만 사용할 수 있습니다.");
  }
}