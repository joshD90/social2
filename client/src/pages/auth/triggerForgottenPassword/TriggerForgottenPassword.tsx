import { useLocation } from "react-router-dom";
import PrimitiveInput from "../../../microcomponents/inputs/PrimitiveInput";
import React, { useState } from "react";
import { TIterableStringObj } from "../../../types/userTypes/UserTypes";
import envIndex from "../../../envIndex/envIndex";

const TriggerForgottenPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state.email ?? "");
  const [error, setError] = useState<TIterableStringObj>({ email: "" });
  const [responseMessage, setResponseMessage] = useState({
    positive: false,
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${envIndex.urls.baseUrl}/auth/create-reset-token`;
    console.log(email, "email to send create reset token");
    try {
      const resetResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      if (!resetResponse.ok) throw Error(resetResponse.statusText);
      setResponseMessage({
        positive: true,
        message: "You Successfully Sent an Reset Link to Email Address",
      });
      setEmail("");
    } catch (error) {
      setResponseMessage({
        positive: false,
        message: (error as Error).message,
      });
    }
  };

  return (
    <form
      className="p-5 border-stone-50 border-2 rounded-md flex flex-col gap-5"
      onSubmit={handleSubmit}
    >
      {responseMessage.message !== "" && (
        <p
          className={`${
            responseMessage.positive ? "text-green-500" : "text-red-500"
          } text-center`}
        >
          {responseMessage.message}
        </p>
      )}
      <p className="text-stone-50 text-center">Enter Email Below. </p>
      <p className="text-stone-50">
        An email will be sent if we have a matching record.
      </p>

      <PrimitiveInput
        label="Email"
        type="email"
        name="email"
        value={email}
        updateField={(e) => setEmail(e.target.value)}
        inputError={error}
        setInputError={setError}
      />
      <button
        type="submit"
        className={`w-full p-2  ${
          !responseMessage.positive
            ? "bg-green-600 hover:bg-green-500 text-stone-50"
            : "bg-stone-600 text-stone-300"
        } rounded-sm`}
        disabled={responseMessage.positive}
      >
        Send Recovery Link
      </button>
    </form>
  );
};

export default TriggerForgottenPassword;
