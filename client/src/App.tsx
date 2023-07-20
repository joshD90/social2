import { Routes, Route } from "react-router-dom";

import PrimaryLayout from "./pages/primaryLayout/PrimaryLayout";
import ServiceForm from "./pages/serviceForm/ServiceForm";
import AdminServicesView from "./pages/admin/adminServicesView/adminServicesView";

const App = () => {
  return (
    <Routes>
      <Route path="/services" element={<PrimaryLayout />} />
      <Route path="/services/:category" element={<PrimaryLayout />} />
      <Route
        path="/services/:category/:serviceId"
        element={<PrimaryLayout />}
      />
      <Route path="/create/service" element={<ServiceForm />} />
      <Route path="/admin/services" element={<AdminServicesView />} />
    </Routes>
  );
};

export default App;
