export const getMediaIdFromString = (url = "") => {
  const parts = url.split("/");
  return parts?.pop();
}