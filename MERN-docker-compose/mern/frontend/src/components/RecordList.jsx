import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle">{props.record.name}</td>
    <td className="p-4 align-middle">{props.record.position}</td>
    <td className="p-4 align-middle">{props.record.level}</td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                     border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors 
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                     border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          type="button"
          onClick={() => props.deleteRecord(props.record._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  // Determine the base URL (works locally and remotely)
  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5050"
      : "http://54.157.26.49:5050";

  // Fetch all records
  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`${baseURL}/record/`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    }
    getRecords();
  }, [baseURL]);

  // Delete a record
  async function deleteRecord(id) {
    try {
      const response = await fetch(`${baseURL}/record/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.statusText}`);
      }
      setRecords(records.filter((el) => el._id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }

  // Render the table rows
  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={deleteRecord}
        key={record._id}
      />
    ));
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Name</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Position</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Level</th>
                <th className="h-12 px-4 text-left font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>{recordList()}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
