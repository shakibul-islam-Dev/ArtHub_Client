import ProfileUpdateForm from "./ProfileUpdateForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const UserProfilePage = async ({ params }) => {
  // Next.js 15+ স্ট্যান্ডার্ড অনুযায়ী params রেজলভ করা হলো
  const resolvedParams = await params;
  let id = resolvedParams?.id;
  let userData = null;
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!id && session?.user) {
      id = session.user.id || session.user._id;
    }
  } catch (authError) {
    console.error("Auth session fetch error:", authError);
  }

  if (id) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/artHub/users/${id}`, {
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        userData = data?.success ? data.data : data;
      }
    } catch (error) {
      console.error("Error fetching user data on server:", error);
    }
  }

  if (
    !userData &&
    session?.user &&
    (session.user.id === id || session.user._id === id)
  ) {
    userData = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image || session.user.image_url,
      role: session.user.role,
    };
  }

  return (
    <div className="w-full min-h-screen p-4 md:p-6 bg-background">
      <ProfileUpdateForm initialData={userData} userId={id} />
    </div>
  );
};

export default UserProfilePage;
