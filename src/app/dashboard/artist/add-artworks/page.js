import React from "react";
import AddProductForm from "./add-artworks";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const AddArtworksPage = async () => {
  let user = null;

  try {
    // ১. Next.js 16+ এ হেডার্স প্রমিজটি আগে রিজলভ (await) করতে হবে
    const reqHeaders = await headers();

    // ২. Better-Auth এর সেশন রিড করা
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    // ৩. সেশন থেকে ইউজার অবজেক্ট নেওয়া
    user = session?.user || null;

    // ডিবাগ করার জন্য টার্মিনালে চেক করতে পারেন ইউজার আসছে কি না
    console.log("=== Server Page Session User ===", user);
  } catch (error) {
    console.error("Better-Auth সেশন গেট করতে সমস্যা হয়েছে:", error);
  }

  return (
    <div>
      {/* শুধুমাত্র বর্তমান লগইন করা ইউজারকে (আর্টিস্ট) প্রপ্স হিসেবে ফর্মে পাঠানো হলো */}
      <AddProductForm artist={user} />
    </div>
  );
};

export default AddArtworksPage;
