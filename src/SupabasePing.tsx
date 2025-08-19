import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function SupabasePing() {
  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("notes").select("*").limit(5);
      if (error) setError(error.message);
      else setRows(data ?? []);
    })();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Supabase Ping</h1>
      {error && <div className="text-red-600">Error: {error}</div>}
      <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}
