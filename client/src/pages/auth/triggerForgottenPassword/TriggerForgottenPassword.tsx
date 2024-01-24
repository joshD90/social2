import { useLocation } from "react-router-dom";
import PrimitiveInput from "../../../microcomponents/inputs/PrimitiveInput";
import { useState } from "react";
import { TIterableStringObj } from "../../../types/userTypes/UserTypes";

const TriggerForgottenPassword = () => {
  const location = useLocation();
  const [email, setEmail] = useState(location.state.email ?? "");
  const [error, setError] = useState<TIterableStringObj>({ email: "" });

  return (
    <form className="p-5 border-stone-50 border-2 rounded-md flex flex-col gap-5">
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
        className="w-full p-2 text-stone-50 bg-green-600 hover:bg-green-500 rounded-sm"
      >
        Send Recovery Link
      </button>
    </form>
  );
};

export default TriggerForgottenPassword;
