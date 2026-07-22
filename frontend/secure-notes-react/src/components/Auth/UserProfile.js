import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import InputField from "../InputField/InputField";
import { useForm } from "react-hook-form";
import Buttons from "../../utils/Buttons";
import Switch from "@mui/material/Switch";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors";
import { passwordRules } from "../../utils/passwordValidation";
import PasswordStrengthIndicator from "../PasswordStrengthIndicator";
import { QRCodeSVG } from "qrcode.react";
import use2FA from "../../hooks/use2FA";
import useAccountStatus from "../../hooks/useAccountStatus";
import useLoginSession from "../../hooks/useLoginSession";
import useUpdateCredentials from "../../hooks/useUpdateCredentials";

const UserProfile = () => {
  const { currentUser, token, setToken } = useMyContext();
  const navigate = useNavigate();
  const [openAccount, setOpenAccount] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const {
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
  } = use2FA();

  const {
    accountExpired,
    accountLocked,
    accountEnabled,
    credentialExpired,
    credentialExpireDate,
    handleAccountExpiryStatus,
    handleAccountLockStatus,
    handleAccountEnabledStatus,
    handleCredentialExpiredStatus,
  } = useAccountStatus(currentUser);

  const loginSession = useLoginSession(token);
  const { handleUpdateCredential, loading: credentialLoading } =
    useUpdateCredentials(currentUser?.username);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: currentUser?.username,
      email: currentUser?.email,
      password: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    if (currentUser?.id) {
      setValue("username", currentUser.username);
      setValue("email", currentUser.email);
    }
  }, [currentUser, setValue]);

  const handleUpdateAndLogout = async (data) => {
    const success = await handleUpdateCredential(data);
    if (success) {
      localStorage.removeItem("JWT_TOKEN");
      localStorage.removeItem("USER");
      localStorage.removeItem("IS_ADMIN");
      localStorage.removeItem("CSRF_TOKEN");
      setToken(null);
      navigate("/login");
    }
  };

  const onOpenAccountHandler = () => {
    setOpenAccount(!openAccount);
    setOpenSetting(false);
  };

  const onOpenSettingHandler = () => {
    setOpenSetting(!openSetting);
    setOpenAccount(false);
  };

  if (pageError) {
    return <Errors message={pageError} />;
  }

  return (
    <div className="min-h-[calc(100vh-74px)] py-10">
      {pageLoader ? (
        <div className="flex flex-col justify-center items-center h-72">
          <span>
            <Blocks
              height="70"
              width="70"
              color="#4fa94d"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              visible={true}
            />
          </span>
          <span>Please wait...</span>
        </div>
      ) : (
        <div className="xl:w-[70%] lg:w-[80%] sm:w-[90%] w-full sm:mx-auto sm:px-0 px-4 min-h-[500px] flex lg:flex-row flex-col gap-4">
          <div className="flex-1 flex flex-col shadow-lg shadow-gray-300 gap-2 px-4 py-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar
                alt={currentUser?.username}
                src="/static/images/avatar/1.jpg"
              />
              <h3 className="font-semibold text-2xl">
                {currentUser?.username}
              </h3>
            </div>
            <div className="my-4">
              <div className="space-y-2 px-4 mb-1">
                <h1 className="font-semibold text-md text-slate-800">
                  UserName :{" "}
                  <span className="text-slate-700 font-normal">
                    {currentUser?.username}
                  </span>
                </h1>
                <h1 className="font-semibold text-md text-slate-800">
                  Role :{" "}
                  <span className="text-slate-700 font-normal">
                    {currentUser?.roles?.[0]}
                  </span>
                </h1>
              </div>
              <div className="py-3">
                <Accordion expanded={openAccount}>
                  <AccordionSummary
                    className="shadow-md shadow-gray-300"
                    onClick={onOpenAccountHandler}
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <h3 className="text-slate-800 text-lg font-semibold">
                      Update User Credentials
                    </h3>
                  </AccordionSummary>
                  <AccordionDetails className="shadow-md shadow-gray-300">
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={handleSubmit(handleUpdateAndLogout)}
                    >
                      <InputField
                        label="UserName"
                        required
                        id="username"
                        className="text-sm"
                        type="text"
                        message="*Username is required"
                        placeholder="Enter your username"
                        register={register}
                        errors={errors}
                        readOnly
                      />
                      <InputField
                        label="Email"
                        required
                        id="email"
                        className="text-sm"
                        type="email"
                        message="*Email is required"
                        placeholder="Enter your email"
                        register={register}
                        errors={errors}
                        readOnly
                      />
                      <InputField
                        label="Enter New Password"
                        id="password"
                        className="text-sm"
                        type="password"
                        placeholder="type your password"
                        register={register}
                        errors={errors}
                        rules={passwordRules}
                      />
                      <PasswordStrengthIndicator value={watch("password")} />
                      <Buttons
                        disabled={credentialLoading}
                        className="bg-customRed font-semibold flex justify-center text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
                        type="submit"
                      >
                        {credentialLoading ? (
                          <span>Loading...</span>
                        ) : (
                          "Update"
                        )}
                      </Buttons>
                    </form>
                  </AccordionDetails>
                </Accordion>
                <div className="mt-6">
                  <Accordion expanded={openSetting}>
                    <AccordionSummary
                      className="shadow-md shadow-gray-300"
                      onClick={onOpenSettingHandler}
                      expandIcon={<ArrowDropDownIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <h3 className="text-slate-800 text-lg font-semibold">
                        Account Setting
                      </h3>
                    </AccordionSummary>
                    <AccordionDetails className="shadow-md shadow-gray-300">
                      <div className="flex flex-col gap-4">
                        <div>
                          <h3 className="text-slate-700 font-customWeight text-sm">
                            Account Expired
                          </h3>
                          <Switch
                            checked={accountExpired}
                            onChange={handleAccountExpiryStatus}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                        <div>
                          <h3 className="text-slate-700 font-customWeight text-sm">
                            Account Locked
                          </h3>
                          <Switch
                            checked={accountLocked}
                            onChange={handleAccountLockStatus}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                        <div>
                          <h3 className="text-slate-700 font-customWeight text-sm">
                            Account Enabled
                          </h3>
                          <Switch
                            checked={accountEnabled}
                            onChange={handleAccountEnabledStatus}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                        <div className="mb-2">
                          <h3 className="text-slate-700 font-customWeight text-sm">
                            Credential Setting
                          </h3>
                          <div className="shadow-gray-300 shadow-md px-4 py-4 rounded-md">
                            <p className="text-slate-700 text-sm">
                              Your credential will expired{" "}
                              <span>{credentialExpireDate}</span>
                            </p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-slate-700 font-customWeight text-sm">
                            Credential Expired
                          </h3>
                          <Switch
                            checked={credentialExpired}
                            onChange={handleCredentialExpiredStatus}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>

                <div className="pt-10">
                  <h3 className="text-slate-800 text-lg font-semibold mb-2 px-2">
                    Last Login Session
                  </h3>
                  <div className="shadow-md shadow-gray-300 px-4 py-2 rounded-md">
                    <p className="text-slate-700 text-sm">
                      Your Last LogIn Session when you are loggedin <br />
                      <span>{loginSession}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col shadow-lg shadow-gray-300 gap-2 px-4 py-6">
            <div className="space-y-1">
              <h1 className="text-slate-800 flex items-center gap-1 text-2xl font-bold">
                <span>Authentication (MFA)</span>
                <span
                  className={`${
                    is2faEnabled ? "bg-green-800" : "bg-customRed"
                  } px-2 text-center py-1 text-xs mt-2 rounded-sm text-white`}
                >
                  {is2faEnabled ? "Activated" : "Deactivated"}
                </span>
              </h1>
              <h3 className="text-slate-800 text-xl font-semibold">
                Multi Factor Authentication
              </h3>
              <p className="text-slate-800 text-sm">
                Two Factor Authentication Add a additional layer of security to
                your account
              </p>
            </div>

            <div>
              <Buttons
                disabled={disabledLoader}
                onClickhandler={is2faEnabled ? disable2FA : enable2FA}
                className={`${
                  is2faEnabled ? "bg-customRed" : "bg-btnColor"
                } px-5 py-1 hover:text-slate-300 rounded-sm text-white mt-2`}
              >
                {disabledLoader
                  ? "Loading..."
                  : is2faEnabled
                  ? "Disable Two Factor Authentication"
                  : "Enable Two Factor Authentication"}
              </Buttons>
            </div>
            {step === 2 && (
              <div className="py-3">
                <Accordion defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <h3 className="font-bold text-lg text-slate-700 uppercase">
                      QR Code To Scan
                    </h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div>
                      <QRCodeSVG value={qrCodeUrl} />
                      <div className="flex items-center gap-2 mt-4">
                        <input
                          type="text"
                          placeholder="Enter 2FA code"
                          value={code}
                          required
                          className="mt-4 border px-2 py-1 border-slate-800 rounded-md"
                          onChange={(e) => setCode(e.target.value)}
                        />
                        <Buttons
                          onClickhandler={verify2FA}
                          disabled={twofaCodeLoader}
                          className="bg-btnColor text-white px-3 h-10 rounded-md mt-4"
                        >
                          {twofaCodeLoader ? "Loading..." : "Verify 2FA"}
                        </Buttons>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
