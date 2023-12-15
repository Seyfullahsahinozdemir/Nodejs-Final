"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NetworkManager from "@/network/network.manager";
import {
  getDevUrl,
  getMovieById,
  postComment,
  postLikeMovie,
} from "@/network/endpoints";
import { IMovie } from "@/interfaces/IMovie";
import { useAxiosWithoutAuthentication } from "@/helpers/withoutauth.axios.hook";
import images from "../../../../../public/images.jpg";
import Image from "next/image";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authActions } from "@/slices/auth.slice";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import useErrorHandling from "@/helpers/useErrorHandler.hook";
import { IoTrashBinSharp } from "react-icons/io5";
import DeleteModal from "@/components/modal/delete.comment.modal";

const DetailPage = () => {
  const pathname = usePathname();
  const movieId = pathname.split("/").pop();
  const [movie, setMovie] = useState<IMovie>();
  const networkManager: NetworkManager = useAxiosWithoutAuthentication();
  const networkManagerAuth: NetworkManager = useAxiosWithAuthentication();
  const [comment, setComment] = useState("");
  const [point, setPoint] = useState(0);
  const [favorite, setFavorite] = useState<boolean>();
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleErrorResponse } = useErrorHandling();
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState();
  const { formatDate } = useFormattedDate();

  useEffect(() => {
    networkManagerAuth
      .get(getDevUrl(`${getMovieById}/${movieId}`))
      .then((response) => {
        if (response.data.success) {
          setMovie(response.data.data.movie);
          setFavorite(response.data.data.movie.isFavorite);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  }, []);

  console.log(movie?.newComments);

  const handleCommentChange = async (e: any) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async () => {
    const response = await networkManagerAuth.post(getDevUrl(postComment), {
      content: comment,
      movieId: movieId,
      point: point,
    });
    if (response.success) {
      setComment("");
      setPoint(0);
      networkManagerAuth
        .get(getDevUrl(`${getMovieById}/${movieId}`))
        .then((res) => {
          setMovie(res.data.data.movie);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error(
        "An error occurred while add comment, or you already add a comment."
      );
    }
  };

  const handlePointChange = (commentPoint: number) => {
    setPoint(commentPoint);
  };

  const handleFavoriteChange = async () => {
    const isLiked = await networkManagerAuth.post(
      getDevUrl(`${postLikeMovie}`),
      {
        movieId: movieId,
      }
    );
    if (isLiked.success) {
      console.log("like success");
      networkManagerAuth
        .get(getDevUrl(`${getMovieById}/${movieId}`))
        .then((response) => {
          if (response.data.success) {
            setMovie(response.data.data.movie);
            setFavorite(response.data.data.movie.isFavorite);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((err) => {
          if (err.response.status == 401) {
            setTimeout(() => {
              toast.error("Jwt expired, please login.");
            }, 2000);
            router.push("/login");
          }
          toast.error("Error occurred while getting movie");
        });
    }
  };

  const handleActorClick = (id: string) => {
    router.push(`/talents/${id}`);
  };

  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <DeleteModal
        show={showModal}
        setShow={setShowModal}
        comment={selectedComment}
        setMovie={setMovie}
        movieId={movieId}
      />
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap pl-24">
          <div className="w-[300px] h-[450px] lg:pr-10 mt-6 lg:mt-0 relative">
            <Image
              fill
              alt={movie?.name ?? ""}
              className="w-full h-auto object-cover object-center rounded border border-gray-200"
              src={`/movies/${movieId}.jpg`}
            />
          </div>
          <div className="lg:w-1/2 w-full lg:pl-10 mt-6 lg:mt-0 relative">
            <button
              className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4 absolute top-0 right-0"
              onClick={handleFavoriteChange}
            >
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
                  fill={favorite ? "red" : ""}
                ></path>
              </svg>
            </button>
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              {movie?.categories[0].name.toUpperCase()}
            </h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {movie?.name}
            </h1>
            <div className="flex mb-4">
              <span className="flex items-center">
                <svg
                  fill={
                    movie && movie.averageTotal >= 1 ? "currentColor" : "none"
                  }
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-red-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill={
                    movie && movie.averageTotal >= 2 ? "currentColor" : "none"
                  }
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-red-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill={
                    movie && movie.averageTotal >= 3 ? "currentColor" : "none"
                  }
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-red-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill={
                    movie && movie.averageTotal >= 4 ? "currentColor" : "none"
                  }
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-red-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill={
                    movie && movie.averageTotal >= 5 ? "currentColor" : "none"
                  }
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-4 h-4 text-red-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span className="text-gray-600 ml-3">
                  {movie?.comments.length} Reviews
                </span>
              </span>
            </div>
            <p className="leading-relaxed">{movie?.description}</p>
            <div className="pt-4">
              <div>
                <div className="font-bold">Actors:</div>
                {movie?.actors.map((actor: any, i: number) => (
                  <div
                    key={i}
                    className="underline hover:text-indigo-300 cursor-pointer inline-block"
                    onClick={() => handleActorClick(actor._id)}
                  >
                    {actor.firstName} {actor.lastName + ", "}
                  </div>
                ))}
                <div className="font-bold">Directors:</div>
                {movie?.directors.map((actor: any, i: number) => (
                  <div
                    key={i}
                    className="underline hover:text-indigo-300 cursor-pointer inline-block"
                    onClick={() => handleActorClick(actor._id)}
                  >
                    {actor.firstName} {actor.lastName + ", "}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full pt-4">
            <hr />
            <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
              <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                    Reviews
                  </h2>
                </div>
                <div className="top-0 right-0 text-white font-bold px-2 py-1 rounded-bl-lg text-right pb-4">
                  <svg
                    className={
                      point > 0
                        ? "w-4 h-4 text-yellow-300 inline-block"
                        : "w-4 h-4 text-gray-300 inline-block"
                    }
                    onMouseEnter={() => handlePointChange(1)}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className={
                      point > 1
                        ? "w-4 h-4 text-yellow-300 inline-block"
                        : "w-4 h-4 text-gray-300 inline-block"
                    }
                    onMouseEnter={() => handlePointChange(2)}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className={
                      point > 2
                        ? "w-4 h-4 text-yellow-300 inline-block"
                        : "w-4 h-4 text-gray-300 inline-block"
                    }
                    onMouseEnter={() => handlePointChange(3)}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className={
                      point > 3
                        ? "w-4 h-4 text-yellow-300 inline-block"
                        : "w-4 h-4 text-gray-300 inline-block"
                    }
                    onMouseEnter={() => handlePointChange(4)}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                  <svg
                    className={
                      point > 4
                        ? "w-4 h-4 text-yellow-300 inline-block"
                        : "w-4 h-4 text-gray-300 inline-block"
                    }
                    onMouseEnter={() => handlePointChange(5)}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 20"
                  >
                    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                  </svg>
                </div>
                <div className="mb-6 relative">
                  <div>
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 relative">
                      <label htmlFor="comment" className="sr-only">
                        Your comment
                      </label>
                      <textarea
                        id="comment"
                        className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                        placeholder="Write a comment..."
                        onChange={handleCommentChange}
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                      onClick={handleCommentSubmit}
                    >
                      Post comment
                    </button>
                  </div>
                </div>

                {movie?.newComments.map((comment: any, index: number) => (
                  <article className="p-6 text-base bg-white dark:bg-gray-900 border-t border-gray-200 relative">
                    <footer className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                          <img
                            className="mr-2 w-6 h-6 rounded-full"
                            src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                            alt="Michael Gough"
                          />
                          {comment.comment.user.firstName}{" "}
                          {comment.comment.user.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(comment.comment.createdAt)}
                        </p>
                      </div>
                    </footer>
                    <div className="absolute top-0 right-0 text-white font-bold px-2 py-1 rounded-bl-lg">
                      <div className="flex items-center space-x-1">
                        {comment.comment.point >= 1 ? (
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        )}
                        {comment.comment.point >= 2 ? (
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        )}
                        {comment.comment.point >= 3 ? (
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        )}
                        {comment.comment.point >= 4 ? (
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        )}
                        {comment.comment.point >= 5 ? (
                          <svg
                            className="w-4 h-4 text-yellow-300"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4 text-gray-300 dark:text-gray-500"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      {comment.comment.content}
                    </p>
                    {comment.myComment ? (
                      <div className="absolute bottom-0 right-0 p-2">
                        <IoTrashBinSharp
                          className="w-6 h-6 text-red-500 cursor-pointer"
                          onClick={() => {
                            setSelectedComment(comment);
                            setShowModal(true);
                          }}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailPage;
