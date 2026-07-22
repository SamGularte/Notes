import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";

const useRedirectIfAuthenticated = () => {
  const navigate = useNavigate();
  const { token } = useMyContext();

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);
};

export default useRedirectIfAuthenticated;
