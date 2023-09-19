import { FC, useState } from "react";
import { MdReportProblem } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ServiceReportModal from "../serviceReportModal/ServiceReportModal";

type Props = { backClickPath: string | number; serviceId: string | boolean };

const ServiceOverlay: FC<Props> = ({ backClickPath, serviceId }) => {
  const [reportModalVis, setReportModalVis] = useState(false);
  const navigate = useNavigate();

  const toggleReportModalVis = () => {
    setReportModalVis((prev) => !prev);
  };
  //when dynamically passing -1 to navigate it is not recognised in the typing
  const handleBackClick = () => {
    if (typeof backClickPath === "number") {
      navigate(-1);
    } else {
      navigate(backClickPath);
    }
  };

  return (
    <div>
      <button
        className="p-2 bg-green-500 rounded-md hover:bg-green-400 absolute left-2 top-3 text-stone-800"
        onClick={handleBackClick}
      >
        Back
      </button>
      <button
        className="absolute right-4 text-stone-50 text-2xl hover:text-yellow-400 cursor-pointer top-3"
        title="Notice Some Details Wrong with this Service?"
        onClick={toggleReportModalVis}
      >
        <MdReportProblem />
      </button>
      {reportModalVis && (
        <div className="fixed top-0 left-0">
          <ServiceReportModal
            serviceId={serviceId}
            setVisible={setReportModalVis}
          />
        </div>
      )}
    </div>
  );
};

export default ServiceOverlay;
