"use client";

import React from "react";
import { Table } from "@heroui/react";

const purchases = [
  {
    id: 1,
    artwork: "Sunset Dreams",
    artist: "John Smith",
    price: "$120",
    purchaseDate: "21 Jun 2026",
  },
  {
    id: 2,
    artwork: "Ocean View",
    artist: "Emma Wilson",
    price: "$95",
    purchaseDate: "18 Jun 2026",
  },
  {
    id: 3,
    artwork: "Abstract Light",
    artist: "Michael Brown",
    price: "$150",
    purchaseDate: "15 Jun 2026",
  },
];

const PurchasedHistoryPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 min-h-screen transition-colors duration-300">
      {/* Header section */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-3xl">
          Purchase History
        </h1>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          A detailed record of all your acquired art pieces and transactions.
        </p>
      </div>

      {/* Styled Responsive Wrapper for HeroUI Table Component */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden p-2">
        <Table>
          <Table.ScrollContainer className="w-full overflow-x-auto no-scrollbar">
            <Table.Content
              aria-label="Purchase history table"
              className="min-w-[800px] text-neutral-800 dark:text-neutral-200"
            >
              <Table.Header className="bg-neutral-50 dark:bg-neutral-900">
                <Table.Column
                  isRowHeader
                  className="text-neutral-600 dark:text-neutral-300 font-semibold py-3.5"
                >
                  Artwork Name
                </Table.Column>
                <Table.Column className="text-neutral-600 dark:text-neutral-300 font-semibold py-3.5">
                  Artist
                </Table.Column>
                <Table.Column className="text-neutral-600 dark:text-neutral-300 font-semibold py-3.5">
                  Price
                </Table.Column>
                <Table.Column className="text-neutral-600 dark:text-neutral-300 font-semibold py-3.5">
                  Purchase Date
                </Table.Column>
              </Table.Header>

              <Table.Body>
                {purchases.map((item) => (
                  <Table.Row
                    key={item.id}
                    className="border-b border-neutral-100 dark:border-neutral-900 last:border-none hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-colors"
                  >
                    <Table.Cell className="font-medium text-neutral-950 dark:text-neutral-100 py-4">
                      {item.artwork}
                    </Table.Cell>
                    <Table.Cell className="text-neutral-600 dark:text-neutral-400">
                      {item.artist}
                    </Table.Cell>
                    <Table.Cell className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.price}
                    </Table.Cell>
                    <Table.Cell className="text-neutral-500 dark:text-neutral-400">
                      {item.purchaseDate}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  );
};

export default PurchasedHistoryPage;
