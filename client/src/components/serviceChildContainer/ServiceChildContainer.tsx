import { FC } from "react";
import { ChildService } from "../../types/serviceTypes/Service";
import { useNavigate } from "react-router-dom";
import { ThemeColor } from "../../types/themeColorTypes/themeColorTypes";
import { twThemeColors } from "../../assets/themeColors/twThemeColors";

type Props = { childServices: ChildService[]; themeColor: ThemeColor };

const ServiceChildContainer: FC<Props> = ({ childServices, themeColor }) => {
  const navigate = useNavigate();

  const handleNavigate = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const forwardTo = e.target.value;
    const service = childServices.find(
      (service) => service.forwardTo === forwardTo
    );
    if (!service) return;
    navigate(`/services/${service.category}/${service.name}?id=${service.id}`);
  };
  return (
    <div
      className={`${twThemeColors.border[themeColor]} border-solid border-2 bg-stone-50 text-stone-800 flex flex-col my-2 rounded-sm`}
    >
      <label
        htmlFor="serviceChidren"
        className="bg-stone-400 text-stone-900 p-2"
      >
        Services contained within this service
      </label>
      <select
        id="serviceChildren"
        className="text-stone-800 bg-stone-50 py-1 h-full"
        defaultValue={"selectService"}
        onChange={handleNavigate}
      >
        <option value="selectService" disabled>
          Select Service
        </option>
        {childServices.map((service) => (
          <option key={service.id} value={service.forwardTo}>
            {service.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceChildContainer;
