import { useAxiosWithAuthentication } from "@/helpers/auth.axios.hook";
import NetworkManager from "@/network/network.manager";
import React, { useState } from "react";
import { GrClose } from "react-icons/gr";
import { getDevUrl, deleteComment, getMovieById } from "@/network/endpoints";
import { IUser } from "@/interfaces/user/IUser";
import { toast } from "react-toastify";
import { IMovie } from "@/interfaces/IMovie";
import { ITalent } from "@/interfaces/ITalent";

const DeleteModal = ({
  show,
  setShow,
  comment,
  setMovie,
  movieId,
}: {
  setShow: (show: boolean) => void;
  show: boolean;
  comment?: any;
  setMovie: (movie: IMovie) => void;
  movieId?: string;
}) => {
  const networkManager: NetworkManager = useAxiosWithAuthentication();

  const handleDeleteButton = async () => {
    if (!comment) {
      console.error("Comment is undefined");
      return;
    }

    const response = await networkManager
      .post(getDevUrl(deleteComment), {
        commentId: comment.comment._id,
      })
      .catch((err) => {
        console.log(err);
      });

    if (response.success) {
      toast.success(response.message);
      setShow(false);
      networkManager
        .get(getDevUrl(`${getMovieById}/${movieId}`))
        .then((response) => {
          console.log(response);
          setMovie(response.data.data.movie);
        });
    } else {
      toast.error("An error occurred while deleting comment.");
    }
  };

  return (
    <dialog
      id="my_modal_4"
      className={`modal mt-24 w-2/3 max-w-2xl ${
        show ? "block z-50 h-[120px]" : "hidden"
      }`}
    >
      <div className="modal-box p-2 max-w-2xl relative">
        <h3 className="font-bold text-lg p-2">Delete Comment</h3>
        <hr />
        <div className="flex flex-col items-center justify-center">
          <div className="w-full bg-white rounded-lg">
            <div className="space-y-4 md:space-y-6 sm:p-8">
              <div className="space-y-4 md:space-y-6">
                Do you really want to delete comment ?
              </div>
              <div className="space-y-4 md:space-y-6">
                <button
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={handleDeleteButton}
                >
                  Delete
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

export default DeleteModal;
