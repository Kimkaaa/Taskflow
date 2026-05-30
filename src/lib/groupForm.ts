import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_NAME_MAX_LENGTH,
} from "@/constants/group";

const UNSAFE_GROUP_TEXT_PATTERN = /[\x00-\x1F\x7F<>]/;

type GroupFormInput = {
  name: string;
  description: string;
};

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function validateSafeText(value: string) {
  return !UNSAFE_GROUP_TEXT_PATTERN.test(value);
}

export function parseGroupFormData(formData: FormData): GroupFormInput {
  return {
    name: getStringValue(formData, "name"),
    description: getStringValue(formData, "description"),
  };
}

export function validateGroupName(name: string) {
  if (!name) {
    throw new Error("그룹명을 입력해주세요.");
  }

  if (name.length > GROUP_NAME_MAX_LENGTH) {
    throw new Error(`그룹명은 ${GROUP_NAME_MAX_LENGTH}자 이하로 입력해주세요.`);
  }

  if (!validateSafeText(name)) {
    throw new Error("그룹명에는 <, > 또는 줄바꿈 문자를 사용할 수 없습니다.");
  }
}

export function validateGroupDescription(description: string) {
  if (description.length > GROUP_DESCRIPTION_MAX_LENGTH) {
    throw new Error(
      `그룹 설명은 ${GROUP_DESCRIPTION_MAX_LENGTH}자 이하로 입력해주세요.`,
    );
  }

  if (!validateSafeText(description)) {
    throw new Error("그룹 설명에는 <, > 또는 줄바꿈 문자를 사용할 수 없습니다.");
  }
}

export function validateGroupFormInput(input: GroupFormInput) {
  validateGroupName(input.name);
  validateGroupDescription(input.description);
}