"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IMovie } from "@/interfaces/IMovie";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithoutAuthentication } from "@/helpers/withoutauth.axios.hook";
import {
  getCategoriesEndpoint,
  getDevUrl,
  getMoviesByCategoryIdEndpoint,
} from "@/network/endpoints";
import MovieItem from "@/components/movie/movie.item";
import { toast } from "react-toastify";
import { AiOutlineSearch } from "react-icons/ai";
import { authActions } from "@/slices/auth.slice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const MoviePageByCategory = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  const [movies, setMovies] = useState<IMovie[]>([]);
  const networkManager: NetworkManager = useAxiosWithoutAuthentication();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    networkManager
      .get(getDevUrl(`${getMoviesByCategoryIdEndpoint}/${categoryId}`))
      .then((response) => {
        if (response.data.success) {
          setMovies(response.data.data.movies);
        } else {
          toast.error("An error occurred");
        }
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  }, []);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value;
    const response = await networkManager.get(
      `${getDevUrl(getMoviesByCategoryIdEndpoint)}/${categoryId}?search=${
        e.target.value
      }`
    );
    if (response.data.success) {
      console.log(response.data);
      setMovies(response.data.data.movies);
    } else {
      toast.error("An error occurred while searching");
    }
  };

  return (
    <div>
      <div className="relative text-gray-600 ml-auto flex justify-center items-center flex-col p-4">
        <div className="relative">
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
      <div className="h-100 flex flex-col">
        <div className="flex justify-center">
          <div className="flex items-center space-x-8 h-16 text-xl"></div>
          <div className="border border-gray-300 rounded-lg mb-4 p-2 w-21/22 relative">
            <div className="flex items-center justify-center flex-wrap gap-3">
              {movies.map((movie, index) => (
                <MovieItem movie={movie} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePageByCategory;
