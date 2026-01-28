export function buildProjectImagePath(
  userId: string,
  projectId: string,
  filename: string
) {
  return `${userId}/${projectId}/${filename}`;
}
