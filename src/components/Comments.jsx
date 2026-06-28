"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Trash2, Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Comments({
  artworkId,
  initialComments = [],
  onCommentsUpdate,
}) {
  const apiUrl = process.env.NEXT_PUBLIC_URL || "";
  const router = useRouter();

  const { data: session } = authClient.useSession();

  // সম্পূর্ণ স্টেট বেসড কমেন্ট ম্যানেজমেন্ট
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const getHeaders = () => {
    const headers = {
      "Content-Type": "application/json",
    };

    const token =
      session?.token || session?.accessToken || session?.session?.token;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  };

  // ======================== CREATE COMMENT ========================
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
      return;
    }
    if (!newComment.trim()) return;

    const userId = session.user.id || session.user._id;
    const userRole = session.user.role || "user";
    const userName = session.user.name || session.user.username || "Anonymous";

    try {
      const res = await fetch(`${apiUrl}/api/arthub/comment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          comment: newComment,
          artwork_id: artworkId,
          user: {
            id: userId,
            role: userRole,
          },
        }),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        const savedComment = resData.data;
        const commentWithUser = {
          ...savedComment,
          userId: userId,
          username: userName,
          createdAt: savedComment.createdAt || new Date().toISOString(),
        };

        const updatedComments = [...comments, commentWithUser];
        setComments(updatedComments);
        setNewComment("");
        if (onCommentsUpdate) onCommentsUpdate(updatedComments);
      } else {
        alert(resData.message || "Failed to post comment");
      }
    } catch (err) {
      console.error("Comment post error:", err);
    }
  };

  // ======================== UPDATE COMMENT (STATE BASED) ========================
  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;

    const userId = session?.user?.id || session?.user?._id;
    const userRole = session?.user?.role || "user";

    try {
      const res = await fetch(`${apiUrl}/api/arthub/comment/${commentId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          comment: editingText,
          artwork_id: artworkId,
          user: {
            id: userId,
            role: userRole,
          },
        }),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        // কোনো এক্সট্রা ফেচ ছাড়া সরাসরি স্টেট আপডেট
        const updatedComments = comments.map((c) =>
          c._id === commentId ? { ...c, comment: editingText } : c,
        );
        setComments(updatedComments);
        setEditingCommentId(null);
        setEditingText("");
        if (onCommentsUpdate) onCommentsUpdate(updatedComments);
      } else {
        alert(resData.message || "Failed to update comment");
      }
    } catch (err) {
      console.error("Comment edit error:", err);
    }
  };

  // ======================== DELETE COMMENT (STATE BASED) ========================
  const triggerDelete = (commentId) => {
    setItemToDelete(commentId);
    setIsModalOpen(true);
  };

  const confirmDeleteAction = async () => {
    if (!itemToDelete) return;

    try {
      const res = await fetch(`${apiUrl}/api/arthub/comment/${itemToDelete}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const resData = await res.json();

      if (res.ok && (resData.success || res.status === 200)) {
        // ডিলিট হওয়ার পর ফিল্টার করে স্টেট থেকে রিমুভ (No Re-fetch)
        const updatedComments = comments.filter((c) => c._id !== itemToDelete);
        setComments(updatedComments);
        if (onCommentsUpdate) onCommentsUpdate(updatedComments);
        setIsModalOpen(false);
        setItemToDelete(null);
      } else {
        alert(resData.message || "Failed to delete comment");
      }
    } catch (err) {
      console.error("Comment delete error:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800/80 shadow-lg p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Community Discussion ({comments.length})
        </h2>
      </div>

      <form onSubmit={handleCommentSubmit} className="mb-8 space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={
            session?.user
              ? "Share your thoughts about this artwork..."
              : "Please log in to comment..."
          }
          disabled={!session?.user}
          rows={3}
          className="w-full p-3.5 bg-gray-50/50 dark:bg-gray-950/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all resize-none disabled:opacity-60"
          required
        />
        {session?.user && (
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 font-semibold rounded-xl px-5 transition-all shadow-sm"
            >
              Comment
            </Button>
          </div>
        )}
      </form>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">
            No comments posted yet.
          </p>
        ) : (
          comments.map((comment) => {
            const currentUserId = String(
              session?.user?.id || session?.user?._id || "",
            );
            const targetCommentUserId = String(
              comment.userId || comment.user?.id || "",
            );
            const isCommentOwner =
              currentUserId &&
              targetCommentUserId &&
              currentUserId === targetCommentUserId;
            const isEditing = editingCommentId === comment._id;

            return (
              <div
                key={comment._id}
                className="p-4 bg-gray-50/60 dark:bg-gray-950/40 rounded-xl border border-gray-100 dark:border-gray-800/80 space-y-2.5 transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-gray-200">
                    {comment.username || comment.user?.name || "Anonymous"}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                      {comment.createdAt &&
                        new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                    </span>

                    {isCommentOwner && !isEditing && (
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditingText(comment.comment || "");
                          }}
                          className="p-1 text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
                          title="Edit comment"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerDelete(comment._id)}
                          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  {isEditing ? (
                    <div className="w-full space-y-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 dark:text-white"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCommentId(null)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md transition-all cursor-pointer"
                        >
                          <X size={12} /> Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditComment(comment._id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all cursor-pointer"
                        >
                          <Check size={12} /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex-1 break-words leading-relaxed">
                      {comment.comment}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4 transition-all transform scale-100">
            <div className="text-center sm:text-left space-y-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                Confirm Deletion
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Are you sure you want to delete this comment? This action cannot
                be undone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setItemToDelete(null);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium text-sm rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
