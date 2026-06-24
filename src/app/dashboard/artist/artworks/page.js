import { getUserSession } from "@/lib/core/session";
import ManageArtWorks from "./manage-artwork";

const MangeArtworkPage = async () => {
  const user = await getUserSession();

  const currentArtistId =
    user?.id || user?._id || user?.user?.id || user?.user?._id;

  const DATABASE_API_URL = process.env.NEXT_PUBLIC_URL;
  let artistArtworks = [];

  if (currentArtistId) {
    try {
      const res = await fetch(
        `${DATABASE_API_URL}/api/artHub/artwork?artist_id=${currentArtistId}`,
        {
          cache: "no-store",
        },
      );

      if (res.ok) {
        const result = await res.json();

        artistArtworks = result.data || result;
      }
    } catch (error) {
      console.error(
        "Express backend থেকে আর্টিস্টের আর্টওয়ার্ক আনতে সমস্যা হয়েছে:",
        error,
      );
    }
  }
  return (
    <div>
      <ManageArtWorks
        userData={user}
        initialArtworks={artistArtworks}
      ></ManageArtWorks>
    </div>
  );
};

export default MangeArtworkPage;
