import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext/AuthContext";
import TextAreaInput from "../../microcomponents/inputs/TextAreaInput";
import useForm from "../../hooks/useServiceForm";
import { validateServiceReport } from "../../utils/formValidation/serviceReportValidation/serviceReportValidation";

const ServiceReportModal = () => {
  const { currentUser } = useContext(AuthContext);
  const { formState, updatePrimitiveField } = useForm({ inaccuracyDesc: "" });
  const [inputError, setInputError] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState("");

  const submitForm = async () => {
    const validationResult = await validateServiceReport(formState);
    if (validationResult instanceof Error)
      return setGeneralError("There was an Error with Validation");
    if (!validationResult.valid) return setInputError(validationResult.errors);

    const url = "http://localhost:3500/services/service/report";
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(validationResult.obj),
      headers: { "sContent-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) throw Error(response.statusText);
    console.log(
      "You have successfully submitted the request.  Thankyou for being part of making this space better for everyone"
    );
  };

  return (
    <div className="h-48 w-1/2 overflow-auto text-white">
      <p>
        If you see there are any factual inaccuracies or something could be
        worded better please submit your change and suggestion below. This site
        is still a work in progress and we truly only want accurate and helpful
        information to be recorded. Your suggestion will be reviewed as soon as
        possible by the site admin
      </p>
      <TextAreaInput
        label="A description of the error(s)"
        size={{ cols: 10, rows: 10 }}
        name="inaccuracyDesc"
        value={formState.inaccuracyDesc}
        updateField={updatePrimitiveField}
        inputError={inputError}
      />
    </div>
  );
};

export default ServiceReportModal;
