import { useNavigate } from "react-router-dom";
import React from "react";

import useForm from "../../../hooks/useServiceForm";
import PrimitiveInput from "../../../microcomponents/inputs/PrimitiveInput";
import validateUser from "../../../utils/formValidation/userValidation/userValidation";
import { useState } from "react";
import { TIterableStringObj } from "../../../types/userTypes/UserTypes";
import envIndex from "../../../envIndex/envIndex";

const SignUp = () => {
  const [errors, setErrors] = useState<TIterableStringObj>({});
  const { formState, updatePrimitiveField } = useForm({
    email: "",
    password: "",
    passwordConfirm: "",
    organisation: "",
    firstName: "",
    lastName: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validatedUser = await validateUser(formState);

    if (validatedUser instanceof Error) return;
    if (!validatedUser.valid) return setErrors(validatedUser.errors);

    const abortController = new AbortController();
    const url = `${envIndex.urls.baseUrl}/auth/signup`;
    try {
      const result = await fetch(url, {
        method: "POST",
        signal: abortController.signal,
        body: JSON.stringify(validatedUser.obj),
        headers: { "Content-Type": "application/json" },
      });
      if (!result.ok) throw Error(`${result.statusText}`);
      navigate("/auth/signupexplainer", {
        state: { username: formState.email },
      });
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
          label="First Name"
          name="firstName"
          type="text"
          value={formState.firstName}
          updateField={updatePrimitiveField}
          inputError={errors}
        />
        <PrimitiveInput
          label="Last Name"
          name="lastName"
          type="text"
          value={formState.lastName}
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
        <PrimitiveInput
          label="Confirm Your Password"
          name="passwordConfirm"
          type="password"
          value={formState.passwordConfirm ? formState.passwordConfirm : ""}
          updateField={updatePrimitiveField}
          inputError={errors}
        />
        <PrimitiveInput
          label="Organisation that you are attached to"
          name="organisation"
          type="text"
          value={formState.organisation ? formState.organisation : ""}
          updateField={updatePrimitiveField}
          inputError={errors}
        />
        <button
          type="submit"
          className="w-full p-2 text-stone-50 bg-green-600 hover:bg-green-500 rounded-sm"
        >
          Sign Up
        </button>
      </form>
      <div className="p-3 text-white flex items-center gap-5">
        <p className="mb-2">Already a member?</p>
        <button
          onClick={() => navigate("/auth/signin")}
          className="p-2 bg-stone-600 hover:bg-green-600 text-white rounded-md"
        >
          Sign In
        </button>
      </div>
    </section>
  );
};

export default SignUp;
