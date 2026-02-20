import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export const useAlert = () => {
  const navigate = useNavigate()
  const showSwalSuccess = (title:string) => {
    Swal.fire({
      title,
      icon: "success",
      confirmButtonColor:"#41e433c2",
      // didOpen: () => setSwalShown(true),
      didClose: () => navigate("/"),
    });
  };

  const showSwalError = (title: string = "Oops! Something went wrong") => {
    Swal.fire({
      title,
      icon: "error",
      confirmButtonColor: "#242222c2",
    });
  };

  return {showSwalSuccess, showSwalError}
};
