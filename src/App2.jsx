import { useState, useEffect } from "react";
import './App.css';

export default function App() {
  const [profile, setProfile] = useState({
    name: "",
    age: 0,
    hobbies: []
  });

  // --- UNPACKING (load from localStorage once on mount) ---
  useEffect(() => {
    const saved = localStorage.getItem("myProfile");
    if (saved) {
      const parsedData = JSON.parse(saved);
      // FIX: Set state directly from the parsed object
      setProfile(parsedData); 
    }
  }, []);

  // --- PACKING (save whenever profile changes) ---
  useEffect(() => {
    // Check to ensure we don't save the default empty state over existing data
    if (profile.name === "" && profile.age === 0) return;

    // FIX: Save the state object directly without an extra wrapper
    localStorage.setItem("myProfile", JSON.stringify(profile)); 
  }, [profile]);

  // --- RENDER ---
  return (
    <div>
      <h1>Profile Saver</h1>
      
      <p>Name: {profile.name || "(No Name)"}</p>
      <p>Age: {profile.age}</p>

      <button onClick={() => setProfile({ ...profile, name: "Oum" })}>
        Set Name
      </button>

      <button onClick={() => setProfile({ ...profile, age: profile.age + 1 })}>
        Increase Age
      </button>

      <button
        onClick={() => {
          // Reset State
          setProfile({ name: "", age: 0, hobbies: [] });
          // Clear Storage
          localStorage.removeItem("myProfile");
        }}
      >
        Reset
      </button>
    </div>
  );
}