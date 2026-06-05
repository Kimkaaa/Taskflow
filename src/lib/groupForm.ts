import {
  GROUP_DESCRIPTION_MAX_LENGTH,
  GROUP_NAME_MAX_LENGTH,
  GROUP_NAME_MIN_LENGTH,
} from "@/constants/group";

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

export function parseGroupFormData(formData: FormData): GroupFormInput {
  return {
    name: getStringValue(formData, "name"),
    description: getStringValue(formData, "description"),
  };
}

export function getGroupNameValidationMessage(name: string) {
  const value = name.trim();

  if (!value) {
    return "그룹명을 입력해주세요.";
  }

  if (value.length < GROUP_NAME_MIN_LENGTH) {
    return `그룹명은 ${GROUP_NAME_MIN_LENGTH}자 이상 입력해주세요.`;
  }

  if (value.length > GROUP_NAME_MAX_LENGTH) {
    return `그룹명은 ${GROUP_NAME_MAX_LENGTH}자 이하로 입력해주세요.`;
  }

  return null;
}

export function getGroupDescriptionValidationMessage(description: string) {
  const value = description.trim();

  if (value.length > GROUP_DESCRIPTION_MAX_LENGTH) {
    return `그룹 설명은 ${GROUP_DESCRIPTION_MAX_LENGTH}자 이하로 입력해주세요.`;
  }

  return null;
}

export function validateGroupName(name: string) {
  const message = getGroupNameValidationMessage(name);

  if (message) {
    throw new Error(message);
  }
}

export function validateGroupDescription(description: string) {
  const message = getGroupDescriptionValidationMessage(description);

  if (message) {
    throw new Error(message);
  }
}

export function validateGroupFormInput(input: GroupFormInput) {
  validateGroupName(input.name);
  validateGroupDescription(input.description);
}