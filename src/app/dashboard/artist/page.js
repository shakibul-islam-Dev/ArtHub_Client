"use client";

import React, { useEffect, useState } from "react";
import { Table } from "@heroui/react";
import { LayoutGrid } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const ArtistDashboardPage = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const DATABASE_API_URL = process.env.NEXT_PUBLIC_URL;

    async function fetchData() {
      if (session === null) {
        setLoading(false);
        router.push("/login");
        return;
      }

      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const res = await fetch(
          `${DATABASE_API_URL}/api/arthub/artwork?artist_id=${session.user.id}`,
          {
            cache: "no-store",
          },
        );

        if (res.ok) {
          const result = await res.json();
          const fetchedData = result.data || result;
          setArtworks(Array.isArray(fetchedData) ? fetchedData : []);
        } else {
          console.error("Failed to fetch artworks from API");
        }
      } catch (error) {
        console.error("Error fetching artworks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [session, router]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-foreground transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-5 border border-border rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-muted rounded-lg text-muted-foreground hidden xs:block">
            <LayoutGrid size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Artist Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Overview and manage your published artwork collection.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm text-card-foreground">
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Published artworks"
              className="min-w-[600px] md:min-w-full"
            >
              <Table.Header className="[&_th]:bg-muted/50 [&_th]:text-muted-foreground [&_th]:border-b [&_th]:border-border">
                <Table.Column isRowHeader>Title</Table.Column>
                <Table.Column>Price</Table.Column>
                <Table.Column>Edit</Table.Column>
                <Table.Column>Delete</Table.Column>
              </Table.Header>
              <Table.Body>
                {loading ? (
                  <Table.Row>
                    <Table.Cell colSpan={4} className="text-center py-4">
                      Loading...
                    </Table.Cell>
                  </Table.Row>
                ) : artworks.length > 0 ? (
                  artworks.map((art) => (
                    <Table.Row
                      key={art.id || art._id}
                      className="hover:bg-muted/40 transition-colors border-b border-border/60 last:border-0"
                    >
                      <Table.Cell className="font-medium text-foreground">
                        {art.title}
                      </Table.Cell>
                      <Table.Cell className="font-semibold text-foreground/90">
                        ${art.price}
                      </Table.Cell>
                      <Table.Cell className="text-blue-600 dark:text-blue-400 hover:opacity-80 cursor-pointer font-medium transition-opacity">
                        Edit
                      </Table.Cell>
                      <Table.Cell className="text-destructive hover:opacity-80 cursor-pointer font-medium transition-opacity">
                        Delete
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={4} className="text-center py-4">
                      No artworks found for this user.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
};

export default ArtistDashboardPage;
