import ManageArtWorks from "./manage-artwork";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
const MangeArtworkPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const currentArtistId = user?.id;

  const DATABASE_API_URL = process.env.NEXT_PUBLIC_URL;
  let artistArtworks = [];

  if (currentArtistId) {
    try {
      const res = await fetch(
        `${DATABASE_API_URL}/api/arthub/artwork?artist_id=${currentArtistId}`,
        {
          cache: "no-store",
        },
      );

      if (res.ok) {
        const result = await res.json();
        artistArtworks = result.data || result;
      }
    } catch (error) {
      console.error("Error fetching artist artworks:", error);
    }
  }

  return (
    <div>
      <ManageArtWorks userData={user} initialArtworks={artistArtworks} />
    </div>
  );
};

export default MangeArtworkPage;
