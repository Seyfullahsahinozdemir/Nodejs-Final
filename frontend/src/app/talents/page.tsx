"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IMovie } from "@/interfaces/IMovie";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithoutAuthentication } from "@/helpers/withoutauth.axios.hook";
import { getDevUrl, getTalentsEndpoint } from "@/network/endpoints";
import MovieItem from "@/components/movie/movie.item";
import { toast } from "react-toastify";
import { ITalent } from "@/interfaces/ITalent";
import TalentItem from "@/components/talent/talent.item";
import { AiOutlineSearch } from "react-icons/ai";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const ActorPage = () => {
  const [talents, setTalents] = useState<ITalent[]>([]);
  const networkManager: NetworkManager = useAxiosWithoutAuthentication();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    networkManager
      .get(getDevUrl(`${getTalentsEndpoint}`))
      .then((response) => {
        if (response.data.success) {
          setTalents(response.data.data);
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
      `${getDevUrl(getTalentsEndpoint)}?search=${e.target.value}`
    );
    if (response.data.success) {
      setTalents(response.data.data);
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
            placeholder="Search Talents"
            className="border rounded-lg py-2 px-3 pr-10 focus:outline-none focus:ring focus:border-blue-300"
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AiOutlineSearch className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="border border-gray-300 rounded-lg mb-4 p-2 w-21/22 relative">
          <div className="flex items-center justify-center flex-wrap gap-3">
            {talents.map((talent, index) => (
              <TalentItem talent={talent} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorPage;
