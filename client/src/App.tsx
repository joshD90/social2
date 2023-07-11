import { Routes, Route } from "react-router-dom";

import PrimaryLayout from "./pages/primaryLayout/PrimaryLayout";
import ServiceForm from "./pages/serviceForm/ServiceForm";

const App = () => {
  return (
    <Routes>
      <Route path="/services" element={<PrimaryLayout />} />
      <Route path="/services/:category" element={<PrimaryLayout />} />
      <Route path="/create/service" element={<ServiceForm />} />
    </Routes>
  );
};

export default App;
