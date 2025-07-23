import { fetchWithAuth } from '../AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper to handle API responses and errors
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'An error occurred');
  }
  return response.json();
}

// PUBLIC_INTERFACE
export const studentsApi = {
  getAll: () => 
    fetchWithAuth(`${API_URL}/students`)
      .then(handleResponse),
  
  getOne: (id) => 
    fetchWithAuth(`${API_URL}/students/${id}`)
      .then(handleResponse),
  
  create: (data) => 
    fetchWithAuth(`${API_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  update: (id, data) => 
    fetchWithAuth(`${API_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  delete: (id) => 
    fetchWithAuth(`${API_URL}/students/${id}`, {
      method: 'DELETE',
    }).then(response => response.ok),
};

// PUBLIC_INTERFACE
export const classesApi = {
  getAll: () => 
    fetchWithAuth(`${API_URL}/classes`)
      .then(handleResponse),
  
  getOne: (id) => 
    fetchWithAuth(`${API_URL}/classes/${id}`)
      .then(handleResponse),
  
  create: (data) => 
    fetchWithAuth(`${API_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  update: (id, data) => 
    fetchWithAuth(`${API_URL}/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  delete: (id) => 
    fetchWithAuth(`${API_URL}/classes/${id}`, {
      method: 'DELETE',
    }).then(response => response.ok),
};

// PUBLIC_INTERFACE
export const reportsApi = {
  getAttendanceReport: (classId, startDate, endDate) =>
    fetchWithAuth(`${API_URL}/reports/attendance/${classId}?start_date=${startDate}&end_date=${endDate}`)
      .then(handleResponse),
      
  exportAttendanceReport: (classId, startDate, endDate, format = 'csv') =>
    fetchWithAuth(
      `${API_URL}/reports/attendance/${classId}/export?start_date=${startDate}&end_date=${endDate}&format=${format}`,
      { headers: { Accept: format === 'csv' ? 'text/csv' : 'application/json' } }
    ).then(response => response.text()),
};

// PUBLIC_INTERFACE
export const attendanceApi = {
  getForClass: (classId, date) => 
    fetchWithAuth(`${API_URL}/attendance/${classId}?date=${date}`)
      .then(handleResponse),
  
  markAttendance: (classId, data) => 
    fetchWithAuth(`${API_URL}/attendance/${classId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  
  updateAttendance: (classId, attendanceId, data) => 
    fetchWithAuth(`${API_URL}/attendance/${classId}/${attendanceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};
