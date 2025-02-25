import FuseLoading from "@fuse/core/FuseLoading";
import { Typography } from "@mui/material";
import {
  EditWhiteBoardData,
  addWhiteBoardData,
  getWhiteBoardData,
} from "app/store/Projects";
import { WhiteBoardData } from "app/store/Projects/Interface";
import { useAppDispatch } from "app/store/store";
import { NoDataFound } from "public/assets/icons/common";
import { useEffect, useRef, useState } from "react";
import { DrawIoEmbed, DrawIoEmbedRef } from "react-drawio";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { ROLES } from "src/app/constants/constants";
import { getUserDetail } from "src/utils";
import WhiteBoardName from "./WhiteBoardName";

function WhiteBoard({
  whiteBoardId,
  setWhiteBoardId,
  fetchWiteBoardList,
  tabId,
}) {
  const client_id = getUserDetail();
  const [data, setData] = useState("");
  const [show, setShow] = useState(false);
  const [loadingDrawIo, setLoadingDrawIo] = useState(true);
  const [imgData, setImgData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const drawioRef = useRef<DrawIoEmbedRef>(null);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [load, setLoad] = useState(false);
  const [boardname, setBoardName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (
      client_id &&
      client_id.id &&
      (client_id.role_id === ROLES.CLIENT ||
        client_id.role_id === ROLES.ADMIN ||
        client_id.role_id === ROLES.USER || client_id.role_id === ROLES.AGENT)
    ) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [client_id]);

  useEffect(() => {
    if (tabId) {
      drawioRef.current = null;

      fetchData();
    }
  }, [tabId]);

  const fetchData = async () => {
    setLoadingDrawIo(true);
    setLoading(true);
    try {
      const res = await dispatch(getWhiteBoardData(tabId));
      if (res?.payload?.data) {
        if (res.payload.data.data) {
          setBoardName(res.payload.data.data.name);
          // if (res.payload.data.data.xml_data)
          setData(res.payload.data.data.xml_data || "");
          if (res.payload.data.data.xml_img)
            setImgData(res.payload.data.data.xml_img);
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

  const exportImage = () => {
    if (drawioRef.current) {
      drawioRef.current.exportDiagram({
        format: "png",
      });
    }
  };

  const onSaveEdit = (data) => {
    if (data.xml.includes("/svg+xml")) {
      setData(data.xml);
      exportImage();
    }
  };

  useEffect(() => {
    if (tabId) {
      if (imgData && !loading && data) {
        saveEditData();
      }
    }
  }, [imgData]);

  const saveData = async (name) => {
    try {
      const payload: WhiteBoardData = {
        project_id: id as string,
        xml_data: data,
        xml_img: imgData,
        name: "WhiteBoard",
        project_menu_id: Number(tabId),
      };
      const res = await dispatch(addWhiteBoardData(payload));
      setWhiteBoardId(res?.payload?.data?.data?.id);
      if (res?.payload?.data && res?.payload?.data.status) {
        toast.success(res?.payload?.data?.message);
      } else {
        toast.error(res?.payload?.data?.message);
      }
      fetchWiteBoardList();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Unable to save Whiteboard");
    }
  };

  const saveEditData = async () => {
    try {
      const payload: any = {
        // white_board_id: whiteBoardId as string,
        xml_data: data,
        xml_img: imgData,
        name: boardname,
        project_menu_id: Number(tabId),
      };
      const res = await dispatch(EditWhiteBoardData(payload));
      if (res?.payload?.data && res?.payload?.data.status) {
        toast.success(res?.payload?.data?.message);
      } else {
        toast.error(res?.payload?.data?.message);
      }
      fetchWiteBoardList();
      setBoardName("");
      setWhiteBoardId(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Unable to save Whiteboard");
    }
  };

  return (
    <>
      <div className="px-28 flex gap-20 flex-wrap lg:flex-nowrap h-[calc(100vh-270px)] !overflow-x-auto ">
        <div className="w-full h-full bg-white rounded-lg shadow-sm flex justify-center items-center relative">
          {(loading || (show && loadingDrawIo)) && (
            <div className="w-full h-full flex justify-center items-center absolute">
              <FuseLoading />
            </div>
          )}

          {!loading && show && (
            <div
              className={`w-full h-full bg-white rounded-lg shadow-sm customWhitebored ${loadingDrawIo ? "opacity-0" : "opacity-100"
                }`}
            >
              <DrawIoEmbed
                ref={drawioRef}
                xml={data}
                urlParameters={{
                  ui: "kennedy",
                  spin: false,
                  libraries: false,
                  saveAndExit: false,
                  noExitBtn: true,
                }}
                onLoad={(data) => {
                  setLoadingDrawIo(false);
                  if (!data.xml) {
                    drawioRef.current.template({});
                  }
                }}
                configuration={{
                  spinner: false,
                  toolbar: false,
                  menubar: false,
                  css: ` 
                 
                   .geEditor .geBigButton {
                   min-width:60px !important;
                    background: #4f46e5 !important;
                    border-radius:20px !important;
                     color:#fff !important;
                      font-size:16px !important
                  }     
                           
                  .geEditor .geBigButton:hover {
                  background:#3730a3 !important; 
                  }
                 .geBtn{
                 height:30px !important ;
                  min-width:100px !important;
                  background:none !important;
                   border-radius:20px !important;
                   border:1px solid #4f46e5 !important;
                   color:#4f46e5 !important;
                   font-size:16px !important
                    }             
                  
                .gePrimaryBtn {
                  height:30px !important ;
                  min-width:100px !important;
                    background: #4f46e5 !important;
                    border-radius:20px !important;
                     color:#fff !important;
                      font-size:16px !important
                  }
                // .geDialog{
                // width:450px !important
                // }
                 .geDialog div{
                 text-align:left !important
                 }
                `,
                }}
                onExport={(data) => {
                  if (data.data.includes("/png")) {
                    setImgData(data.data);
                  }
                }}
                onSave={onSaveEdit}
              />
            </div>
          )}
        </div>
      </div>

      <WhiteBoardName
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        saveData={saveData}
      />
    </>
  );
}
export default WhiteBoard;
