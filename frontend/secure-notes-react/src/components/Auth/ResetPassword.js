import React from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import InputField from "../InputField/InputField";
import Buttons from "../../utils/Buttons";
import { passwordRules } from "../../utils/passwordValidation";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator";
import useResetPassword from "../../hooks/useResetPassword";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleResetPassword, loading } = useResetPassword();
  const password = watch("password");

  const onSubmit = async (data) => {
    const token = searchParams.get("token");
    const success = await handleResetPassword(data.password, token);
    if (success) {
      reset();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-74px)] flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:w-[450px] w-[360px]  shadow-custom py-8 sm:px-8 px-4"
      >
        <div>
          <h1 className="font-montserrat text-center font-bold text-2xl">
            Update Your Password
          </h1>
          <p className="text-slate-600 text-center">
            Enter your new Password to Update it
          </p>
        </div>
        <Divider className="font-semibold pb-4"></Divider>

        <div className="flex flex-col gap-2 mt-4">
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="enter your Password"
            register={register}
            errors={errors}
            rules={passwordRules}
          />
          <PasswordStrengthIndicator value={password} />
          <InputField
            label="Confirm Password"
            required
            id="confirmPassword"
            type="password"
            message="*Please confirm your password"
            placeholder="confirm your Password"
            register={register}
            errors={errors}
            rules={{
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
          />
        </div>
        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className="bg-customRed font-semibold text-white w-full py-2 hover:text-slate-400 transition-colors duration-100 rounded-sm my-3"
          type="text"
        >
          {loading ? <span>Loading...</span> : "Submit"}
        </Buttons>
        <p className=" text-sm text-slate-700 ">
          <Link className=" underline hover:text-black" to="/login">
            Back To Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
