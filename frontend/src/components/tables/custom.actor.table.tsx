import React, { useEffect, useState } from "react";
import { IUser } from "@/interfaces/user/IUser";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { getDevUrl, getTalentsEndpoint } from "@/network/endpoints";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import { toast } from "react-toastify";
import DeleteModal from "../modal/delete.actor.modal";
import { IMovie } from "@/interfaces/IMovie";
import { ITalent } from "@/interfaces/ITalent";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const CustomActorTable = () => {
  const [actors, setActors] = useState<ITalent[]>();
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { formatDate } = useFormattedDate();
  const [showModal, setShowModal] = useState(false);
  const [selectedActor, setSelectedActor] = useState<ITalent>();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    networkManager
      .get(getDevUrl(getTalentsEndpoint))
      .then((response) => {
        console.log(response);
        setActors(response.data.data);
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
        actor={selectedActor}
        setActors={setActors}
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
                Birth Date
              </th>
              <th scope="col" className="px-6 py-3">
                Biography
              </th>
              <th scope="col" className="px-6 py-3">
                Is Deleted
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {actors?.map((actor: ITalent, index: number) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {actor.firstName + " " + actor.lastName}
                </th>
                <td className="px-6 py-4">{formatDate(actor.createdAt)}</td>
                <td className="px-6 py-4">{formatDate(actor.birthDate)}</td>
                <td className="px-6 py-4">{actor.biography}</td>
                <td className="px-6 py-4">
                  {actor.isDeleted ? "deleted" : "not deleted"}
                </td>
                <td className="px-6 py-4">
                  <div
                    data-modal-target="popup-modal"
                    data-modal-toggle="popup-modal"
                    className={
                      actor.isDeleted
                        ? ""
                        : "font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                    }
                    onClick={() => {
                      if (!actor.isDeleted) {
                        setSelectedActor(actor);
                        setShowModal(true);
                      } else {
                        toast.error("Cannot delete the actor");
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

export default CustomActorTable;
