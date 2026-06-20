"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { manageArtPost } from "@/lib/actions/artits-manage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ArtworkForm from "@/components/dashboard/artist/ArtworkForm";
import Image from "next/image";

const ManageArtWorks = () => {
  const [artworks, setArtworks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingArt, setEditingArt] = useState(null);

  const handleSaveArtwork = async (data) => {
    try {
      // ১. প্রথমে সার্ভারে ডেটা পাঠান এবং রেসপন্স নিন
      const savedArtwork = await manageArtPost(data);

      // ২. সার্ভার থেকে সফল রেসপন্স আসার পর UI স্টেট আপডেট করুন
      if (editingArt) {
        setArtworks(
          artworks.map((a) =>
            a.id === editingArt.id ? { ...data, id: editingArt.id } : a,
          ),
        );
      } else {
        // যদি আপনার সার্ভার অ্যাকশন নতুন তৈরি হওয়া আর্টওয়ার্ক রিটার্ন করে, তবে savedArtwork ব্যবহার করুন
        // অন্যথায় ব্যাকআপ হিসেবে { ...data, id: Date.now() } রাখতে পারেন
        const newArtwork = savedArtwork || { ...data, id: Date.now() };
        setArtworks([...artworks, newArtwork]);
      }

      // মোডাল বন্ধ এবং ক্লিনআপ
      setOpen(false);
      setEditingArt(null);
    } catch (error) {
      console.error("Failed to save artwork:", error);
      alert("Something went wrong while saving!");
    }
  };

  const deleteArtwork = (id) => {
    // এখানেও ভবিষ্যতে আপনার ডিলিট সার্ভার অ্যাকশন কল করতে হবে
    setArtworks(artworks.filter((a) => a.id !== id));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Manage Artworks</h1>
        <Button
          onClick={() => {
            setEditingArt(null);
            setOpen(true);
          }}
        >
          + Add Artwork
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setEditingArt(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingArt ? "Edit Artwork" : "Add New Artwork"}
            </DialogTitle>
          </DialogHeader>
          <ArtworkForm initialData={editingArt} onSuccess={handleSaveArtwork} />
        </DialogContent>
      </Dialog>

      {artworks.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <p className="text-xl font-medium text-slate-500">
            There are no artworks available.
          </p>
          <Button
            variant="link"
            className="mt-2 text-indigo-600 font-semibold"
            onClick={() => setOpen(true)}
          >
            Add your first artwork now
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <Card
              key={art.id}
              className="overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full h-48">
                <Image
                  src={art.imageUrl || "/placeholder.jpg"} // ইমেজ মিসিং থাকলে ক্র্যাশ রোধে ব্যাকআপ
                  fill
                  className="object-cover"
                  alt={art.title || "Artwork image"}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg truncate">{art.title}</h3>
                <p className="text-sm text-slate-500">{art.category}</p>
                <p className="font-bold text-primary mt-2">${art.price}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingArt(art);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteArtwork(art.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageArtWorks;
