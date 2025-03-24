import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const FilterPanel = ({ columns, onFilterChange, filters }) => {
  const handleFilterChange = (column, value) => {
    onFilterChange(column, value);
  };

  const clearFilters = () => {
    columns.forEach(column => {
      onFilterChange(column, '');
    });
  };

  return (
    <Card className="filter-container mb-4">
      <Card.Body>
        <Card.Title>Filters</Card.Title>
        {columns.map(column => (
          <Form.Group key={column} className="mb-3">
            <Form.Label>{column}</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Filter by ${column}`}
              value={filters[column] || ''}
              onChange={(e) => handleFilterChange(column, e.target.value)}
            />
          </Form.Group>
        ))}
        <Button 
          variant="outline-secondary" 
          size="sm"
          onClick={clearFilters}
        >
          Clear All Filters
        </Button>
      </Card.Body>
    </Card>
  );
};

export default FilterPanel;