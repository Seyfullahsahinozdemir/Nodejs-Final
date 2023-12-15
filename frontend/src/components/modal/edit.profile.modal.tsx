import React, { useEffect, useState } from "react";
import { IUser } from "@/interfaces/user/IUser";
import NetworkManager from "@/network/network.manager";
import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import { getDevUrl, updateUserEndpoint } from "@/network/endpoints";
import { GrClose } from "react-icons/gr";

const EditProfileModal = ({
  show,
  setShow,
  info,
  onUpdateUser,
}: {
  setShow: (show: boolean) => void;
  info: IUser;
  show: boolean;
  onUpdateUser: (updatedUser: IUser) => void;
}) => {
  const [user, setUser] = useState<IUser>(info);
  const networkManager: NetworkManager = useAxiosWithAuthentication();

  console.log(user);

  const handleEditButton = async () => {
    const response = await networkManager.post(getDevUrl(updateUserEndpoint), {
      gender: user.preferences.gender,
      phone: user.preferences.phone,
      address: user.preferences.address,
      about: user.preferences.about,
      birthDate: user.preferences.birthDate,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    console.log(response);

    if (response.success) {
      console.log(response);
      onUpdateUser(user);
      setShow(false);
    }
  };

  return (
    <dialog
      id="my_modal_4"
      className={`modal w-2/3 max-w-2xl z-50 ${show ? "block" : "hidden"}`}
    >
      <div className="modal-box p-2 max-w-2xl relative">
        <h3 className="font-bold text-lg p-2">Edit Profile</h3>
        <hr />
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-white rounded-lg">
            <div className="space-y-4 md:space-y-6 sm:p-8">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="bg-gray-50 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={user.firstName}
                    onChange={(e) => {
                      setUser((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={user.lastName}
                    onChange={(e) => {
                      setUser((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="gender"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Gender
                  </label>
                  <select
                    name="gender"
                    id="gender"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={
                      user.preferences?.gender
                        ? user.preferences.gender
                        : "prefer-not-to-say"
                    }
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          gender: e.target.value,
                        },
                      }));
                    }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer-not-to-say">Prefer Not to Say</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Contact No
                  </label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={
                      user.preferences?.phone ? user.preferences.phone : ""
                    }
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          phone: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={
                      user.preferences?.address ? user.preferences.address : ""
                    }
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          address: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="birthDate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Birthday
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    id="birthDate"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={
                      user.preferences?.birthDate
                        ? user.preferences.birthDate
                        : ""
                    }
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          birthDate: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="about"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    About
                  </label>
                  <textarea
                    name="about"
                    id="about"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={
                      user.preferences?.about ? user.preferences.about : ""
                    }
                    onChange={(e) => {
                      setUser((prevUser) => ({
                        ...prevUser,
                        preferences: {
                          ...prevUser.preferences,
                          about: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={handleEditButton}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action">
          <div>
            <GrClose
              className="btn absolute top-1 right-4 hover:border rounded-md w-7 h-7 m-2"
              onClick={() => {
                const modal: HTMLDialogElement = document.getElementById(
                  "my_modal_4"
                ) as HTMLDialogElement;

                modal.close();
                setShow(false);
              }}
            />
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default EditProfileModal;
