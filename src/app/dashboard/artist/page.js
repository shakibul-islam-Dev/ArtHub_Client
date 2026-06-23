"use client";

import React from "react";
import { Table } from "@heroui/react";
import { LayoutGrid } from "lucide-react";

const ArtistDashboardPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-foreground transition-colors">
      {/* ================= HEROUI DASHBOARD HEADER ================= */}
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

      {/* ================= TABLE LAYER WITH RESPONSIVE CONTAINER ================= */}
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
                <Table.Row className="hover:bg-muted/40 transition-colors border-b border-border/60 last:border-0">
                  <Table.Cell className="font-medium text-foreground">
                    Kate Moore
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-foreground/90">
                    $50
                  </Table.Cell>
                  <Table.Cell className="text-blue-600 dark:text-blue-400 hover:opacity-80 cursor-pointer font-medium transition-opacity">
                    Edit
                  </Table.Cell>
                  <Table.Cell className="text-destructive hover:opacity-80 cursor-pointer font-medium transition-opacity">
                    Delete
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
};

export default ArtistDashboardPage;
