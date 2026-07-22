import React from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Blocks } from "react-loader-spinner";
import Errors from "../Errors.js";
import { auditLogscolumn } from "../../utils/tableColumn.js";
import useAuditLogDetails from "../../hooks/useAuditLogDetails";

const AuditLogsDetails = () => {
  const { noteId } = useParams();
  const { auditLogs, loading, error } = useAuditLogDetails(noteId);

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
      <div className="py-6">
        {auditLogs.length > 0 && (
          <h1 className="text-center sm:text-2xl text-lg font-bold text-slate-800 ">
            Audit Log for Note ID - {noteId}
          </h1>
        )}
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
      ) : auditLogs.length === 0 ? (
        <Errors message="Invalid NoteId" />
      ) : (
        <div className="overflow-x-auto w-full">
          <DataGrid
            className="w-fit mx-auto px-0"
            rows={rows}
            columns={auditLogscolumn}
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
        </div>
      )}
    </div>
  );
};

export default AuditLogsDetails;
