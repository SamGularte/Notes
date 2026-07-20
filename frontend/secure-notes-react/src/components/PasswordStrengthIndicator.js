import React from "react";
import { checkPasswordCriteria } from "../utils/passwordValidation";

const PasswordStrengthIndicator = ({ value }) => {
  if (!value) return null;

  const criteria = checkPasswordCriteria(value);

  return (
    <div className="mt-1 space-y-0.5">
      {criteria.map((c) => (
        <div key={c.key} className="flex items-center gap-1.5">
          <span
            className={`text-xs ${
              c.met ? "text-green-600" : "text-slate-300"
            }`}
          >
            {c.met ? "\u2713" : "\u25CB"}
          </span>
          <span
            className={`text-xs ${
              c.met ? "text-green-600" : "text-slate-400"
            }`}
          >
            {c.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PasswordStrengthIndicator;
