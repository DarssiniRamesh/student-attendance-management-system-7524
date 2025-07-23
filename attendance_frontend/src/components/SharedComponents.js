import React from "react";

// Shared styles
const formStyles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    maxWidth: "500px",
    padding: "20px",
    background: "var(--bg-secondary)",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    fontSize: "1rem",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
  },
  button: {
    padding: "12px",
    background: "var(--button-bg)",
    color: "var(--button-text)",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  error: {
    color: "#d32f2f",
    fontSize: "0.9rem",
    padding: "8px",
    background: "#fff3f3",
    borderRadius: "4px",
  }
};

const tableStyles = {
  container: {
    overflowX: "auto",
    background: "var(--bg-secondary)",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.95rem",
  },
  th: {
    padding: "12px 16px",
    textAlign: "left",
    borderBottom: "2px solid var(--border-color)",
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  },
  actionButton: {
    padding: "6px 12px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    marginRight: "8px",
  }
};

// PUBLIC_INTERFACE
export function FormInput({ label, error, ...props }) {
  return (
    <div style={formStyles.inputGroup}>
      <label style={formStyles.label}>{label}</label>
      <input style={formStyles.input} {...props} />
      {error && <span style={formStyles.error}>{error}</span>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function SubmitButton({ children, ...props }) {
  return (
    <button style={formStyles.button} type="submit" {...props}>
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
                <td key={col.key} style={tableStyles.td}>{row[col.key]}</td>
              ))}
              <td style={tableStyles.td}>
                <button 
                  onClick={() => onEdit(row)}
                  style={{
                    ...tableStyles.actionButton,
                    background: "var(--button-bg)",
                    color: "var(--button-text)",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row)}
                  style={{
                    ...tableStyles.actionButton,
                    background: "#d32f2f",
                    color: "#fff",
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
  return <div style={formStyles.error}>{message}</div>;
}

export { formStyles, tableStyles };
