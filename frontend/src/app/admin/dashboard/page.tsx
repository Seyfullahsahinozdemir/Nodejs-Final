"use client";
import CustomActorTable from "@/components/tables/custom.actor.table";
import CustomMovieTable from "@/components/tables/custom.movie.table";
import CustomUserTable from "@/components/tables/custom.user.table";
import React, { useState } from "react";

const DashboardPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("users");

  const handleMoviesClick = () => {
    setSelectedMenu("movies");
  };

  const handleUsersClick = () => {
    setSelectedMenu("users");
  };

  const handleActorsClick = () => {
    setSelectedMenu("actors");
  };

  return (
    <>
      <div className="flex">
        <div className="w-64 bg-zinc-50 h-[350px]">
          <div
            className={
              selectedMenu === "users"
                ? "pl-2 pt-5 hover:bg-indigo-100 rounded-sm border-2 border-indigo-400"
                : "pl-2 pt-5 hover:bg-indigo-100 rounded-sm"
            }
            onClick={handleUsersClick}
          >
            Users
          </div>
          <div
            className={
              selectedMenu === "movies"
                ? "pl-2 pt-5 hover:bg-indigo-100 rounded-sm border-2 border-indigo-400"
                : "pl-2 pt-5 hover:bg-indigo-100 rounded-sm"
            }
            onClick={handleMoviesClick}
          >
            Movies
          </div>
          <div
            className={
              selectedMenu === "actors"
                ? "pl-2 pt-5 hover:bg-indigo-100 rounded-sm border-2 border-indigo-400"
                : "pl-2 pt-5 hover:bg-indigo-100 rounded-sm"
            }
            onClick={handleActorsClick}
          >
            Actors
          </div>
        </div>
        <div className="w-full pr-5 w-min-[600px]">
          <div className="ml-10 mt-2">
            {selectedMenu === "users" ? (
              <CustomUserTable />
            ) : selectedMenu === "movies" ? (
              <CustomMovieTable />
            ) : selectedMenu === "actors" ? (
              <CustomActorTable />
            ) : (
              <h1>temp</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
