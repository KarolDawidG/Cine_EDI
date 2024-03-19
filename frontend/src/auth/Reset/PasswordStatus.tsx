import React from "react";

interface PasswordStatusProps {
  password: string;
  password2: string;
  passwordsMatch: boolean;
}

export const PasswordStatus: React.FC<PasswordStatusProps> = ({
  password,
  password2,
  passwordsMatch,
}) => {
  return (
    <>
      {password && password2 && passwordsMatch
        ? "😍"
        : password || password2
        ? "🙆"
        : "🙋"}
    </>
  );
};
