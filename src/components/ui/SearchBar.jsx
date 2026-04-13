import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import { Search, X } from "lucide-react";
import Avatar from "./Avatar";

export default function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name, username, avatar_url")
          .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
          .limit(6);

        if (error) throw error;
        setResults(data || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Search error:", error.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (username) => {
    navigate(`/profile/${username}`);
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onNavigate?.();
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Search className="text-text-secondary absolute top-3 left-3" size={20} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
        className="placeholder-text-text-secondary text-text-primary w-full rounded-full bg-slate-800/50 px-10 py-3 transition-all outline-none"
      />

      {query && (
        <button
          onClick={() => {
            setQuery("");
            setResults([]);
            setIsOpen(false);
          }}
          className="text-text-secondary hover:text-text-primary absolute top-3 right-3 cursor-pointer"
        >
          <X size={20} />
        </button>
      )}

      {isOpen && (
        <div className="bg-glass absolute top-full z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-slate-700 shadow-2xl">
          {loading ? (
            <p className="text-text-secondary py-4 text-center text-sm">
              Searching...
            </p>
          ) : results.length > 0 ? (
            results.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user.username)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-800/50"
              >
                <Avatar src={user.avatar_url} alt={user.username} />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-text-primary truncate text-sm font-bold">
                    {user.full_name}
                  </span>
                  <span className="text-text-secondary truncate text-xs">
                    @{user.username}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <p className="text-text-secondary py-4 text-center text-sm">
              No users found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
