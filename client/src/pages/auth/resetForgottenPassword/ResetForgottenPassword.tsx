import { useLocation } from "react-router-dom";
import findQueryParam from "../../../utils/queryParams/findQueryParam";
import { useState } from "react";
import PrimitiveInput from "../../../microcomponents/inputs/PrimitiveInput";
const ResetForgottenPassword = () => {
  const location = useLocation();
  const [password, setPassword] = useState<{
    primary: string;
    confirm: string;
  }>({ primary: "", confirm: "" });
  const [responseMessage, setResponseMessage] = useState("");
  const [inputError, setInputError] = useState<{
    [key: string]: string;
  }>({ password: "", passwordConfirm: "" });

  const email = findQueryParam(location.search, "username") ?? "";
  const token = findQueryParam(location.search, "token") ?? "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.primary !== password.confirm)
      return setInputError((prev) => ({
        ...prev,
        ["confirm"]: "Passwords Need To Match",
      }));
  };

  const inputUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form
      className="p-5 border-stone-50 border-2 rounded-md flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      {responseMessage !== "" && (
        <p className="text-red-500 text-center">{responseMessage}</p>
      )}
      <p className="text-stone-50 text-center">Enter Email Below. </p>
      <p className="text-stone-50">
        An email will be sent if we have a matching record.
      </p>

      <PrimitiveInput
        label="Password"
        type="password"
        name="primary"
        value={password.primary}
        updateField={inputUpdate}
        inputError={inputError}
        setInputError={setInputError}
      />

      <PrimitiveInput
        label="Confirm Password"
        type="password"
        name="confirm"
        value={password.confirm}
        updateField={inputUpdate}
        inputError={inputError}
        setInputError={setInputError}
      />
      <button
        type="submit"
        className="w-full p-2 text-stone-50 bg-green-600 hover:bg-green-500 rounded-sm"
      >
        Update Your Password
      </button>
    </form>
  );
};

export default ResetForgottenPassword;
