const baseUrl = process.env.NEXT_PUBLIC_URL;

const getCreateArts = async (artist_id) => {
  const res = await fetch(
    `${baseUrl}/api/artHub/artwork?artist_id=${artist_id}`,
  );
  return res.json();
};

export default getCreateArts;
