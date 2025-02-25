import FuseLoading from "@fuse/core/FuseLoading";
import {
  EditDocBoardData,
  addDocBoardData,
  getDocBoardData,
} from "app/store/Projects";
import { useAppDispatch } from "app/store/store";
import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router";
import { ROLES } from "src/app/constants/constants";
import { getUserDetail } from "src/utils";

const modules = {
  toolbar: [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["clean"],
    ["code-block"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["formula"],
    ["blockquote", "code-block"],
    [{ direction: "rtl" }],
    [{ script: "sub" }, { script: "super" }],
    ["link", "image", "video", "formula"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];

function DocumentBoard({ DocId, setDocId, fetchWiteBoardList, length, tabId }) {
  const client_id = getUserDetail();
  const [show, setShow] = useState(true);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [docname, setDocName] = useState("");
  const dispatch = useAppDispatch();
  const prevValueRef = useRef("");

  // useRef to store the debounced function

  const debouncedSaveData = useRef(
    debounce(async (newValue, length) => {
      try {
        const payload: any = {
          project_id: id,
          doc_file: newValue,
          name: `Document`,
          project_menu_id: Number(tabId),
        };
        const res = await dispatch(addDocBoardData(payload));
        setDocId(res?.payload?.data?.data?.id);
        if (res?.payload?.data && res?.payload?.data.status) {
          toast.success(res?.payload?.data?.message);
        } else {
          toast.error(res?.payload?.data?.message);
        }
        fetchWiteBoardList();
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Unable to save Document");
      }
    }, 1000)
  ).current;

  const debouncedUpdateData = useRef(
    debounce(async (newValue: string, tabId: string | number) => {
      try {
        const payload: any = {
          // document_id,
          doc_file: newValue,
          name: docname,
          project_menu_id: Number(tabId),
        };
        const res = await dispatch(EditDocBoardData(payload));
        if (res?.payload?.data && res?.payload?.data.status) {
          toast.success(res?.payload?.data?.message);
        } else {
          toast.error(res?.payload?.data?.message);
        }
        fetchWiteBoardList();
        setDocName("");
        // setDocId(null)
      } catch (error) {
        console.error("Error saving data:", error);
        toast.error("Unable to save Document");
      }
    }, 1000)
  ).current;

  useEffect(() => {
    if (
      client_id &&
      client_id.id &&
      (client_id.role_id === ROLES.CLIENT || client_id.role_id === ROLES.ADMIN || client_id.role_id === ROLES.USER)
    ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [client_id]);

  useEffect(() => {
    if (tabId) {
      prevValueRef.current = "";
      fetchData();
    }
  }, [tabId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await dispatch(getDocBoardData(tabId));
      if (res?.payload?.data) {
        if (res.payload.data.data) {
          setDocName(res.payload.data.data?.name);
          // if (res.payload.data.data.doc_file)
          setValue(res.payload.data.data.doc_file || "<p></p>");
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Update the ref with the current value
    prevValueRef.current = value;
  }, [value]);

  const handleChange = (newValue) => {
    if (newValue !== prevValueRef.current) {
      setValue(newValue);
      if (tabId) {
        debouncedUpdateData(newValue, tabId);
      }
    }
  };

  return (
    <div className="px-28 flex gap-20 flex-wrap lg:flex-nowrap h-[calc(100vh-270px)]">
      <div className="w-full h-full bg-white rounded-lg shadow-sm flex justify-center items-center">
        {loading ? (
          <FuseLoading />
        ) : (
          <div className="w-full flex flex-col justify-between">
            <ReactQuill
              className="w-full h-[calc(100vh-330px)] "
              modules={show ? { ...modules, toolbar: false } : { ...modules }}
              formats={formats}
              style={{ fontSize: '18px' }}
              theme="snow"
              value={value}
              onChange={(e) => {
                handleChange(e);
              }} // Use the handleChange function
              readOnly={show}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default DocumentBoard;
