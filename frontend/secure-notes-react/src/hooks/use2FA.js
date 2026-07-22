import { useState, useEffect } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const use2FA = () => {
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [pageLoader, setPageLoader] = useState(false);
  const [disabledLoader, setDisabledLoader] = useState(false);
  const [twofaCodeLoader, setTwofaCodeLoader] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    setPageLoader(true);
    const fetch2FAStatus = async () => {
      try {
        const response = await api.get("/auth/user/2fa-status");
        setIs2faEnabled(response.data.is2faEnabled);
      } catch (error) {
        setPageError(error?.response?.data?.message);
        toast.error("Error fetching 2FA status");
      } finally {
        setPageLoader(false);
      }
    };
    fetch2FAStatus();
  }, []);

  const enable2FA = async () => {
    setDisabledLoader(true);
    try {
      const response = await api.post("/auth/enable-2fa", null, {
        responseType: 'text'
      });
      const url = typeof response.data === 'string' ? response.data : response.data?.toString();
      console.log("QR Code URL:", url);
      setQrCodeUrl(url);
      setStep(2);
    } catch (error) {
      console.error("Enable 2FA error:", error?.response?.status, error?.response?.data, error?.message);
      toast.error(error?.response?.data?.message || "Error enabling 2FA");
    } finally {
      setDisabledLoader(false);
    }
  };

  const disable2FA = async () => {
    setDisabledLoader(true);
    try {
      await api.post("/auth/disable-2fa");
      setIs2faEnabled(false);
      setQrCodeUrl("");
    } catch (error) {
      toast.error("Error disabling 2FA");
    } finally {
      setDisabledLoader(false);
    }
  };

  const verify2FA = async () => {
    if (!code || code.trim().length === 0)
      return toast.error("Please Enter The Code To Verify");

    setTwofaCodeLoader(true);
    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      await api.post("/auth/verify-2fa", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      toast.success("2FA verified successful");
      setIs2faEnabled(true);
      setStep(1);
      setCode("");
    } catch (error) {
      toast.error("Invalid 2FA Code");
    } finally {
      setTwofaCodeLoader(false);
    }
  };

  return {
    is2faEnabled,
    qrCodeUrl,
    code,
    step,
    pageLoader,
    pageError,
    disabledLoader,
    twofaCodeLoader,
    setCode,
    enable2FA,
    disable2FA,
    verify2FA,
  };
};

export default use2FA;
