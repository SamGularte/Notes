export const parseContent = (content) => {
  if (!content) return "";
  if (typeof content === "string" && (content.startsWith("{") || content.startsWith("["))) {
    try {
      const parsed = JSON.parse(content);
      return parsed.content || parsed;
    } catch {
      return content;
    }
  }
  return content;
};
