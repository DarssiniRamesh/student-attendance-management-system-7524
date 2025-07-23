import React, { useState, useEffect } from "react";
import { FormInput, DataTable, ErrorMessage, formStyles } from "../components/SharedComponents";
import { classesApi, attendanceApi } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

// PUBLIC_INTERFACE
function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

  // Load attendance when class or date changes
  useEffect(() => {
    if (selectedClass) {
      loadAttendance();
    }
  }, [selectedClass, selectedDate]);

  async function loadClasses() {
    try {
      const data = await classesApi.getAll();
      setClasses(data);
      setError("");
    } catch (err) {
      setError("Failed to load classes: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAttendance() {
    if (!selectedClass) return;
    
    try {
      setLoading(true);
      const data = await attendanceApi.getForClass(selectedClass.id, selectedDate);
      setAttendanceData(data);
      setError("");
    } catch (err) {
      setError("Failed to load attendance: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAttendanceChange(studentId, status) {
    try {
      const data = {
        student_id: studentId,
        date: selectedDate,
        status: status
      };

      // Find existing attendance record
      const existing = attendanceData.find(a => a.student_id === studentId);

      if (existing) {
        await attendanceApi.updateAttendance(selectedClass.id, existing.id, data);
      } else {
        await attendanceApi.markAttendance(selectedClass.id, data);
      }

      await loadAttendance();
    } catch (err) {
      setError("Failed to update attendance: " + err.message);
    }
  }

  const columns = [
    { key: "student_id", label: "Student ID" },
    { key: "name", label: "Name" },
    { 
      key: "status",
      label: "Status",
      render: (row) => (
        <select
          value={row.status || ""}
          onChange={(e) => handleAttendanceChange(row.student_id, e.target.value)}
          style={{
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid var(--border-color)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        >
          <option value="">Not Marked</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
        </select>
      )
    }
  ];

  if (loading && !selectedClass) return <LoadingSpinner />;

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Attendance</h1>

      <ErrorMessage message={error} />

      <div style={{ 
        display: "flex",
        gap: 20,
        marginBottom: 24,
        background: "var(--bg-secondary)",
        padding: 20,
        borderRadius: 8,
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
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ minWidth: 200 }}
        />
      </div>

      {selectedClass ? (
        loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable
            columns={columns}
            data={attendanceData}
          />
        )
      ) : (
        <div>Please select a class to mark attendance.</div>
      )}
    </div>
  );
}

export default AttendancePage;
