import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Nav, Card, Alert } from 'react-bootstrap';
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
  const [activeTab, setActiveTab] = useState('visualization');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (data.length > 0) {
      applyFilters();
      setShowWelcome(false);
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

  const renderWelcomeScreen = () => {
    return (
      <div className="welcome-container">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="welcome-card">
              <Card.Body className="text-center p-5">
                <div className="welcome-icon mb-4">
                  <i className="bi bi-bar-chart-line-fill"></i>
                </div>
                <h1 className="welcome-title">Data Visualization Dashboard</h1>
                <p className="welcome-subtitle">Transform your data into meaningful insights</p>
                
                <hr className="my-4" />
                
                <Row className="features-section text-start">
                  <Col md={4}>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-upload"></i>
                      </div>
                      <h5>Upload Data</h5>
                      <p>Import CSV or Excel files with your data</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-graph-up"></i>
                      </div>
                      <h5>Visualize</h5>
                      <p>Create interactive charts and graphs</p>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="feature-item">
                      <div className="feature-icon">
                        <i className="bi bi-download"></i>
                      </div>
                      <h5>Export</h5>
                      <p>Download your data in various formats</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <Container fluid className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="mb-2">
          <i className="bi bi-bar-chart-line me-2"></i>
          Data Visualization Dashboard
        </h1>
        <p className="text-muted">Upload, visualize, and analyze your data with interactive charts</p>
      </div>
      
      <Row className="mb-4">
        <Col>
          <DataUploader onDataUpload={handleDataUpload} />
        </Col>
      </Row>
      
      {showWelcome && renderWelcomeScreen()}
      
      {data.length > 0 && (
        <>
          <Row>
            <Col md={12} className="mb-4">
              <Card className="main-content-card">
                <Card.Header className="bg-white border-bottom-0 pt-3">
                  <Nav variant="tabs" className="dashboard-tabs">
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'visualization'} 
                        onClick={() => setActiveTab('visualization')}
                        className="tab-link"
                      >
                        <i className="bi bi-graph-up me-2"></i>
                        Visualization
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link 
                        active={activeTab === 'data'} 
                        onClick={() => setActiveTab('data')}
                        className="tab-link"
                      >
                        <i className="bi bi-table me-2"></i>
                        Data Table
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                
                <Card.Body>
                  {activeTab === 'visualization' ? (
                    <Row>
                      <Col md={3}>
                        <div className="sidebar-container">
                          <FilterPanel 
                            columns={columns} 
                            onFilterChange={handleFilterChange} 
                            filters={filters}
                          />
                          <Card className="chart-controls">
                            <Card.Body>
                              <Card.Title>
                                <i className="bi bi-sliders me-2"></i>
                                Chart Settings
                              </Card.Title>
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
                            </Card.Body>
                          </Card>
                          <ExportOptions data={filteredData} columns={columns} />
                        </div>
                      </Col>
                      <Col md={9}>
                        <Alert variant="info" className="data-summary">
                          <div className="d-flex justify-content-between">
                            <div>
                              <strong>Data Summary:</strong> {filteredData.length} records displayed
                            </div>
                            <div>
                              <strong>Filtered from:</strong> {data.length} total records
                            </div>
                          </div>
                        </Alert>
                        <ChartPanel 
                          data={filteredData} 
                          chartType={chartType}
                          xAxis={xAxis}
                          yAxis={yAxis}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <DataTable 
                      data={filteredData} 
                      columns={columns} 
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
      
      <footer className="dashboard-footer text-center mt-4 pb-4">
        <p className="text-muted">
          <small>© {new Date().getFullYear()} Data Visualization Dashboard | Made with <span className="text-danger">❤</span> by Basil </small>
        </p>
      </footer>
    </Container>
  );
}

export default App;