import FormSubSelector from "./components/formSubSelector/FormSubSelector";
import PrimitiveInput from "./microcomponents/inputs/PrimitiveInput";
import ServiceForm from "./pages/serviceForm/ServiceForm";

const App = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-red-500 basis-0.5">
      <ServiceForm />
    </div>
  );
};

export default App;
