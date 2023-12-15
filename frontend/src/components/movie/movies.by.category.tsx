import React from "react";
import MovieItem from "@/components/movie/movie.item";
import { IMovie } from "@/interfaces/IMovie";
import { useRouter } from "next/navigation";

const MoviesByCategory = ({
  moviesByCategory,
  index,
}: {
  moviesByCategory: any;
  index: number;
}) => {
  const router = useRouter();

  const handleViewAll = async (id: string) => {
    router.push(`/movies/category?id=${id}`);
  };

  return (
    <div key={index} className="flex justify-center">
      <div className="border border-gray-300 rounded-lg mb-4 p-2 w-21/22 relative">
        <div>
          {moviesByCategory.categoryName.toUpperCase()}
          <div
            className="absolute top-2 right-2 underline cursor-pointer text-indigo-600"
            onClick={() => handleViewAll(moviesByCategory.categoryId)}
          >
            View All
          </div>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-3">
          {moviesByCategory.movies.map((movie: IMovie) => (
            <MovieItem movie={movie} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviesByCategory;
