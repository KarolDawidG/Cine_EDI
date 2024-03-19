
interface PassForm {
  password: string;
  setPassword: (password: string) => void;
  label: string;
}

export const PasswordForm = ({ password, setPassword, label }: PassForm) => {
  return (
    <>
      <label htmlFor="password">
        {label}
      </label>
      <input
        type="password"
        id="password"
        value={password}
        minLength={8}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </>
  );
};
