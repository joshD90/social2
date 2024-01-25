import { Routes, Route } from "react-router-dom";

import PrimaryLayout from "./pages/primaryLayout/PrimaryLayout";
import ServiceForm from "./pages/serviceForm/ServiceForm";
import AdminServicesView from "./pages/admin/adminServicesView/AdminServicesView";
import AuthWrapper from "./pages/auth/authWrapper/AuthWrapper";
import SignUp from "./pages/auth/signup/SignUp";
import SignIn from "./pages/auth/signin/SignIn";
import AdminProtectedWrapper from "./components/admin/adminProtectedWrapper/AdminProtectedWrapper";
import AdminLanding from "./components/admin/adminLanding/AdminLanding";
import AdminServiceWrapper from "./components/admin/adminServiceWrapper/AdminServiceWrapper";
import CategoryLanding from "./pages/categoryLanding/CategoryLanding";
import ServiceDisplayContainer from "./pages/serviceDisplayContainer/ServiceDisplayContainer";
import SearchResultsContainer from "./pages/searchResults/searchResultsContainer/SearchResultsContainer";
import AdminUsersView from "./pages/admin/adminUsersView/AdminUsersView";
import UploadImageS3Test from "./pages/uploadImageS3Test/UploadImageS3Test";
import SignupExplainer from "./pages/auth/signupExplainer/signupExplainer";
import EmailConfirm from "./pages/auth/emailConfirm/EmailConfirm";
import TriggerForgottenPassword from "./pages/auth/triggerForgottenPassword/TriggerForgottenPassword";
import ResetForgottenPassword from "./pages/auth/resetForgottenPassword/resetForgottenPassword";

const App = () => {
  return (
    <Routes>
      <Route path="/image" element={<UploadImageS3Test />} />
      <Route path="/auth" element={<AuthWrapper />}>
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="signupexplainer" element={<SignupExplainer />} />
        <Route path="mailconfirm" element={<EmailConfirm />} />
        <Route
          path="forgotten-password"
          element={<TriggerForgottenPassword />}
        />
        <Route path="passwordReset" element={<ResetForgottenPassword />} />
      </Route>
      <Route path="/services/*" element={<PrimaryLayout />}>
        <Route index element={<CategoryLanding />} />
        <Route path="search" element={<SearchResultsContainer />} />
        <Route path=":category" element={<CategoryLanding />} />
        <Route
          path=":category/:serviceId"
          element={<ServiceDisplayContainer />}
        />
      </Route>
      <Route path="/admin" element={<AdminProtectedWrapper />}>
        <Route index element={<AdminLanding />} />
        <Route path="users/" element={<AdminUsersView />} />
        <Route path="services/">
          <Route index element={<AdminServicesView />} />
          <Route path="view" element={<AdminServiceWrapper />} />
          <Route path="create" element={<ServiceForm />} />
          <Route path="edit/:serviceId" element={<ServiceForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
