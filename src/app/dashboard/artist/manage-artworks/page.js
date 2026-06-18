"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ArtworkForm from "@/components/dashboards/artist/ArtworkForm";
import Image from "next/image";

const ManageArtWorks = () => {
  const [artworks, setArtworks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingArt, setEditingArt] = useState(null);

  const handleSaveArtwork = (data) => {
    if (editingArt) {
      setArtworks(
        artworks.map((a) =>
          a.id === editingArt.id ? { ...data, id: editingArt.id } : a,
        ),
      );
    } else {
      setArtworks([...artworks, { ...data, id: Date.now() }]);
    }
    setOpen(false);
    setEditingArt(null);
  };

  const deleteArtwork = (id) => {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <Card key={art.id} className="overflow-hidden">
            <Image
              src={art.imageUrl}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
              alt={art.title}
            />
            <CardContent className="p-4">
              <h3 className="font-bold text-lg">{art.title}</h3>
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
    </div>
  );
};

export default ManageArtWorks;
