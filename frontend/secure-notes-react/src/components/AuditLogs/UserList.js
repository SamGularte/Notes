import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Errors from "../Errors.js";
import useUsers from "../../hooks/useUsers";
import { userListsColumns } from "./UserListColumns";
import LoadingSpinner from "../LoadingSpinner";

const UserList = () => {
  const { users, loading, error } = useUsers();

  const rows = users.map((item) => ({
    id: item.userId,
    username: item.userName,
    email: item.email,
    created: item.createdDateFormatted,
    status: item.enabled ? "Active" : "Inactive",
  }));

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          All Users
        </h1>
      </div>
      <div className="overflow-x-auto w-full mx-auto">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataGrid
            className="w-fit mx-auto"
            rows={rows}
            columns={userListsColumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 6,
                },
              },
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[6]}
            disableColumnResize
          />
        )}
      </div>
    </div>
  );
};

export default UserList;
