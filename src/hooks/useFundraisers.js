import { useState, useEffect, useMemo } from "react";
import { parseData } from "../utils/parseContributions";
import { mergeData } from "../utils/mergeContributions";

export const useFundraisers = () => {
  const [fundraisers, setFundraisers] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("fundraisers") || "[]");
    setFundraisers(saved);
    if (saved.length) setActiveId(saved[0].id);
  }, []);

  useEffect(() => {
    localStorage.setItem("fundraisers", JSON.stringify(fundraisers));
  }, [fundraisers]);

  const active = useMemo(() => fundraisers.find((f) => f.id === activeId), [fundraisers, activeId]);

  const updateActive = (updates) => {
    setFundraisers((prev) => prev.map((f) => (f.id === activeId ? { ...f, ...updates } : f)));
  };

  // NEW: Shared helper functions
  const createFundraiser = (name) => {
    const newItem = { id: Date.now().toString(), name, text: "", edits: {}, useMerged: true };
    setFundraisers((prev) => [newItem, ...prev]);
    setActiveId(newItem.id);
  };

  const deleteFundraiser = (id) => {
    setFundraisers((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      if (activeId === id) setActiveId(filtered[0]?.id || null);
      return filtered;
    });
  };

  const parsedData = useMemo(() => parseData(active?.text || ""), [active?.text]);

  const editedData = useMemo(() => {
    if (!active) return [];
    return parsedData.map((item, i) => ({
      Name: active.edits?.[i]?.Name ?? item.Name,
      Amount: active.edits?.[i]?.Amount ?? item.Amount,
    }));
  }, [parsedData, active]);

  const mergedData = useMemo(() => mergeData(editedData), [editedData]);

  const viewData = active?.useMerged ? mergedData : editedData;

  const total = useMemo(() => viewData.reduce((sum, i) => sum + i.Amount, 0), [viewData]);

  return {
    fundraisers,
    active,
    activeId,
    setActiveId,
    setFundraisers,
    updateActive,
    viewData,
    createFundraiser,
    deleteFundraiser,
    total,
  };
};
