import ProfileUpdateForm from "./ProfileUpdateForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const ArtistProfilePage = async ({ params }) => {
  const resolvedParams = await params;

  let id = resolvedParams?.id;
  let userData = null;

  // ১. কারেন্ট সেশনের ইউজার ডাটা চেক করা
  try {
    const session = await auth.api.getSession({
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

  return (
    <div className="w-full min-h-screen p-4 md:p-6 bg-background">
      <ProfileUpdateForm initialData={userData} userId={id} />
    </div>
  );
};

export default ArtistProfilePage;
