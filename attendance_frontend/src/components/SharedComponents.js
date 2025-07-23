import React from "react";

// Shared styles
const formStyles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    maxWidth: "600px",
    padding: "1.5rem",
    background: "var(--bg-secondary)",
    borderRadius: "8px",
    boxShadow: "var(--card-shadow)",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    fontSize: "0.95rem",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    transition: "border-color 0.2s ease",
  },
  button: {
    padding: "0.75rem 1.5rem",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  error: {
    color: "#d32f2f",
    fontSize: "0.9rem",
    padding: "0.75rem",
    background: "rgba(211, 47, 47, 0.1)",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  }
};

const tableStyles = {
  container: {
    overflowX: "auto",
    background: "var(--bg-secondary)",
    borderRadius: "8px",
    boxShadow: "var(--card-shadow)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95rem",
  },
  th: {
    padding: "1rem 1.25rem",
    textAlign: "left",
    borderBottom: "2px solid var(--border-color)",
    color: "var(--text-primary)",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "1rem 1.25rem",
    borderBottom: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  },
  actionButton: {
    padding: "0.5rem 1rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    marginRight: "0.5rem",
  }
};

// PUBLIC_INTERFACE
export function FormInput({ label, error, ...props }) {
  return (
    <div style={formStyles.inputGroup}>
      <label style={formStyles.label}>{label}</label>
      <input 
        style={{
          ...formStyles.input,
          borderColor: error ? "#d32f2f" : "var(--border-color)",
        }} 
        {...props} 
      />
      {error && <span style={formStyles.error}>{error}</span>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function SubmitButton({ children, ...props }) {
  return (
    <button 
      style={{
        ...formStyles.button,
        "&:hover": {
          opacity: 0.9,
          transform: "translateY(-1px)",
        }
      }} 
      type="submit" 
      {...props}
    >
      {children}
    </button>
  );
}

// PUBLIC_INTERFACE
export function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <div style={tableStyles.container}>
      <table style={tableStyles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={tableStyles.th}>{col.label}</th>
            ))}
            <th style={tableStyles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key} style={tableStyles.td}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              <td style={tableStyles.td}>
                <button 
                  onClick={() => onEdit(row)}
                  style={{
                    ...tableStyles.actionButton,
                    background: "var(--primary)",
                    color: "white",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row)}
                  style={{
                    ...tableStyles.actionButton,
                    background: "var(--accent)",
                    color: "white",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// PUBLIC_INTERFACE
export function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div style={formStyles.error}>
      <span style={{ fontSize: "1.2em" }}>⚠️</span>
      {message}
    </div>
  );
}

export { formStyles, tableStyles };
