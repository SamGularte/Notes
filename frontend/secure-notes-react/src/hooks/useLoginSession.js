import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const useLoginSession = (token) => {
  const [loginSession, setLoginSession] = useState(null);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const lastLoginSession = moment
        .unix(decodedToken.iat)
        .format("dddd, D MMMM YYYY, h:mm A");
      setLoginSession(lastLoginSession);
    }
  }, [token]);

  return loginSession;
};

export default useLoginSession;
