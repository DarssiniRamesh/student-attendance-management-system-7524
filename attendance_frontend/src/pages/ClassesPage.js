import React, { useState, useEffect } from "react";
import { FormInput, SubmitButton, DataTable, ErrorMessage, formStyles } from "../components/SharedComponents";
import { classesApi } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";

// PUBLIC_INTERFACE
function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingClass, setEditingClass] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load classes on mount
  useEffect(() => {
    loadClasses();
  }, []);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    const formData = {
      name: e.target.name.value,
      subject: e.target.subject.value,
      schedule: e.target.schedule.value,
    };

    try {
      if (editingClass) {
        await classesApi.update(editingClass.id, formData);
      } else {
        await classesApi.create(formData);
      }
      
      await loadClasses();
      setShowForm(false);
      setEditingClass(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(classItem) {
    if (!window.confirm(`Delete class ${classItem.name}?`)) return;
    
    try {
      await classesApi.delete(classItem.id);
      await loadClasses();
    } catch (err) {
      setError("Failed to delete class: " + err.message);
    }
  }

  function handleEdit(classItem) {
    setEditingClass(classItem);
    setShowForm(true);
  }

  const columns = [
    { key: "name", label: "Class Name" },
    { key: "subject", label: "Subject" },
    { key: "schedule", label: "Schedule" },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1>Classes</h1>
        <button
          onClick={() => {
            setEditingClass(null);
            setShowForm(true);
          }}
          style={{
            ...formStyles.button,
            padding: "8px 16px",
          }}
        >
          Add Class
        </button>
      </div>

      <ErrorMessage message={error} />

      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...formStyles.form, marginBottom: 24 }}>
          <h2>{editingClass ? "Edit Class" : "Add New Class"}</h2>
          
          <FormInput
            label="Class Name"
            name="name"
            required
            defaultValue={editingClass?.name}
          />
          
          <FormInput
            label="Subject"
            name="subject"
            required
            defaultValue={editingClass?.subject}
          />
          
          <FormInput
            label="Schedule"
            name="schedule"
            required
            placeholder="e.g., Mon/Wed 9:00-10:30"
            defaultValue={editingClass?.schedule}
          />

          <div style={{ display: "flex", gap: 12 }}>
            <SubmitButton>
              {editingClass ? "Update Class" : "Add Class"}
            </SubmitButton>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingClass(null);
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
        data={classes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default ClassesPage;
