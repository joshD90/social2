import { useNavigate } from "react-router-dom";

import useForm from "../../../hooks/useServiceForm";
import PrimitiveInput from "../../../microcomponents/inputs/PrimitiveInput";
import validateLoginDetails from "../../../utils/formValidation/loginValidation/loginValidation";
import { useContext, useState } from "react";
import { TIterableStringObj } from "../../../types/userTypes/UserTypes";
import { AuthContext } from "../../../context/authContext/AuthContext";

const SignIn = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<TIterableStringObj>({});
  const { formState, updatePrimitiveField } = useForm({
    email: "",
    password: "",
  });
  const { userDispatch } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = "http://localhost:3500/auth/signin";
    const validationObj = await validateLoginDetails(formState);
    if (validationObj instanceof Error) return;
    if (!validationObj.valid || !validationObj.obj)
      return setErrors(validationObj.errors);

    try {
      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(validationObj.obj),
        credentials: "include",
      });
      if (!result.ok) throw Error(result.statusText);
      const user = await result.json();
      userDispatch({ type: "GET_USER_SUCCESS", payload: user });
      navigate("/services");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <section>
      <form
        onSubmit={handleSubmit}
        className="p-5 border-stone-50 border-2 rounded-md flex flex-col gap-5"
      >
        <PrimitiveInput
          label="Email"
          name="email"
          type="email"
          value={formState.email ? formState.email : ""}
          updateField={updatePrimitiveField}
          inputError={errors}
        />
        <PrimitiveInput
          label="Password"
          name="password"
          type="password"
          value={formState.password ? formState.password : ""}
          updateField={updatePrimitiveField}
          inputError={errors}
        />
        <button
          type="submit"
          className="w-full p-2 text-stone-50 bg-green-600 hover:bg-green-500 rounded-sm"
        >
          Sign In
        </button>
      </form>
      <div className="p-3 text-white flex items-center gap-5">
        <p className="mb-2">Don't have an Account yet?</p>
        <button
          onClick={() => navigate("/auth/signup")}
          className="p-2 bg-stone-600 hover:bg-green-500 text-white rounded-md"
        >
          Sign Up
        </button>
      </div>
    </section>
  );
};

export default SignIn;
