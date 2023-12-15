import React from "react";
import images from "../../../public/images.jpg";
import Image from "next/image";
import { IMovie } from "@/interfaces/IMovie";
import { useRouter } from "next/navigation";
import { ITalent } from "@/interfaces/ITalent";
import useFormattedDate from "@/helpers/useFormattedDate.hook";

const TalentItem = ({ talent, index }: { talent: ITalent; index: number }) => {
  const router = useRouter();
  const { formatDate } = useFormattedDate();

  const handleTalentDetail = (talentId: string) => {
    router.push(`/talents/${talentId}`);
  };

  return (
    <div
      key={index}
      className="relative cursor-pointer imgContainer w-[300px] h-[400px]"
      onClick={() => handleTalentDetail(talent._id)}
    >
      <Image fill src={`/actors/${talent?._id}.jpg`} alt="" />
      <div className="absolute bottom-0 h-full w-full flex flex-col justify-end opacity-0 hover:opacity-100 transition-opacity">
        <div className="bg-gray-100 p-4">
          <div className="text-2xl font-bold">
            {talent.firstName} {talent.lastName}
          </div>
          <div>{formatDate(talent.birthDate)}</div>
        </div>
      </div>
    </div>
  );
};

export default TalentItem;
