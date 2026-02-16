export const generateAvatar = (gender, name) => {
  const seed = name.replace(/\s+/g, "");

  return gender === "female"
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&gender=female`
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&gender=male`;
};
