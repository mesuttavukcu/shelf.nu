import { json, type ActionArgs } from "@remix-run/node";
import { commitAuthSession, requireAuthSession } from "~/modules/auth";
import { ShelfStackError } from "~/utils/error";

export const action = async ({ request }: ActionArgs) => {
  const authSession = await requireAuthSession(request);
  const formData = await request.formData();
  const organizationId = formData.get("organizationId");
  if (!organizationId)
    throw new ShelfStackError({ message: "Organization ID is required" });

  return json(
    { success: true },
    {
      headers: {
        // Update the organizationId in the auth session
        "Set-Cookie": await commitAuthSession(request, {
          authSession: {
            ...authSession,
            organizationId: organizationId as string,
          },
        }),
      },
    }
  );
};
