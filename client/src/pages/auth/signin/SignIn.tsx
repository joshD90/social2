import { useNavigate } from "react-router-dom";

import useForm from "../../../hooks/useServiceForm";
import PrimitiveInput from "../../../microcomponents/inputs/PrimitiveInput";

const SignIn = () => {
  const navigate = useNavigate();
  const { formState, updatePrimitiveField } = useForm({
    email: "",
    password: "",
  });

  const handleSubmit = () => {
    console.log("submitting");
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
        />
        <PrimitiveInput
          label="Password"
          name="password"
          type="password"
          value={formState.password ? formState.password : ""}
          updateField={updatePrimitiveField}
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
