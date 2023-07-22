import { Routes, Route } from "react-router-dom";

import PrimaryLayout from "./pages/primaryLayout/PrimaryLayout";
import ServiceForm from "./pages/serviceForm/ServiceForm";
import AdminServicesView from "./pages/admin/adminServicesView/AdminServicesView";

const App = () => {
  return (
    <Routes>
      <Route path="/services/*" element={<PrimaryLayout />}>
        <Route path=":category" />
        <Route path=":category/:serviceId" />
      </Route>

      <Route path="/admin/services/">
        <Route index element={<AdminServicesView />} />
        <Route path="create" element={<ServiceForm />} />
        <Route path="edit/:serviceId" element={<ServiceForm />} />
      </Route>
    </Routes>
  );
};

export default App;
