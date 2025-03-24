import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const ExportOptions = ({ data, columns }) => {
  const exportToCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'dashboard_data.csv');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, 'dashboard_data.xlsx');
  };

  const exportToJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, 'dashboard_data.json');
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Export Data</Card.Title>
        <div className="d-grid gap-2">
          <Button variant="outline-primary" size="sm" onClick={exportToCSV}>
            Export to CSV
          </Button>
          <Button variant="outline-success" size="sm" onClick={exportToExcel}>
            Export to Excel
          </Button>
          <Button variant="outline-info" size="sm" onClick={exportToJSON}>
            Export to JSON
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExportOptions;