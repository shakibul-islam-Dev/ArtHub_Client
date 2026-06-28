"use client";

import { useState, useEffect } from "react";
import { Button, Modal } from "@heroui/react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Image as ImageIcon,
  Trash2,
  FolderEdit,
  Loader2,
  Plus,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const ManageArtWorks = ({ userData }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [modalType, setModalType] = useState(null);
  const [activeArt, setActiveArt] = useState(null);

  const artistId =
    userData?.id || userData?._id || userData?.user?.id || userData?.user?._id;
  const artistName = userData?.name || userData?.user?.name || "Unknown";

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!artistId) return;
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/arthub/artwork?artist_id=${artistId}`,
          { cache: "no-store" },
        );
        const allArtworks = await res.json();
        const targetData = Array.isArray(allArtworks)
          ? allArtworks
          : allArtworks.data || [];

        setArtworks(targetData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load artworks!");
      } finally {
        setLoading(false);
      }
    };
    fetchArtworks();
  }, [artistId]);

  const closeModal = () => {
    setModalType(null);
    setActiveArt(null);
  };

  const handleDelete = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const targetId = activeArt?._id;
    if (!targetId) {
      toast.error("Artwork reference missing!");
      return;
    }

    try {
      setDeletingId(targetId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/arthub/artwork/${targetId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (response.ok && (result.success || result.deletedCount > 0)) {
        toast.success(result.message || "Artwork deleted successfully");
        setArtworks((prev) => prev.filter((art) => art._id !== targetId));
        closeModal();
      } else {
        toast.error(result?.message || "Failed to delete artwork!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Server connection failed!");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">
          Art Hub Data Is Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 text-foreground transition-colors">
      <div className="flex justify-between items-center border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Manage Artworks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Artist: {artistName}
          </p>
        </div>
        <Link href="/dashboard/artist/add-artworks" passHref>
          <Button
            color="primary"
            variant="shadow"
            className="gap-2 font-medium"
            startContent={<Plus size={18} />}
          >
            Add New Art
          </Button>
        </Link>
      </div>

      {artworks.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-2xl bg-muted/10 backdrop-blur-sm">
          <ImageIcon
            size={44}
            className="mx-auto text-muted-foreground/60 mb-3"
          />
          <p className="text-muted-foreground font-medium text-lg">
            There are no artworks found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artworks.map((art) => (
            <Card
              key={art._id}
              className="overflow-hidden border border-border bg-card text-card-foreground rounded-xl flex flex-col shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative w-full aspect-[4/3] bg-muted/30 overflow-hidden group">
                <Image
                  src={art.image_url || "/placeholder.jpg"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={art.title}
                  unoptimized
                />

                <div className="absolute top-2 left-2 z-10">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded shadow-sm ${
                      art.status === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {art.status || "pending"}
                  </span>
                </div>
              </div>
              <CardContent className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3
                    className="font-bold text-foreground text-base truncate"
                    title={art.title}
                  >
                    {art.title}
                  </h3>
                  <div className="flex justify-between items-center text-xs mt-2">
                    <span className="px-2.5 py-1 rounded-full bg-secondary/20 text-secondary-foreground font-medium capitalize">
                      {art.category}
                    </span>
                    <span className="font-bold text-foreground text-base">
                      ${art.price}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
                  <Button
                    variant="bordered"
                    size="sm"
                    className="w-full gap-1.5 h-9 font-medium"
                    onClick={() => {
                      setActiveArt(art);
                      setModalType("edit");
                    }}
                  >
                    <FolderEdit size={14} /> Edit
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    size="sm"
                    isDisabled={deletingId === art._id}
                    onClick={() => {
                      setActiveArt(art);
                      setModalType("delete");
                    }}
                    className="gap-1.5 h-9 font-medium"
                  >
                    {deletingId === art._id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    {deletingId === art._id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalType !== null} onClose={closeModal}>
        <Modal.Backdrop className="backdrop-blur-md bg-overlay/30">
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[420px] border border-divider bg-background text-foreground shadow-2xl rounded-2xl">
              <Modal.CloseTrigger onClick={closeModal} />
              <Modal.Header className="flex gap-3 items-center">
                <Modal.Icon
                  className="rounded-full p-2.5 bg-default-100 text-default-600"
                  data-danger={modalType === "delete" ? "true" : undefined}
                >
                  <AlertTriangle
                    className={
                      modalType === "delete"
                        ? "text-danger size-5"
                        : "text-warning size-5"
                    }
                  />
                </Modal.Icon>
                <Modal.Heading className="text-lg font-bold tracking-tight">
                  {modalType === "delete"
                    ? "Confirm Deletion"
                    : "Confirm Modification"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {modalType === "delete"
                    ? `Are you sure you want to permanently delete "${activeArt?.title}"? This action cannot be undone.`
                    : `Do you want to proceed to the editing dashboard for "${activeArt?.title}"?`}
                </p>
              </Modal.Body>
              <Modal.Footer className="flex gap-2.5 justify-end">
                <Button
                  variant="light"
                  onClick={closeModal}
                  className="font-medium"
                  isDisabled={deletingId !== null}
                >
                  Cancel
                </Button>
                {modalType === "delete" ? (
                  <Button
                    color="danger"
                    variant="shadow"
                    onClick={(e) => handleDelete(e)}
                    className="font-semibold"
                    isLoading={deletingId !== null}
                  >
                    Yes, Delete
                  </Button>
                ) : (
                  <Link
                    href={`/dashboard/artist/edit-artworks/${activeArt?._id}`}
                    passHref
                    className="w-auto"
                    onClick={closeModal}
                  >
                    <Button
                      color="warning"
                      variant="shadow"
                      className="font-semibold"
                    >
                      Proceed to Edit
                    </Button>
                  </Link>
                )}
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default ManageArtWorks;
