import { Table } from "@heroui/react";

const PurchasedHistoryPage = () => {
  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Team members" className="min-w-[600px]">
          <Table.Header>
            <Table.Column isRowHeader>Art Work Name</Table.Column>
            <Table.Column>Artist</Table.Column>
            <Table.Column>Price</Table.Column>
            <Table.Column>Purchase Date</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Kate Moore</Table.Cell>
              <Table.Cell>CEO</Table.Cell>
              <Table.Cell>Active</Table.Cell>
              <Table.Cell>kate@acme.com</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};

export default PurchasedHistoryPage;
