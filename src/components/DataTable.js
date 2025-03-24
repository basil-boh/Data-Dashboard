import React from 'react';
import { Table, Card } from 'react-bootstrap';

const DataTable = ({ data, columns }) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Data Preview</Card.Title>
        <div style={{ overflowX: 'auto' }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                {columns.map(column => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {columns.map(column => (
                    <td key={`${index}-${column}`}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DataTable;