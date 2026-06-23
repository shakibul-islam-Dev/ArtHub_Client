"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const baseUrl = process.env.NEXT_PUBLIC_URL;

export async function getArtPost() {
  try {
    const res = await fetch(`${baseUrl}/api/artHub/artwork`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Error fetching all artworks:", err);
    return [];
  }
}

// ২. আইডি দিয়ে নির্দিষ্ট একটি আর্টওয়ার্ক সিঙ্গেল পেজে দেখানোর ফাংশন
export async function getSingleArtPost(id) {
  try {
    if (!id) return null;

    const res = await fetch(`${baseUrl}/api/artHub/artwork/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch single artwork");
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.log("Error fetching single artwork:", err);
    return null;
  }
}

// ============== POST REQUESTS ===============

// ৩. নতুন আর্টওয়ার্ক তৈরি করার ফাংশন (Better-Auth সেশন সহ ফিক্সড)
export async function createArtPost(data) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized access! Please login first.",
      };
    }

    const payload = {
      ...data,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role || "artist",
      },
    };

    const res = await fetch(`${baseUrl}/api/artHub/artwork`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Failed to create new artwork",
      };
    }

    const resData = await res.json();

    return {
      success: true,
      message: "Artwork successfully saved!",
      insertedId: resData.insertedId || resData.id || null,
      data: resData,
    };
  } catch (err) {
    console.log("Server Action Error:", err);
    return {
      success: false,
      message: "Server Connection Failed",
    };
  }
}

// ============== PUT (UPDATE) REQUESTS ===============

export async function updateArtPost(id, data) {
  try {
    if (!id) return { success: false, message: "Artwork ID is required" };

    // ১. Better-Auth Session Validation
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized access! Please login first.",
      };
    }

    // ২. Payload ready kora (Ager motoi secure user objectসহ)
    const payload = {
      ...data,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role || "artist",
      },
    };

    // ৩. PUT Method diye backend api te hit kora
    const res = await fetch(`${baseUrl}/api/artHub/artwork/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Failed to update artwork",
      };
    }

    const resData = await res.json();
    return {
      success: true,
      message: resData.message || "Artwork updated successfully!",
      modifiedCount: resData.modifiedCount || null,
    };
  } catch (err) {
    console.log("Server Action PUT Error:", err);
    return {
      success: false,
      message: "Server Connection Failed",
    };
  }
}

// ============== DELETE REQUESTS ===============

export async function deleteArtPost(id) {
  try {
    if (!id) return { success: false, message: "Artwork ID is required" };

    // ১. Better-Auth Session Validation (Keu jeno unauthorized delete na korte pare)
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized access! Please login first.",
      };
    }

    // ২. DELETE Method diye backend api te hit kora
    const res = await fetch(`${baseUrl}/api/artHub/artwork/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Failed to delete artwork",
      };
    }

    const resData = await res.json();
    return {
      success: true,
      message: resData.message || "Artwork deleted successfully!",
      deletedCount: resData.deletedCount || null,
    };
  } catch (err) {
    console.log("Server Action DELETE Error:", err);
    return {
      success: false,
      message: "Server Connection Failed",
    };
  }
}
