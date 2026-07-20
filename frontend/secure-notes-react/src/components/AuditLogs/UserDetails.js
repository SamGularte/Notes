import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import InputField from "../InputField/InputField";
import Buttons from "../../utils/Buttons";
import Errors from "../Errors";
import useUserDetails from "../../hooks/useUserDetails";
import useUpdateRole from "../../hooks/useUpdateRole";
import useUpdatePassword from "../../hooks/useUpdatePassword";
import useUpdateAccountStatus from "../../hooks/useUpdateAccountStatus";
import LoadingSpinner from "../LoadingSpinner";
import { passwordRules } from "../../utils/passwordValidation";
import PasswordStrengthIndicator from "../PasswordStrengthIndicator";

const UserDetails = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const { userId } = useParams();
  const {
    user,
    roles,
    selectedRole,
    setSelectedRole,
    loading,
    error,
    fetchUserDetails,
    fetchRoles,
  } = useUserDetails();

  const { updateRole, updateRoleLoader } = useUpdateRole(userId);
  const { updatePassword, passwordLoader } = useUpdatePassword(userId);
  const { updateStatus } = useUpdateAccountStatus(userId);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setValue("username", user.userName);
      setValue("email", user.email);
    }
  }, [user, setValue]);

  useEffect(() => {
    fetchUserDetails(userId);
    fetchRoles();
  }, [userId, fetchUserDetails, fetchRoles]);

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleUpdateRole = async () => {
    const success = await updateRole(selectedRole);
    if (success) {
      fetchUserDetails(userId);
    }
  };

  const handleSavePassword = async (data) => {
    const success = await updatePassword(data.password);
    if (success) {
      setIsEditingPassword(false);
      setValue("password", "");
    }
  };

  const handleCheckboxChange = async (e, updateUrl) => {
    const { name, checked } = e.target;
    const success = await updateStatus(name, checked, updateUrl);
    if (success) {
      fetchUserDetails(userId);
    }
  };

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="sm:px-12 px-4 py-10   ">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="lg:w-[70%] sm:w-[90%] w-full  mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
            <div>
              <h1 className="text-slate-800 text-2xl font-bold  pb-4">
                Profile Information
                <hr />
              </h1>
              <form
                className="flex  flex-col  gap-2  "
                onSubmit={handleSubmit(handleSavePassword)}
              >
                <InputField
                  label="UserName"
                  required
                  id="username"
                  className="w-full"
                  type="text"
                  message="*UserName is required"
                  placeholder="Enter your UserName"
                  register={register}
                  errors={errors}
                  readOnly
                />
                <InputField
                  label="Email"
                  required
                  id="email"
                  className="flex-1"
                  type="text"
                  message="*Email is required"
                  placeholder="Enter your Email"
                  register={register}
                  errors={errors}
                  readOnly
                />
                <InputField
                  label="Password"
                  required
                  autoFocus={isEditingPassword}
                  id="password"
                  className="w-full"
                  type="password"
                  message="*Password is required"
                  placeholder="Enter your Password"
                  register={register}
                  errors={errors}
                  readOnly={!isEditingPassword}
                  rules={passwordRules}
                />
                {!isEditingPassword ? null : (
                  <PasswordStrengthIndicator value={watch("password")} />
                )}{" "}
                {!isEditingPassword ? (
                  <Buttons
                    type="button"
                    onClickhandler={() =>
                      setIsEditingPassword(!isEditingPassword)
                    }
                    className="bg-customRed mb-0 w-fit px-4 py-2 rounded-md text-white"
                  >
                    Click To Edit Password
                  </Buttons>
                ) : (
                  <div className="flex items-center gap-2 ">
                    <Buttons
                      type="submit"
                      className="bg-btnColor mb-0 w-fit px-4 py-2 rounded-md text-white"
                    >
                      {passwordLoader ? "Loading.." : "Save"}
                    </Buttons>
                    <Buttons
                      type="button"
                      onClickhandler={() =>
                        setIsEditingPassword(!isEditingPassword)
                      }
                      className="bg-customRed mb-0 w-fit px-4 py-2 rounded-md text-white"
                    >
                      Cancel
                    </Buttons>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="lg:w-[70%] sm:w-[90%] w-full  mx-auto shadow-lg shadow-gray-300 p-8 rounded-md">
            <h1 className="text-slate-800 text-2xl font-bold  pb-4">
              Admin Actions
              <hr />
            </h1>

            <div className="py-4 flex sm:flex-row flex-col sm:items-center items-start gap-4">
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-lg font-semibold ">
                  Role:{" "}
                </label>
                <select
                  className=" px-8 py-1 rounded-md  border-2 uppercase border-slate-600  "
                  value={selectedRole}
                  onChange={handleRoleChange}
                >
                  {roles.map((role) => (
                    <option
                      className="bg-slate-200 flex flex-col gap-4 uppercase text-slate-700"
                      key={role.roleId}
                      value={role.roleName}
                    >
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="bg-btnColor hover:text-slate-300 px-4 py-2 rounded-md text-white "
                onClick={handleUpdateRole}
              >
                {updateRoleLoader ? "Loading..." : "Update Role"}
              </button>
            </div>

            <hr className="py-2" />
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Lock Account
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="lock"
                  checked={!user?.accountNonLocked}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-lock-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Account Expiry
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="expire"
                  checked={!user?.accountNonExpired}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-expiry-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Account Enabled
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="enabled"
                  checked={user?.enabled}
                  onChange={(e) =>
                    handleCheckboxChange(e, "/admin/update-enabled-status")
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-slate-600 text-sm font-semibold uppercase">
                  {" "}
                  Credentials Expired
                </label>
                <input
                  className="text-14 w-5 h-5"
                  type="checkbox"
                  name="credentialsExpire"
                  checked={!user?.credentialsNonExpired}
                  onChange={(e) =>
                    handleCheckboxChange(
                      e,
                      `/admin/update-credentials-expiry-status?userId=${userId}&expire=${user?.credentialsNonExpired}`
                    )
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
