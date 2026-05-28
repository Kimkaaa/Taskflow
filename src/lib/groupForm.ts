import { GROUP_NAME_MAX_LENGTH } from "@/constants/group";

export function parseGroupName(formData: FormData) {
  const value = formData.get("name");

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function validateGroupName(name: string) {
  if (!name) {
    throw new Error("그룹명을 입력해주세요.");
  }

  if (name.length > GROUP_NAME_MAX_LENGTH) {
    throw new Error(`그룹명은 ${GROUP_NAME_MAX_LENGTH}자 이하로 입력해주세요.`);
  }
}