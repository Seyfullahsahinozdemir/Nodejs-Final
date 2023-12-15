import React, { useEffect, useState } from "react";
import { IUser } from "@/interfaces/user/IUser";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { getDevUrl, getMovieById } from "@/network/endpoints";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import { toast } from "react-toastify";
import DeleteModal from "../modal/delete.movie.modal";
import { IMovie } from "@/interfaces/IMovie";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const CustomMovieTable = () => {
  const [movies, setMovies] = useState<IMovie[]>();
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { formatDate } = useFormattedDate();
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovie>();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    networkManager
      .get(getDevUrl(getMovieById))
      .then((response) => {
        setMovies(response.data.data.movies);
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  }, []);

  return (
    <>
      <DeleteModal
        show={showModal}
        setShow={setShowModal}
        movie={selectedMovie}
        setMovies={setMovies}
      />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Published At
              </th>
              <th scope="col" className="px-6 py-3">
                Comment
              </th>
              <th scope="col" className="px-6 py-3">
                Rate
              </th>
              <th scope="col" className="px-6 py-3">
                Is Delete
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {movies?.map((movie: IMovie, index: number) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {movie.name}
                </th>
                <td className="px-6 py-4">{formatDate(movie.createdAt)}</td>
                <td className="px-6 py-4">{formatDate(movie.publishedAt)}</td>
                <td className="px-6 py-4">
                  {movie.comments.length.toString()}
                </td>
                <td className="px-6 py-4">{movie.averagePoint.toString()}</td>
                <td className="px-6 py-4">{movie.isDeleted.toString()}</td>
                <td className="px-6 py-4">
                  <div
                    data-modal-target="popup-modal"
                    data-modal-toggle="popup-modal"
                    className={
                      movie.isDeleted
                        ? ""
                        : "font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                    }
                    onClick={() => {
                      if (!movie.isDeleted) {
                        setSelectedMovie(movie);
                        setShowModal(true);
                      } else {
                        toast.error("Cannot delete the movie");
                      }
                    }}
                  >
                    delete
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomMovieTable;
