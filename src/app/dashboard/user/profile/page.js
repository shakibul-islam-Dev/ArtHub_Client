import ProfileUpdateForm from "@/app/settings/ProfileUpdateForm";

const ProfilePage = async ({ params }) => {
  return <ProfileUpdateForm initialData={userData} userId={id} />;
};
export default ProfilePage;
