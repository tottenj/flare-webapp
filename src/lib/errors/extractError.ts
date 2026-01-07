import z from "zod";

export function extractFieldErrors(
  tree: ReturnType<typeof z.treeifyError>
): Record<string, string[]> {
  if (!('properties' in tree)) return {};

  const fieldErrors: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(
    tree.properties as Record<string, { errors?: string[] }>
  )) {
    if (value.errors?.length) {
      fieldErrors[key] = value.errors;
    }
  }

  return fieldErrors;
}
