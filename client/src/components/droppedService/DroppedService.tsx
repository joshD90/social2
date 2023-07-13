import { FC } from "react";
import { IService } from "../../types/serviceTypes/Service";
import DisplayTextInfo from "../../microcomponents/displayInfo/DisplayTextInfo";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";

type Props = { serviceInfo: IService; themeColor: ThemeColor };
const DroppedService: FC<Props> = ({ serviceInfo, themeColor }) => {
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
    </div>
  );
};

export default DroppedService;
