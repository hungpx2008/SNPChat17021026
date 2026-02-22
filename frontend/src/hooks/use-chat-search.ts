import { useCallback, useState } from "react";
import { chatBackend, type SearchResult } from "@/services/chat-backend";

export function useChatSearch(
  userIdentifier: string,
  department: string,
  setError: (error: string | null) => void,
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchSubmit = useCallback(async () => {
    const query = searchTerm.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const results = await chatBackend.semanticSearch({
        user_id: userIdentifier ?? undefined,
        department,
        query,
      });
      setSearchResults(results);
    } catch (err) {
      console.error("Search error", err);
      setError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm, userIdentifier, department, setError]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    setSearchResults,
    searchLoading,
    handleSearchSubmit,
    clearSearch,
  };
}
