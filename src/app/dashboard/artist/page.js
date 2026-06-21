"use client";

import React from "react";
import { Table } from "@heroui/react";
import { LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";

const ArtistDashboardPage = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* ================= HEROUI DASHBOARD HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800 hidden xs:block">
            <LayoutGrid size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Artist Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Overview and manage your published artwork collection.
            </p>
          </div>
        </div>
      </div>

      {/* ================= TABLE LAYER WITH RESPONSIVE CONTAINER ================= */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <Table variant="secondary" removeWrapper>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="Team members"
              className="min-w-[600px] md:min-w-full"
            >
              <Table.Header>
                <Table.Column isRowHeader>Titile</Table.Column>
                <Table.Column>Price</Table.Column>
                <Table.Column>Edit</Table.Column>
                <Table.Column>Delete</Table.Column>
              </Table.Header>
              <Table.Body>
                <Table.Row className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <Table.Cell className="font-medium text-slate-900">
                    Kate Moore
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-slate-800">
                    $50
                  </Table.Cell>
                  <Table.Cell className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                    Edit
                  </Table.Cell>
                  <Table.Cell className="text-red-500 hover:text-red-600 cursor-pointer font-medium">
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
