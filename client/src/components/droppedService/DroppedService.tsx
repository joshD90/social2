import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { IService } from "../../types/serviceTypes/Service";

import DisplayTextInfo from "../../microcomponents/displayInfo/DisplayTextInfo";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";

type Props = { serviceInfo: IService; themeColor: ThemeColor };
const DroppedService: FC<Props> = ({ serviceInfo, themeColor }) => {
  const navigate = useNavigate();
  const { category } = useParams();
  return (
    <div className="w-full p-5 flex flex-col justify-start">
      <p className="w-full flex justify-center text-xl font-bold text-stone-50">
        {serviceInfo.name}
      </p>
      <DisplayTextInfo
        name="Contact Number"
        value={serviceInfo.contactNumber}
        themeColor={themeColor}
      />
      <DisplayTextInfo
        name="Contact Email"
        value={serviceInfo.contactEmail}
        themeColor={themeColor}
      />
      <div className="w-full flex justify-end">
        <button
          onClick={() =>
            navigate(
              `/services/${category}/${serviceInfo.forwardTo}?id=${serviceInfo.id}`
            )
          }
          className="p-2 border-none bg-green-700 rounded-md hover:bg-green-600"
        >
          See Full Service
        </button>
      </div>
    </div>
  );
};

export default DroppedService;
