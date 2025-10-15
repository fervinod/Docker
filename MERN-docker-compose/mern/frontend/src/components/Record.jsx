import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  // ✅ Automatically use localhost in dev, public IP in production
  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5050"
      : "http://54.196.15.154:5050"; // replace with your actual backend IP/domain

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) return;
      setIsNew(false);

      try {
        const response = await fetch(`${API_BASE_URL}/record/${id}`);
        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          console.error(message);
          return;
        }
        const record = await response.json();
        if (!record) {
          console.warn(`Record with id ${id} not found`);
          navigate("/");
          return;
        }
        setForm(record);
      } catch (err) {
        console.error("Error fetching record:", err);
      }
    }

    fetchData();
  }, [params.id, navigate, API_BASE_URL]);

  function updateForm(value) {
    return setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const person = { ...form };

    try {
      let response;
      if (isNew) {
        // ✅ POST for new record
        response = await fetch(`${API_BASE_URL}/record`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(person),
        });
      } else {
        // ✅ PATCH for update
        response = await fetch(`${API_BASE_URL}/record/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(person),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred adding or updating a record:", error);
    } finally {
      setForm({ name: "", position: "", level: "" });
      navigate("/");
    }
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Employee Record</h3>
      <form onSubmit={onSubmit} className="border rounded-lg overflow-hidden p-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Employee Info
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6 ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                  placeholder="First Last"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="position" className="block text-sm font-medium leading-6 text-slate-900">
                Position
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="position"
                  id="position"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6 ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
                  placeholder="Developer Advocate"
                  value={form.position}
                  onChange={(e) => updateForm({ position: e.target.value })}
                />
              </div>
            </div>

            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Position Options</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  {["Intern", "Junior", "Senior"].map((level) => (
                    <div className="flex items-center" key={level}>
                      <input
                        id={`position${level}`}
                        name="positionOptions"
                        type="radio"
                        value={level}
                        className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                        checked={form.level === level}
                        onChange={(e) => updateForm({ level: e.target.value })}
                      />
                      <label
                        htmlFor={`position${level}`}
                        className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                      >
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Employee Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </form>
    </>
  );
}
