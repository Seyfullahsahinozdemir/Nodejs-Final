"use client";
import React, { MouseEventHandler, useEffect, useState } from "react";
import Link from "next/link";
import NetworkManager from "@/network/network.manager";
import {
  getDevUrl,
  getCategoriesEndpoint,
  getMoviesByCategoryIdEndpoint,
  getLatestMoviesEndpoint,
  getTopRatedMoviesEndpoint,
  getMostCommentedMoviesEndpoint,
  getSearchMoviesEndpoint,
} from "@/network/endpoints";
import { useAxiosWithoutAuthentication } from "@/helpers/withoutauth.axios.hook";
import { ICustomResponse } from "@/interfaces/ICustomResponse";
import { useRouter } from "next/navigation";
import { ICategory } from "@/interfaces/ICategory";
import { AiOutlineSearch } from "react-icons/ai";
import MoviesByCategory from "@/components/movie/movies.by.category";
import MovieItem from "@/components/movie/movie.item";
import { IMovie } from "@/interfaces/IMovie";
import { toast } from "react-toastify";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const MoviePage = () => {
  const [topCategory, setTopCategory] = useState<string>("all");
  const networkManager: NetworkManager = useAxiosWithoutAuthentication();
  const router = useRouter();
  const [sampleMovies, setSampleMovies] = useState<any[]>([]);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [search, setSearch] = useState<string>("");
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    networkManager
      .get(getDevUrl(getCategoriesEndpoint))
      .then((response) => {
        if (response.data.success) {
          const updatedSampleMovies: any[] = [];
          const promises = response.data.data.map((category: ICategory) => {
            return networkManager
              .get(
                getDevUrl(`${getMoviesByCategoryIdEndpoint}/${category._id}`)
              )
              .then((sample) => {
                const newSampleCategory = {
                  categoryId: category._id,
                  categoryName: category.name,
                  movies: sample.data.data.movies.slice(0, 4),
                };
                updatedSampleMovies.push(newSampleCategory);
              });
          });

          Promise.all(promises).then(() => {
            setSampleMovies(updatedSampleMovies);
          });
        } else {
          toast.error("An error occurred while get movies");
          return;
        }
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  }, []);

  const handleTopCategoryButton = async (clickedCategory: string) => {
    setTopCategory(clickedCategory);
    if (clickedCategory === "latest") {
      const response = await networkManager.get(
        getDevUrl(getLatestMoviesEndpoint)
      );
      setMovies(response.data.data.movies);
      return response.data.data.movies;
    } else if (clickedCategory === "top-rated") {
      const response = await networkManager.get(
        getDevUrl(getTopRatedMoviesEndpoint)
      );
      setMovies(response.data.data.movies);

      return response.data.data.movies;
    } else if (clickedCategory === "most-commented") {
      const response = await networkManager.get(
        getDevUrl(getMostCommentedMoviesEndpoint)
      );
      setMovies(response.data.data.movies);

      return response.data.data.movies;
    }
    return null;
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value;
    const response = await networkManager.get(
      `${getDevUrl(getSearchMoviesEndpoint)}?search=${e.target.value}`
    );
    if (response.data.success) {
      setMovies(response.data.data.movies);
      setTopCategory("search");
    } else {
      toast.error("An error occurred while searching");
    }
  };

  return (
    <div className="h-100 flex flex-col">
      <div className="flex justify-center">
        <div className="flex items-center space-x-8 h-16 text-xl">
          <div
            className={
              topCategory == "all"
                ? "cursor-pointer text-indigo-600 underline"
                : "cursor-pointer"
            }
            onClick={() => handleTopCategoryButton("all")}
          >
            All
          </div>
          <div
            className={
              topCategory == "latest"
                ? "cursor-pointer text-indigo-600 underline"
                : "cursor-pointer"
            }
            onClick={() => handleTopCategoryButton("latest")}
          >
            Latest
          </div>
          <div
            className={
              topCategory == "top-rated"
                ? "cursor-pointer text-indigo-600 underline"
                : "cursor-pointer"
            }
            onClick={() => handleTopCategoryButton("top-rated")}
          >
            Top Rated
          </div>
          <div
            className={
              topCategory == "most-commented"
                ? "cursor-pointer text-indigo-600 underline"
                : "cursor-pointer"
            }
            onClick={() => handleTopCategoryButton("most-commented")}
          >
            Most Commented
          </div>
          <div className="relative text-gray-600 ml-auto">
            <input
              type="text"
              placeholder="Search Movies"
              className="border rounded-lg py-2 px-3 pr-10 focus:outline-none focus:ring focus:border-blue-300"
              onChange={handleSearchChange}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <AiOutlineSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {topCategory == "all" ? (
        <div>
          {sampleMovies.map((moviesByCategory, index) => (
            <MoviesByCategory
              index={index}
              moviesByCategory={moviesByCategory}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center">
          {["latest", "top-rated", "most-commented", "search"].includes(
            topCategory
          ) && (
            <div className="border border-gray-300 rounded-lg mb-4 p-2 w-21/22 relative">
              <div className="flex items-center justify-center flex-wrap gap-3">
                {movies.map((movie, index) => (
                  <MovieItem movie={movie} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MoviePage;
