"use client";
import React, { useEffect, useState } from "react";

export default function LocationComponent() {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function getCityFromCoords(lat: number, lon: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      if (!res.ok) throw new Error("Failed to fetch location data.");
      const data = await res.json();
      const addr = data.address || {};

      return `${addr.neighbourhood ?? addr.suburb ?? ""}, ${
        addr.village || ""
      }, ${addr.district || ""}, ${addr.state || ""}, ${addr.country || ""}`
        .replace(/, ,/g, ",")
        .replace(/, $/, "");
    } catch {
      return "Unknown Location";
    }
  }

  useEffect(() => {
    if (!navigator.geolocation)
      return setError("Geolocation is not supported by your browser.");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) =>
        setAddress(await getCityFromCoords(coords.latitude, coords.longitude)),
      ({ code }) =>
        setError(
          code === 1
            ? "Permission denied. Please allow location access."
            : code === 2
            ? "Location unavailable. Try again later."
            : code === 3
            ? "Location request timed out."
            : "An unknown error occurred."
        )
    );
  }, []);

  return (
    <p className="text-sm text-gray-500">
      {error ? (
        <span className="text-red-500">{error}</span>
      ) : address ? (
        `${address}`
      ) : (
        "Fetching Location..."
      )}
    </p>
  );
}
