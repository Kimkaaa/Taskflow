import {
  USER_NICKNAME_MAX_LENGTH,
  USER_NICKNAME_MIN_LENGTH,
} from "@/constants/user";

const NICKNAME_PATTERN = /^[가-힣ㄱ-ㅎㅏ-ㅣA-Za-z0-9_-]+$/;

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

export function getNicknameValidationMessage(nickname: string) {
  const value = nickname.trim();

  if (!value) {
    return "닉네임을 입력해주세요.";
  }

  if (value.length < USER_NICKNAME_MIN_LENGTH) {
    return `닉네임은 ${USER_NICKNAME_MIN_LENGTH}자 이상 입력해주세요.`;
  }

  if (value.length > USER_NICKNAME_MAX_LENGTH) {
    return `닉네임은 ${USER_NICKNAME_MAX_LENGTH}자 이하로 입력해주세요.`;
  }

  if (!NICKNAME_PATTERN.test(value)) {
    return "닉네임은 한글, 영문, 숫자, -, _만 사용할 수 있습니다.";
  }

  return null;
}

export function validateNickname(nickname: string) {
  const message = getNicknameValidationMessage(nickname);

  if (message) {
    throw new Error(message);
  }
}