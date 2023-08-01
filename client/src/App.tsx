import { Routes, Route } from "react-router-dom";

import PrimaryLayout from "./pages/primaryLayout/PrimaryLayout";
import ServiceForm from "./pages/serviceForm/ServiceForm";
import AdminServicesView from "./pages/admin/adminServicesView/AdminServicesView";
import AuthWrapper from "./pages/auth/authWrapper/AuthWrapper";
import SignUp from "./pages/auth/signup/SignUp";
import SignIn from "./pages/auth/signin/SignIn";
import AdminProtectedWrapper from "./components/admin/adminProtectedWrapper/AdminProtectedWrapper";
import AdminLanding from "./components/admin/adminLanding/AdminLanding";

const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthWrapper />}>
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
      </Route>
      <Route path="/services/*" element={<PrimaryLayout />}>
        <Route path=":category" />
        <Route path=":category/:serviceId" />
      </Route>
      <Route path="/admin" element={<AdminProtectedWrapper />}>
        <Route index element={<AdminLanding />} />
        <Route path="services/">
          <Route index element={<AdminServicesView />} />
          <Route path="create" element={<ServiceForm />} />
          <Route path="edit/:serviceId" element={<ServiceForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
