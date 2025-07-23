import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FormInput, ErrorMessage, formStyles } from "../components/SharedComponents";
import { classesApi, reportsApi } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { format, subDays } from 'date-fns';

// PUBLIC_INTERFACE
function ReportsPage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Load report data when selection changes
  useEffect(() => {
    if (selectedClass) {
      loadReportData();
    }
  }, [selectedClass, startDate, endDate]);

  async function loadClasses() {
    try {
      const data = await classesApi.getAll();
      setClasses(data);
      setError("");
    } catch (err) {
      setError("Failed to load classes: " + err.message);
    }
  }

  async function loadReportData() {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const data = await reportsApi.getAttendanceReport(
        selectedClass.id,
        startDate,
        endDate
      );
      setReportData(data);
      setError("");
    } catch (err) {
      setError("Failed to load report data: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExport(format) {
    if (!selectedClass) return;
    
    try {
      const data = await reportsApi.exportAttendanceReport(
        selectedClass.id,
        startDate,
        endDate,
        format
      );
      
      // Create and trigger download
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${selectedClass.name}_${startDate}_${endDate}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(`Failed to export report: ${err.message}`);
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Attendance Reports</h1>

      <ErrorMessage message={error} />

      <div style={{ 
        display: "flex",
        gap: 20,
        marginBottom: 24,
        background: "var(--bg-secondary)",
        padding: 20,
        borderRadius: 8,
        flexWrap: "wrap"
      }}>
        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Class</label>
          <select
            value={selectedClass?.id || ""}
            onChange={(e) => {
              const classItem = classes.find(c => c.id === Number(e.target.value));
              setSelectedClass(classItem);
            }}
            style={{
              ...formStyles.input,
              minWidth: 200,
            }}
          >
            <option value="">Select a class</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <FormInput
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ minWidth: 200 }}
        />

        <FormInput
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ minWidth: 200 }}
        />

        <div style={{ ...formStyles.inputGroup, justifyContent: "flex-end" }}>
          <label style={formStyles.label}>Export</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handleExport('csv')}
              disabled={!selectedClass || loading}
              style={{
                ...formStyles.button,
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                padding: "8px 16px",
              }}
            >
              Export CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={!selectedClass || loading}
              style={{
                ...formStyles.button,
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                padding: "8px 16px",
              }}
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : reportData ? (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ marginBottom: 16 }}>Attendance Overview</h2>
          
          <div style={{ height: 400, marginBottom: 32 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData.daily_stats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="#4caf50" name="Present" />
                <Bar dataKey="absent" fill="#f44336" name="Absent" />
                <Bar dataKey="late" fill="#ff9800" name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginBottom: 32
          }}>
            {Object.entries(reportData.summary).map(([key, value]) => (
              <div
                key={key}
                style={{
                  background: "var(--bg-secondary)",
                  padding: 16,
                  borderRadius: 8,
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "0.9em", color: "var(--text-secondary)", marginBottom: 8 }}>
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </div>
                <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                  {typeof value === 'number' ? `${(value * 100).toFixed(1)}%` : value}
                </div>
              </div>
            ))}
          </div>

          {reportData.student_stats && (
            <>
              <h2 style={{ marginBottom: 16 }}>Student Attendance Rates</h2>
              <div style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportData.student_stats}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="student_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance_rate" fill="#2196f3" name="Attendance Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          Select a class and date range to view attendance reports
        </div>
      )}
    </div>
  );
}

export default ReportsPage;
