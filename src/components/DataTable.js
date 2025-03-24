import React, { useState } from 'react';
import { Table, Card, Badge, Form, InputGroup, Pagination, Row, Col } from 'react-bootstrap';

const DataTable = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter data based on search term
  const filteredData = data.filter(row => {
    return Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate page numbers
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  return (
    <Card className="mb-4 data-table-card">
      <Card.Header className="bg-gradient" style={{ background: 'linear-gradient(to right, #4361ee, #3f37c9)' }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-white">
            <i className="bi bi-table me-2"></i>
            Data Explorer
          </h5>
          <Badge bg="light" text="dark" pill>
            {filteredData.length} records
          </Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text className="search-icon" style={{ background: '#4361ee', color: 'white' }}>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                placeholder="Search in data..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
                style={{ borderColor: '#4361ee' }}
              />
            </InputGroup>
          </Col>
          <Col md={3} className="ms-auto">
            <Form.Select 
              value={itemsPerPage} 
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ borderColor: '#4361ee' }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </Form.Select>
          </Col>
        </Row>
        
        <div style={{ overflowX: 'auto', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
          <Table striped hover className="data-table" style={{ borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {columns.map(column => (
                  <th key={column} style={{ 
                    borderBottom: '2px solid #4361ee', 
                    color: '#3a3a3a',
                    fontWeight: '600',
                    padding: '12px 15px'
                  }}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                  <tr key={index} style={{ 
                    transition: 'background-color 0.2s',
                    borderLeft: index % 2 === 0 ? '4px solid #4361ee' : '4px solid transparent'
                  }}>
                    {columns.map(column => (
                      <td key={`${index}-${column}`} style={{ padding: '10px 15px' }}>
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    <i className="bi bi-emoji-frown me-2"></i>
                    {filteredData.length === 0 ? 'No data available' : 'No matching records found'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        
        {filteredData.length > 0 && (
          <Row className="mt-3">
            <Col className="d-flex justify-content-between align-items-center">
              <div className="text-muted">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
              </div>
              <Pagination>
                <Pagination.First 
                  onClick={() => handlePageChange(1)} 
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(number => 
                    number === 1 || 
                    number === totalPages || 
                    (number >= currentPage - 1 && number <= currentPage + 1)
                  )
                  .map(number => (
                    <Pagination.Item 
                      key={number} 
                      active={number === currentPage}
                      onClick={() => handlePageChange(number)}
                      style={number === currentPage ? { 
                        backgroundColor: '#4361ee', 
                        borderColor: '#4361ee' 
                      } : {}}
                    >
                      {number}
                    </Pagination.Item>
                  ))}
                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(totalPages)} 
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default DataTable;