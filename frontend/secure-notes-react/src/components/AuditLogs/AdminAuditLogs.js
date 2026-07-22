import React from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import { auditLogsTruncateTexts } from "../../utils/truncateText.js";
import Errors from "../Errors.js";
import { MdDateRange } from "react-icons/md";
import { parseContent } from "../../utils/parseContent";
import useAdminAuditLogs from "../../hooks/useAdminAuditLogs";

export const auditLogcolumns = [
  {
    field: "actions",
    headerName: "Action",
    width: 160,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal  border",
    renderHeader: (params) => <span>Action</span>,
  },
  {
    field: "username",
    headerName: "UserName",
    width: 180,
    editable: false,
    disableColumnMenu: true,
    headerAlign: "center",
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal  border",
    renderHeader: (params) => <span>UserName</span>,
  },
  {
    field: "timestamp",
    headerName: "TimeStamp",
    disableColumnMenu: true,
    width: 220,
    editable: false,
    headerAlign: "center",
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal  border",
    renderHeader: (params) => <span>TimeStamp</span>,
    renderCell: (params) => {
      return (
        <div className=" flex  items-center justify-center  gap-1 ">
          <span>
            <MdDateRange className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.timestampFormatted}</span>
        </div>
      );
    },
  },
  {
    field: "noteid",
    headerName: "NoteId",
    disableColumnMenu: true,
    width: 150,
    editable: false,
    headerAlign: "center",
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal  border",
    renderHeader: (params) => <span>NoteId</span>,
  },
  {
    field: "note",
    headerName: "Note Content",
    width: 220,
    editable: false,
    headerAlign: "center",
    disableColumnMenu: true,
    align: "center",
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal  border",
    renderHeader: (params) => <span>Note Content</span>,
    renderCell: (params) => {
      const contents = parseContent(params?.value);
      const response = auditLogsTruncateTexts(contents);
      return <p className=" text-slate-700 text-center   ">{response}</p>;
    },
  },
  {
    field: "action",
    headerName: "Action",
    width: 150,
    editable: false,
    headerAlign: "center",
    align: "center",
    headerClassName: "text-black font-semibold ",
    cellClassName: "text-slate-700 font-normal  ",
    sortable: false,
    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      return (
        <Link
          to={`/admin/audit-logs/${params.row.noteId}`}
          className="h-full flex justify-center  items-center   "
        >
          <button className="bg-btnColor text-white px-4 flex justify-center items-center  h-9 rounded-md ">
            Views
          </button>
        </Link>
      );
    },
  },
];

const AdminAuditLogs = () => {
  const { auditLogs, error, loading } = useAdminAuditLogs();

  const rows = auditLogs.map((item) => ({
    id: item.id,
    noteId: item.noteId,
    actions: item.action,
    username: item.username,
    timestamp: item.timestampFormatted,
    noteid: item.noteId,
    note: item.noteContent,
  }));

  if (error) {
    return <Errors message={error} />;
  }

  return (
    <div className="p-4">
      <div className="py-4">
        <h1 className="text-center text-2xl font-bold text-slate-800 uppercase">
          Audit Logs
        </h1>
      </div>
      {loading ? (
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
        <div className="overflow-x-auto w-full mx-auto">
          <DataGrid
            className="w-fit mx-auto px-0"
            rows={rows}
            columns={auditLogcolumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 6,
                },
              },
            }}
            pageSizeOptions={[6]}
            disableRowSelectionOnClick
            disableColumnResize
          />
        </div>
      )}
    </div>
  );
};

export default AdminAuditLogs;
