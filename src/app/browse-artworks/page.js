"use client";

import React, { useState, useEffect } from "react";
import ArtworkPagination from "./ArtworkPagination";

const BrowseArtworksPage = () => {
  const [pageData, setPageData] = useState([]);
  const apiUrl = process.env.NEXT_PUBLIC_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/arthub/artwork`);
        if (res.ok) {
          const data = await res.json();
          setPageData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div>
      <ArtworkPagination pageData={pageData} />
    </div>
  );
};

export default BrowseArtworksPage;
