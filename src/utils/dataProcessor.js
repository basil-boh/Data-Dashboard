export const processData = (rawData) => {
  // Filter out empty rows
  const filteredData = rawData.filter(row => {
    return Object.values(row).some(value => value !== null && value !== undefined && value !== '');
  });
  
  // Extract column names
  const dataColumns = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];
  
  return {
    processedData: filteredData,
    dataColumns
  };
};