import React, { useState, useEffect } from "react";
import { FormInput, SubmitButton, DataTable, ErrorMessage, formStyles } from "../components/SharedComponents";
import { studentsApi } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

// PUBLIC_INTERFACE
function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load students on mount
  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const data = await studentsApi.getAll();
      setStudents(data);
      setError("");
    } catch (err) {
      setError("Failed to load students: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    const formData = {
      name: e.target.name.value,
      student_id: e.target.student_id.value,
      email: e.target.email.value,
    };

    try {
      if (editingStudent) {
        await studentsApi.update(editingStudent.id, formData);
      } else {
        await studentsApi.create(formData);
      }
      
      await loadStudents();
      setShowForm(false);
      setEditingStudent(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(student) {
    if (!window.confirm(`Delete student ${student.name}?`)) return;
    
    try {
      await studentsApi.delete(student.id);
      await loadStudents();
    } catch (err) {
      setError("Failed to delete student: " + err.message);
    }
  }

  function handleEdit(student) {
    setEditingStudent(student);
    setShowForm(true);
  }

  const columns = [
    { key: "student_id", label: "Student ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Students</h1>
        <button
          onClick={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
          style={{
            ...formStyles.button,
            padding: "8px 16px",
          }}
        >
          Add Student
        </button>
      </div>

      <ErrorMessage message={error} />

      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...formStyles.form, marginBottom: 24 }}>
          <h2>{editingStudent ? "Edit Student" : "Add New Student"}</h2>
          
          <FormInput
            label="Student ID"
            name="student_id"
            required
            defaultValue={editingStudent?.student_id}
          />
          
          <FormInput
            label="Name"
            name="name"
            required
            defaultValue={editingStudent?.name}
          />
          
          <FormInput
            label="Email"
            name="email"
            type="email"
            required
            defaultValue={editingStudent?.email}
          />

          <div style={{ display: "flex", gap: 12 }}>
            <SubmitButton>
              {editingStudent ? "Update Student" : "Add Student"}
            </SubmitButton>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
              style={{
                ...formStyles.button,
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <DataTable
        columns={columns}
        data={students}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default StudentsPage;
