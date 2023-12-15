import React from "react";
import images from "../../../public/images.jpg";
import Image from "next/image";
import { IMovie } from "@/interfaces/IMovie";
import { useRouter } from "next/navigation";
import useFormattedDate from "@/helpers/useFormattedDate.hook";

const MovieItem = ({ movie, index }: { movie: IMovie; index: number }) => {
  const router = useRouter();
  const { formatDate } = useFormattedDate();

  const handleMovieDetail = (movieId: string) => {
    router.push(`/movies/detail/${movieId}`);
  };

  return (
    <div
      key={index}
      className="relative cursor-pointer imgContainer"
      onClick={() => handleMovieDetail(movie._id)}
    >
      <Image width={300} height={400} src={`/movies/${movie._id}.jpg`} alt="" />
      <div className="absolute bottom-0 h-full w-full flex flex-col justify-end opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-gray-100 p-4">
          <div className="text-2xl font-bold">{movie.name}</div>
          <div>
            {formatDate(movie.publishedAt)} - {movie.averageTotal}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieItem;
