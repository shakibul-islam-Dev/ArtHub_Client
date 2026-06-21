"use client";

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
    <div className="rounded-xl border p-6 bg-background">
      <h1 className="text-2xl font-bold mb-6">Purchase History</h1>

      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Purchase history table"
            className="min-w-[800px]"
          >
            <Table.Header>
              <Table.Column isRowHeader>Artwork Name</Table.Column>
              <Table.Column>Artist</Table.Column>
              <Table.Column>Price</Table.Column>
              <Table.Column>Purchase Date</Table.Column>
            </Table.Header>

            <Table.Body>
              {purchases.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.artwork}</Table.Cell>
                  <Table.Cell>{item.artist}</Table.Cell>
                  <Table.Cell>{item.price}</Table.Cell>
                  <Table.Cell>{item.purchaseDate}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
};

export default PurchasedHistoryPage;
