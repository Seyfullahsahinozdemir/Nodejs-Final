"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NetworkManager from "@/network/network.manager";
import { getDevUrl, getTalentsByIdEndpoint } from "@/network/endpoints";
import { useAxiosWithoutAuthentication } from "@/helpers/withoutauth.axios.hook";
import images from "../../../../public/default-profile.png";
import Image from "next/image";
import { toast } from "react-toastify";
import { ITalent } from "@/interfaces/ITalent";
import MovieItem from "@/components/movie/movie.item";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const ActorDetailPage = () => {
  const pathname = usePathname();
  const actorId = pathname.split("/").pop();

  const [actor, setActor] = useState<ITalent>();
  const networkManager: NetworkManager = useAxiosWithoutAuthentication();
  const { formatDate } = useFormattedDate();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    networkManager
      .get(getDevUrl(`${getTalentsByIdEndpoint}/${actorId}`))
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setActor(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  }, []);

  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      <div className="container px-5 py-12 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:pr-10 mt-6 lg:mt-0 relative flex justify-center items-center">
            <Image
              alt=""
              className="w-1/2 h-auto object-cover object-center rounded border border-gray-200"
              src={`/actors/${actor?._id}.jpg`}
            />
          </div>
          <div className="lg:w-1/2 w-full lg:pl-10 mt-6 lg:mt-0 relative">
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {actor?.firstName} {actor?.lastName}
            </h1>
            <p className="leading-relaxed"> {actor?.biography} </p>
            <div className="leading-relaxed flex items-center">
              <div className="font-semibold pr-2">Birthday:</div>
              {formatDate(actor?.birthDate)}
            </div>
            <div className="pt-4"></div>
          </div>
          <div className="w-full pt-4">
            <hr />
            <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
              <div className="max-w-2xl px-4">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                  Movies
                </h2>
                <div className="flex justify-between items-center mb-6"></div>
                <div className="mb-6 relative flex items-center flex-wrap gap-3">
                  {actor?.movies.map((movie, index) => (
                    <MovieItem movie={movie} index={index} />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActorDetailPage;
