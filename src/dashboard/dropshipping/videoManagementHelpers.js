export const getYoutubeEmbedUrl = (url) => {
  if (!url) return "";
  let videoId = "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) videoId = match[2];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};

export const STANDALONE_VIDEO_TYPES = new Set(["standard", "demo"]);

export const isModuleFree = (moduleId, modules, courses) => {
  if (!moduleId) return true;
  const parentMod = modules.find((m) => String(m._id) === String(moduleId));
  if (!parentMod) return true;
  if ((parentMod.price ?? 0) > 0) return false;
  const parentCourse = courses.find(
    (c) => String(c._id) === String(parentMod.courseId),
  );
  return parentCourse ? parentCourse.price <= 0 : true;
};

export const resolveVideoTypeForModule = (currentType, moduleId, modules, courses) => {
  if (!moduleId) {
    if (STANDALONE_VIDEO_TYPES.has(currentType)) return currentType;
    if (currentType === "free") return "standard";
    return "standard";
  }
  const freeModule = isModuleFree(moduleId, modules, courses);
  if (freeModule) return "free";
  return "premium";
};
