const RULE_FNS = {
  hasNumber: (v) => /\d/.test(v),
  hasUpperCase: (v) => /[A-Z]/.test(v),
  hasLowerCase: (v) => /[a-z]/.test(v),
  hasSpecialChar: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  minLength: (v) => v.length >= 10,
};

const MESSAGES = {
  hasNumber: "Must contain at least one number",
  hasUpperCase: "Must contain at least one uppercase letter",
  hasLowerCase: "Must contain at least one lowercase letter",
  hasSpecialChar: "Must contain at least one special character",
  minLength: "Must be at least 10 characters",
};

export const passwordRules = {
  validate: Object.fromEntries(
    Object.entries(RULE_FNS).map(([key, fn]) => [
      key,
      (v) => fn(v) || MESSAGES[key],
    ])
  ),
};

export const PASSWORD_CRITERIA = [
  { key: "hasNumber", label: "At least one number" },
  { key: "hasUpperCase", label: "At least one uppercase letter" },
  { key: "hasLowerCase", label: "At least one lowercase letter" },
  { key: "hasSpecialChar", label: "At least one special character" },
  { key: "minLength", label: "At least 10 characters" },
];

export const checkPasswordCriteria = (value) => {
  if (!value) return PASSWORD_CRITERIA.map((c) => ({ ...c, met: false }));
  return PASSWORD_CRITERIA.map((c) => ({
    ...c,
    met: RULE_FNS[c.key](value),
  }));
};
