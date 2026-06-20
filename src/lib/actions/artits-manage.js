const baseUrl = process.env.NEXT_PUBLIC_URL;
export async function manageArtPost(adata) {
  try {
    const res = await fetch(`${baseUrl / api / manage - art}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adata),
    });
  } catch (err) {
    console.log(err);
  }
}
