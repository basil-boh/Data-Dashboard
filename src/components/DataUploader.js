import React, { useRef } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const DataUploader = ({ onDataUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          onDataUpload(results.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          alert('Error parsing CSV file. Please check the format.');
        }
      });
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(worksheet);
          onDataUpload(parsedData);
        } catch (error) {
          console.error('Error parsing Excel:', error);
          alert('Error parsing Excel file. Please check the format.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Unsupported file format. Please upload a CSV or Excel file.');
    }
  };

  return (
    <Card className="data-upload">
      <Card.Body>
        <Card.Title>Upload Data</Card.Title>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload a CSV or Excel file</Form.Label>
          <Form.Control 
            type="file" 
            accept=".csv, .xlsx, .xls" 
            onChange={handleFileUpload}
            ref={fileInputRef}
          />
        </Form.Group>
        <Button 
          variant="outline-secondary" 
          size="sm"
          onClick={() => fileInputRef.current.click()}
        >
          Browse Files
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DataUploader;