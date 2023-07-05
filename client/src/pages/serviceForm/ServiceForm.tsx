import BaseServiceForm from "../../components/serviceForm/BaseServiceForm";
import PrimitiveInput from "../../microcomponents/inputs/PrimitiveInput";

const ServiceForm = () => {
  return (
    <section className="w-full p-5">
      <BaseServiceForm />
      <div className="flex justify-end w-full">
        <button className="p-2 bg-stone-500 rounded-md hover:bg-stone-400">
          Next
        </button>
      </div>
    </section>
  );
};

export default ServiceForm;
