import { FC, useContext } from "react";
import { AuthContext } from "../../../context/authContext/AuthContext";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../../components/user/userProfile/UserProfile";
import UserRecentActivity from "../../../components/user/userRecentActivity/UserRecentActivity";

const UserProfileContainer: FC = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(currentUser, "currentUser");

  if (!currentUser.user || currentUser.user.email === "guest@guest.com") {
    console.log("can't view the profile");
    navigate(-1);
    return;
  }

  return (
    <section className="bg-blue-950 w-screen h-screen overflow-auto items-center justify-start flex flex-col gap-10 p-0 md:p-10">
      <UserProfile user={currentUser.user} />
      <UserRecentActivity user={currentUser.user} />
    </section>
  );
};

export default UserProfileContainer;
