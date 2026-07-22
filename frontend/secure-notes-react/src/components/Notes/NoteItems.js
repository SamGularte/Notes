import { MdRemoveRedEye } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import { IconButton } from "@mui/material";
import { truncateText } from "../../utils/truncateText";
import { Link } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";

const NoteItems = ({ parsedContent, id, createdAtFormatted }) => {
  return (
    <div className="sm:px-5 px-2 py-5 shadow-md bg-noteColor shadow-white rounded-lg min-h-96 max-h-96 relative overflow-hidden ">
      <p
        className="text-black font-customWeight ql-editor"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(parsedContent)) }}
      ></p>
      <div className="flex justify-between items-center  absolute bottom-5 sm:px-5 px-2 left-0 w-full text-slate-700">
        <span>{createdAtFormatted}</span>
        <Link to={`/notes/${id}`}>
          {" "}
          <Tooltip title="View Note">
            <IconButton>
              <MdRemoveRedEye className="text-slate-700" />
            </IconButton>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
};

export default NoteItems;
