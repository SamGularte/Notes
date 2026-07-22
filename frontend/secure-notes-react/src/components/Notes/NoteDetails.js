import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "react-quill/dist/quill.snow.css";
import { Blocks } from "react-loader-spinner";
import ReactQuill from "react-quill";
import DOMPurify from "dompurify";
import { DataGrid } from "@mui/x-data-grid";
import Buttons from "../../utils/Buttons";
import Errors from "../Errors";
import toast from "react-hot-toast";
import Modals from "../PopModal";
import { auditLogscolumn } from "../../utils/tableColumn";
import useNoteDetails from "../../hooks/useNoteDetails";

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [noteEditLoader, setNoteEditLoader] = useState(false);
  const [editEnable, setEditEnable] = useState(false);

  const { note, auditLogs, error, isAdmin, loading, fetchNoteDetails } =
    useNoteDetails(id);

  useEffect(() => {
    if (note?.parsedContent) {
      setEditorContent(note.parsedContent);
    }
  }, [note?.parsedContent]);

  const handleChange = (content) => {
    setEditorContent(content);
  };

  const onNoteEditHandler = async () => {
    if (editorContent.trim().length === 0) {
      return toast.error("Note content Shouldn't be empty");
    }
    setNoteEditLoader(true);
    try {
      const noteData = { content: editorContent };
      await api.put(`/notes/${id}`, noteData);
      toast.success("Note update successful");
      setEditEnable(false);
      fetchNoteDetails();
    } catch (err) {
      toast.error("Update Note Failed");
    } finally {
      setNoteEditLoader(false);
    }
  };

  const onBackHandler = () => {
    navigate(-1);
  };

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
    <div className=" min-h-[calc(100vh-74px)] md:px-10 md:py-8 sm:px-6 py-4 px-4">
      <Buttons
        onClickhandler={onBackHandler}
        className="bg-btnColor px-4 py-2 rounded-md text-white hover:text-slate-200 mb-3"
      >
        Go Back
      </Buttons>
      <div className=" py-6 px-8 min-h-customHeight shadow-lg shadow-gray-300 rounded-md">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-96">
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
          <>
            <div className="flex justify-end py-2 gap-2">
              {!editEnable ? (
                <Buttons
                  onClickhandler={() => setEditEnable(!editEnable)}
                  className="bg-btnColor text-white px-3 py-1 rounded-md"
                >
                  Edit
                </Buttons>
              ) : (
                <Buttons
                  onClickhandler={() => setEditEnable(!editEnable)}
                  className="bg-customRed text-white px-3 py-1 rounded-md"
                >
                  Cancel
                </Buttons>
              )}
              {!editEnable && (
                <Buttons
                  onClickhandler={() => setModalOpen(true)}
                  className="bg-customRed text-white px-3 py-1 rounded-md"
                >
                  Delete
                </Buttons>
              )}
            </div>

            {editEnable ? (
              <>
                <div className="h-72 sm:mb-20 lg:mb-14 mb-28">
                  <ReactQuill
                    className="h-full"
                    value={editorContent}
                    onChange={handleChange}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, 4, 5, 6] }],
                        [{ size: [] }],
                        [
                          "bold",
                          "italic",
                          "underline",
                          "strike",
                          "blockquote",
                        ],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["clean"],
                      ],
                    }}
                  />
                  <Buttons
                    disabled={noteEditLoader}
                    onClickhandler={onNoteEditHandler}
                    className="bg-customRed md:mt-16 mt-28 text-white px-4 py-2 hover:text-slate-300 rounded-sm"
                  >
                    {noteEditLoader ? <span>Loading...</span> : " Update Note"}
                  </Buttons>
                </div>
              </>
            ) : (
              <div
                className="text-slate-900"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note?.parsedContent) }}
              />
            )}
          </>
        )}
      </div>

      {isAdmin && !editEnable && (
        <div className="mt-6 py-6 px-8 shadow-lg shadow-gray-300 rounded-md">
          <h1 className="text-2xl text-center text-slate-700 font-semibold uppercase pt-10 pb-4">
            Audit Logs
          </h1>
          <div className="overflow-x-auto">
            <DataGrid
              className="w-fit mx-auto"
              rows={rows}
              columns={auditLogscolumn}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 6 },
                },
              }}
              pageSizeOptions={[6]}
              disableRowSelectionOnClick
              disableColumnResize
              autoHeight
              sx={{ minHeight: 200 }}
              localeText={{ noRowsLabel: "No audit logs found for this note" }}
            />
          </div>
        </div>
      )}

      <Modals open={modalOpen} setOpen={setModalOpen} noteId={id} />
    </div>
  );
};

export default NoteDetails;
