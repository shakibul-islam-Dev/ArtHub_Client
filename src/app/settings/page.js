import ProfileUpdateForm from "@/components/ProfileUpdateForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_URL;
  let userData = null;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const loggedInUser = session?.user;

  // ❌ ভুল ১ ও ২ ফিক্সড: রিটার্নের আগে রিডাইরেক্ট করতে হবে অথবা শুধু রিডাইরেক্ট রাখলেই চলে
  if (!loggedInUser) {
    redirect("/login");
  }

  try {
    // ❌ ভুল ৩ ফিক্সড: আপনার এক্সপ্রেস রাউটার (/:id) অনুযায়ী কোয়েরি প্যারাম বাদ দিয়ে ডাইরেক্ট স্ল্যাশ দিয়ে আইডি পাস করা হলো
    const res = await fetch(`${apiUrl}/api/arthub/user/${loggedInUser.id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      userData = await res.json();
    }
  } catch (error) {
    console.error("Express backend থেকে ডাটা ফেচ করতে সমস্যা হয়েছে:", error);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        প্রোফাইল সেটিংস ({loggedInUser.role || "User"})
      </h1>

      <ProfileUpdateForm
        initialData={userData || loggedInUser}
        userId={loggedInUser.id}
        role={loggedInUser.role}
      />
    </div>
  );
}
