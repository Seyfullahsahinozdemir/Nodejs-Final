import React, { useEffect, useState } from "react";
import { IUser } from "@/interfaces/user/IUser";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import {
  getDevUrl,
  getUsersEndpoint,
  deleteUserEndpoint,
} from "@/network/endpoints";
import useFormattedDate from "@/helpers/useFormattedDate.hook";
import { toast } from "react-toastify";
import DeleteModal from "../modal/delete.user.modal";
import { useRouter } from "next/navigation";
import useErrorHandling from "@/helpers/useErrorHandler.hook";

const CustomUserTable = () => {
  const [users, setUsers] = useState<IUser[]>();
  const networkManager: NetworkManager = useAxiosWithAuthentication();
  const { formatDate } = useFormattedDate();
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const router = useRouter();
  const { handleErrorResponse } = useErrorHandling();

  useEffect(() => {
    networkManager
      .get(getDevUrl(getUsersEndpoint))
      .then((response) => {
        setUsers(response.data.data);
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
        user={selectedUser}
        setUsers={setUsers}
      />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Admin
              </th>
              <th scope="col" className="px-6 py-3">
                Is Delete
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: IUser, index: number) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:text-indigo-300 cursor-pointer"
                  onClick={() => router.push("/profile/" + user.username)}
                >
                  {user.firstName + " " + user.lastName}
                </th>
                <td className="px-6 py-4">{user.username}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">
                  {user.isAdmin ? "admin" : "basic"}
                </td>
                <td className="px-6 py-4">
                  {user.isDeleted ? "deleted" : "not deleted"}
                </td>
                <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-4">
                  <div
                    data-modal-target="popup-modal"
                    data-modal-toggle="popup-modal"
                    className={
                      user.isAdmin || user.isDeleted
                        ? ""
                        : "font-medium text-red-600 dark:text-red-500 hover:underline cursor-pointer"
                    }
                    onClick={() => {
                      if (!user.isAdmin && !user.isDeleted) {
                        setSelectedUser(user);
                        setShowModal(true);
                      } else {
                        toast.error("Cannot delete the user");
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

export default CustomUserTable;
