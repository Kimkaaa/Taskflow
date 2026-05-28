"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import type { GroupActionState } from "@/types/groupAction";

const GROUP_NAME_MAX_LENGTH = 30;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "그룹을 저장하지 못했습니다.";
}

function parseGroupName(formData: FormData) {
  const value = formData.get("name");

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function createGroup(
  _prevState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const user = await requireAppUser();
  const name = parseGroupName(formData);

  if (!name) {
    return {
      error: "그룹명을 입력해주세요.",
    };
  }

  if (name.length > GROUP_NAME_MAX_LENGTH) {
    return {
      error: `그룹명은 ${GROUP_NAME_MAX_LENGTH}자 이하로 입력해주세요.`,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name,
          ownerId: user.id,
        },
      });

      await tx.groupMember.create({
        data: {
          groupId: group.id,
          userId: user.id,
        },
      });
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath("/groups");
  redirect("/groups", RedirectType.replace);
}