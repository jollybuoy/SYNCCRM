import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

/** Minimal auth + notes demo (doesn't affect your app's AuthContext) */
export default function SupabasePing() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sessionUser, setSessionUser] = useState<any>(null);

  const [rows, setRows] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");

  // --- auth state ---
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSessionUser(data.session?.user ?? null);
      setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // --- fetch current user's notes ---
  const fetchNotes = async () => {
    setError(null);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) setError(error.message);
    else setRows(data ?? []);
  };

  useEffect(() => {
    if (sessionUser) fetchNotes();
    else setRows([]);
  }, [sessionUser]);

  // --- actions ---
  const signUp = async () => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: userEmail,
      password,
    });
    if (error) setError(error.message);
    // If email confirm is ON in Supabase, user must confirm before they can sign in
  };

  const signIn = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password,
    });
    if (error) setError(error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const addNote = async () => {
    setError(null);
    if (!newNote.trim()) return;
    const { error } = await supabase.from("notes").insert({ body: newNote.trim() });
    if (error) setError(error.message);
    setNewNote("");
    fetchNotes();
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Supabase Ping</h1>
        <div>Loading…</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Supabase Ping</h1>

      {/* Auth panel */}
      {!sessionUser ? (
        <div className="space-y-3 p-4 rounded border">
          <div className="font-medium">Sign up / Sign in (email + password)</div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="you@example.com"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded bg-black text-white" onClick={signUp}>
              Sign up
            </button>
            <button className="px-4 py-2 rounded bg-gray-800 text-white" onClick={signIn}>
              Sign in
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Tip: If email confirmation is enabled in Supabase, confirm the email before signing in.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded border">
          <div>
            <div className="text-sm text-gray-500">Signed in as</div>
            <div className="font-medium">{sessionUser.email}</div>
          </div>
          <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={signOut}>
            Sign out
          </button>
        </div>
      )}

      {/* Notes UI (only when logged in) */}
      {sessionUser && (
        <>
          <div className="flex gap-3">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="Write a note…"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={addNote}>
              Add
            </button>
            <button className="px-4 py-2 rounded border" onClick={fetchNotes}>
              Refresh
            </button>
          </div>

          {error && <div className="text-red-600">Error: {error}</div>}

          <pre className="bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(rows, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
