import { useLocation, useNavigate } from "react-router-dom";
import findQueryParam from "../../../utils/queryParams/findQueryParam";
import { useState } from "react";
import PrimitiveInput from "../../../microcomponents/inputs/PrimitiveInput";
import {
  passwordResetValidationSchema,
  validateForm,
} from "../../../utils/formValidation/passwordResetValidation/passwordResetValidation";
import envIndex from "../../../envIndex/envIndex";

const changeSuccessMessage = "Successfully Changed Your Password";

const ResetForgottenPassword = () => {
  const location = useLocation();
  const [password, setPassword] = useState<{
    primary: string;
    passwordConfirm: string;
  }>({ primary: "", passwordConfirm: "" });
  const [responseMessage, setResponseMessage] = useState({
    positive: false,
    message: "",
  });
  const [inputError, setInputError] = useState<{
    [key: string]: string;
  }>({ password: "", passwordConfirm: "" });
  const navigate = useNavigate();

  const email = findQueryParam(location.search, "username") ?? "";
  const token = findQueryParam(location.search, "token") ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Hitting this point");
    e.preventDefault();

    //validate our inputs
    const validationResult = await validateForm(
      password,
      passwordResetValidationSchema
    );

    if (validationResult instanceof Error)
      return setResponseMessage({
        positive: false,
        message: validationResult.message,
      });
    if (!validationResult.valid) {
      setInputError(validationResult.errors);
      return;
    }
    //send our request
    try {
      const url = `${envIndex.urls.baseUrl}/auth/confirm-reset-token`;

      const resetResponse = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password.primary, email, token }),
        method: "POST",
      });
      if (!resetResponse.ok) throw Error(resetResponse.statusText);
      setResponseMessage({
        positive: true,
        message: changeSuccessMessage,
      });
    } catch (error) {
      setResponseMessage({
        positive: false,
        message: (error as Error).message,
      });
    }
  };

  const inputUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form
      className="p-5 border-stone-50 border-2 rounded-md flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      {responseMessage.message !== "" && (
        <p
          className={`text-center ${
            responseMessage.positive ? "text-green-500" : "text-red-800"
          }`}
        >
          {responseMessage.message}
        </p>
      )}
      {responseMessage.message === changeSuccessMessage && (
        <button
          onClick={() => navigate("/auth/signin")}
          className="w-full p-2 text-stone-50 bg-green-600 hover:bg-green-500 rounded-sm"
        >
          Sign In
        </button>
      )}

      <p className="text-stone-50">Create a new password</p>

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
        name="passwordConfirm"
        value={password.passwordConfirm}
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
