import { useContext, useState, FC, SetStateAction } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import TextAreaInput from "../../microcomponents/inputs/TextAreaInput";
import useForm from "../../hooks/useServiceForm";
import { validateServiceReport } from "../../utils/formValidation/serviceReportValidation/serviceReportValidation";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  serviceId: string | boolean;
  setVisible: React.Dispatch<SetStateAction<boolean>>;
};

const ServiceReportModal: FC<Props> = ({ serviceId, setVisible }) => {
  const { currentUser } = useContext(AuthContext);
  const { formState, updatePrimitiveField } = useForm({ inaccuracyDesc: "" });
  const [inputError, setInputError] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    //validate
    if (!currentUser.user || currentUser.user.email === "guest@guest.com")
      return setGeneralError("You must be signed in to create a report");
    if (!(typeof serviceId === "string"))
      return setGeneralError("Could not locate service id");
    const validationResult = await validateServiceReport(formState);
    if (validationResult instanceof Error)
      return setGeneralError("There was an Error with Validation");
    if (!validationResult.valid) return setInputError(validationResult.errors);

    const url = "http://localhost:3500/service/service/report";
    try {
      const response = await fetch(url, {
        credentials: "include",
        body: JSON.stringify({
          data: validationResult.obj,
          user: currentUser.user,
          serviceId: serviceId,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw Error(response.statusText);
      setSuccessMessage(
        "You have successfully submitted the request.  Thankyou for being part of making this space better for everyone"
      );
    } catch (error) {
      if (error instanceof Error) return setGeneralError(error.message);
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-stone-50 bg-opacity-20">
      <div className="max-h-screen overflow-y-auto p-5 bg-blue-950 w-1/2 rounded-md shadow-lg">
        {generalError !== "" && <p className="text-red-400">{generalError}</p>}
        {successMessage !== "" && (
          <p className="text-green-400">{successMessage}</p>
        )}
        <div className="flex justify-end text-stone-50 text-2xl mb-2">
          <button onClick={() => setVisible(false)}>
            <AiOutlineClose />
          </button>
        </div>
        <p className="text-stone-50">
          If you see there are any factual inaccuracies or something could be
          worded better please submit your change and suggestion below. This
          site is still a work in progress and we truly only want accurate and
          helpful information to be recorded. Your suggestion will be reviewed
          as soon as possible by the site admin
        </p>
        {successMessage === "" ? (
          <form
            onSubmit={submitForm}
            className="mt-5 border-2 p-2 border-stone-50 rounded-md"
          >
            <TextAreaInput
              label="A description of the error(s)"
              size={{ cols: 10, rows: 10 }}
              name="inaccuracyDesc"
              value={formState.inaccuracyDesc}
              updateField={updatePrimitiveField}
              inputError={inputError}
            />
            <div className="mt-5 flex justify-end">
              <button className="p-5 text-stone-50 bg-green-600 hover:bg-green-500 hover:text-white rounded-sm">
                Submit Report
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-center mt-5">
            <button
              className="p-5 text-stone-50 bg-green-600 hover:bg-green-500 hover:text-white rounded-sm"
              onClick={() => setVisible(false)}
            >
              Back to Service
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceReportModal;
