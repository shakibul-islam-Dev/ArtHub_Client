"use server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
const baseUrl = process.env.NEXT_PUBLIC_URL;
//Art new create er jonno
export const createNewArt = async (newArtData) => {
  const res = await fetch(`${baseUrl}/api/artHub/artwork`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newArtData),
  });
  return res.json();
};

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

export async function updateArtPost(id, data) {
  try {
    if (!id) return { success: false, message: "Artwork ID is required" };

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized access! Please login first.",
      };
    }

    // আপডেটের সময়ও artist_id এবং সেফটি ইউজার অবজেক্ট পাস করা হচ্ছে
    const payload = {
      ...data,
      artist_id: data.artist_id || session.user.id || session.user._id,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role || "artist",
      },
    };

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
      data: resData.data || null,
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

// ৫. আর্টওয়ার্ক ডিলিট করার ফাংশন
export async function deleteArtPost(id) {
  try {
    if (!id) return { success: false, message: "Artwork ID is required" };

    // ১. headers এবং auth ইমপোর্ট না থাকায় এখানে এরর আসছিল
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        message: "Unauthorized access! Please login first.",
      };
    }

    // ২. ডিলিট রিকোয়েস্ট পাঠানো হচ্ছে
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

    // ৩. ডিলিট সফল হলে Next.js এর ক্যাশ রিসেট করা হচ্ছে যেন UI-তে সাথে সাথে আপডেট হয়
    revalidatePath("/dashboard/artist/artworks");

    return {
      success: true,
      message: resData.message || "Artwork deleted successfully!",
    };
  } catch (err) {
    console.log("Server Action DELETE Error:", err);
    return {
      success: false,
      message: "Server Connection Failed",
    };
  }
}

// উদাহরণ: src/app/api/artHub/artwork/[id]/route.js
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // Next.js 15+ এ এটিawait করতে হয়

    // এখানে আপনার আসল ডাটাবেজ ডিলিট কুয়েরি লিখবেন, যেমন:
    // await db.artwork.delete(id);

    return NextResponse.json({
      message: "Deleted successfully from Database!",
    });
  } catch (error) {
    return NextResponse.json({ message: "DB Error" }, { status: 500 });
  }
}
