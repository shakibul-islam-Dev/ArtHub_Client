"use server";

export async function authFetchMiddleware(userId, token) {
  if (!userId || !token || token === "null" || token === "undefined") {
    return { success: false, message: "Missing or invalid userId/token" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL;

  try {
    const response = await fetch(`${baseUrl}/api/arthub/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Backend authentication failed",
      };
    }

    return {
      success: true,
      user: data.data,
    };
  } catch (error) {
    console.error("Server Action Fetch Error:", error);
    return { success: false, message: "Could not connect to backend server" };
  }
}
