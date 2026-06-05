"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";
import { routes } from "@/constants/routes";
import { prisma } from "@/lib/prisma";
import { requireAppUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  parseUserProfileFormData,
  validateNickname,
} from "@/lib/userForm";
import type { AccountActionState } from "@/types/accountAction";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "요청을 처리하지 못했습니다.";
}

export async function updateNickname(
  _prevState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const user = await requireAppUser(routes.me);
  const input = parseUserProfileFormData(formData);

  try {
    validateNickname(input.nickname);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        nickname: input.nickname,
      },
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  revalidatePath(routes.me);
  revalidatePath(routes.tasks);
  revalidatePath(routes.groups);

  redirect(routes.me, RedirectType.replace);
}

export async function deleteAccount(
  _prevState: AccountActionState,
  _formData: FormData,
): Promise<AccountActionState> {
  const user = await requireAppUser(routes.me);

  try {
    await prisma.$transaction(async (tx) => {
      await tx.task.updateMany({
        where: {
          group: {
            ownerId: user.id,
          },
        },
        data: {
          visibility: "PRIVATE",
          groupId: null,
        },
      });

      await tx.user.delete({
        where: {
          id: user.id,
        },
      });
    });
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath(routes.tasks);
  revalidatePath(routes.groups);
  revalidatePath(routes.me);

  redirect(routes.tasks, RedirectType.replace);
}