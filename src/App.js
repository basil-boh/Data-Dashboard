import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import DataUploader from './components/DataUploader';
import FilterPanel from './components/FilterPanel';
import ChartPanel from './components/ChartPanel';
import DataTable from './components/DataTable';
import ExportOptions from './components/ExportOptions';
import { processData } from './utils/dataProcessor';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState({});
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');

  useEffect(() => {
    if (data.length > 0) {
      applyFilters();
    }
  }, [data, filters]);

  const handleDataUpload = (uploadedData) => {
    const { processedData, dataColumns } = processData(uploadedData);
    setData(processedData);
    setFilteredData(processedData);
    setColumns(dataColumns);
    
    // Set default axes if available
    if (dataColumns.length > 0) {
      setXAxis(dataColumns[0]);
      if (dataColumns.length > 1) {
        setYAxis(dataColumns[1]);
      }
    }
  };

  const applyFilters = () => {
    let result = [...data];
    
    Object.keys(filters).forEach(column => {
      const filterValue = filters[column];
      if (filterValue && filterValue.trim() !== '') {
        result = result.filter(row => {
          const value = String(row[column]).toLowerCase();
          return value.includes(filterValue.toLowerCase());
        });
      }
    });
    
    setFilteredData(result);
  };

  const handleFilterChange = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  const handleAxisChange = (axis, value) => {
    if (axis === 'x') {
      setXAxis(value);
    } else {
      setYAxis(value);
    }
  };

  return (
    <Container fluid className="dashboard-container">
      <h1 className="mb-4">Data Visualization Dashboard</h1>
      
      <Row className="mb-4">
        <Col>
          <DataUploader onDataUpload={handleDataUpload} />
        </Col>
      </Row>
      
      {data.length > 0 && (
        <>
          <Row>
            <Col md={3}>
              <FilterPanel 
                columns={columns} 
                onFilterChange={handleFilterChange} 
                filters={filters}
              />
              <Form.Group className="mb-3">
                <Form.Label>Chart Type</Form.Label>
                <Form.Select 
                  value={chartType}
                  onChange={(e) => handleChartTypeChange(e.target.value)}
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="scatter">Scatter Plot</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>X-Axis</Form.Label>
                <Form.Select 
                  value={xAxis}
                  onChange={(e) => handleAxisChange('x', e.target.value)}
                >
                  {columns.map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Y-Axis</Form.Label>
                <Form.Select 
                  value={yAxis}
                  onChange={(e) => handleAxisChange('y', e.target.value)}
                >
                  {columns.map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <ExportOptions data={filteredData} columns={columns} />
            </Col>
            <Col md={9}>
              <ChartPanel 
                data={filteredData} 
                chartType={chartType}
                xAxis={xAxis}
                yAxis={yAxis}
              />
              <DataTable 
                data={filteredData.slice(0, 10)} 
                columns={columns} 
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default App;