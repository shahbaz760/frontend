import ListLoading from "@fuse/core/ListLoading";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { filterType } from "app/store/Agent group/Interface";
import {
  addKeyword,
  deleteKeyword,
  fetchEmail,
  getKeywordList,
} from "app/store/keyword";
import { useAppDispatch } from "app/store/store";
import { useFormik } from "formik";
import { CircleCrossBlue, NoDataFound } from "public/assets/icons/common";
import { KeywordPlusIcon } from "public/assets/icons/kayword";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import DeleteClient from "src/app/components/client/DeleteClient";
import InputField from "src/app/components/InputField";
import TitleBar from "src/app/components/TitleBar";
import { KeyWordSchema } from "src/formSchema";

interface Keyword {
  id?: number; // Optional property
  key_name?: string; // Optional property
  value?: string; // Optional property
}
const Keyword = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [emails, setEmails] = useState([]);
  const [isOpenDeletedModal, setIsOpenDeletedModal] = useState<boolean>(false);
  const [keywordId, setKeywordId] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [isDisable, setIsDisable] = useState<boolean>(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [previousEmail, setPreviousEmail] = useState([]);
  const [filters, setfilters] = useState<filterType>({
    start: 0,
    limit: -1,
  });
  const handleAddKeyword = async (values) => {
    setIsDisable(true);
    const payload: object = {
      key_name: values.key_name?.trim(),
    };
    const resultAction = await dispatch(addKeyword(payload));
    const newKeyword = resultAction?.payload?.data?.data;

    if (resultAction?.payload?.data?.status == 1)
      setKeywords((prev) => [
        ...prev,
        {
          id: newKeyword.id,
          key_name: newKeyword.key_name,
        },
      ]);
    setIsDisable(false);
    formik.resetForm();
  };
  const formik = useFormik({
    initialValues: {
      key_name: "",
    },
    validationSchema: KeyWordSchema,
    onSubmit: handleAddKeyword,
  });

  const dispatch = useAppDispatch();

  const handleDelete = async (id) => {
    // setIsLoading(true);
    setIsButtonLoading(true);
    try {
      const payload = await dispatch(deleteKeyword({ keyword_id: id }));
      if (payload?.payload?.data?.status == 1) {
        setKeywords((prev) => prev.filter((keyword) => keyword.id !== id));
        setIsOpenDeletedModal(false);
        toast.success(payload?.payload?.data?.message);
      } else {
        toast.error(payload?.payload?.data?.message);
      }
    } catch (error) {
    } finally {
      setIsButtonLoading(false);
      setIsLoading(false); // Reset loading state
    }
  };

  const fetchKeywords = async ({ loading = true }) => {
    setButtonDisable(true);
    setIsLoading(loading);
    try {
      const res = await dispatch(getKeywordList(filters));
      setEmails(
        res?.payload?.data?.data?.notification_emails
          .split(",")
          .map((email) => email.trim())
      );
      setPreviousEmail(
        res?.payload?.data?.data?.notification_emails
          .split(",")
          .map((email) => email.trim())
      );

      const keywordList = res?.payload?.data?.data?.list;
      if (keywordList) {
        setKeywords(keywordList);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch keyword list:", error);
      setIsLoading(false);
    }
  };
  const fetchEmailSave = async () => {
    setButtonDisable(true);
    setEmailLoading(true);
    const emailString = emails.join(", ");

    try {
      const res = await dispatch(fetchEmail({ email: emailString }));
      const keywordList = res?.payload?.data?.data?.list;
      setEmailLoading(false);

      fetchKeywords({ loading: false });
    } catch (error) {
      console.error("Failed to fetch keyword list:", error);
      setEmailLoading(false);
    }
  };

  useEffect(() => {
    fetchKeywords({});
  }, []);

  const [buttonDisable, setButtonDisable] = useState(false);

  useEffect(() => {
    // Sort and compare the arrays
    const areArraysDifferent = (arr1, arr2) => {
      if (arr1.length != arr2.length) return true;
      const sortedArr1 = [...arr1].sort();
      const sortedArr2 = [...arr2].sort();
      return !sortedArr1?.every((value, index) => value == sortedArr2[index]);
    };

    // Set loader to true if arrays are different
    if (areArraysDifferent(emails, previousEmail)) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [emails]);

  return (
    <>
      <TitleBar title="Keywords"></TitleBar>
      <div className="px-[15px] mb-[3rem]">
        <div className="bg-white rounded-lg shadow-sm px-28 py-20 min-h-320">
          <Typography className="text-[16px] font-500 text-[#111827] mb-[10px]">
            Add Emails
          </Typography>
          <div
            className="flex gap-10 sm:items-center  flex-col sm:flex-row  "
            // style={{ alignItems: "center" }}
          >
            <ReactMultiEmail
              placeholder="info@123gmail.com"
              emails={emails}
              onChange={setEmails}
              style={{
                background: "#F6F6F6",
                borderRadius: "7px",
                maxWidth: "92%",
              }}
              validateEmail={(email) => isEmail(email)}
              getLabel={(email, index, removeEmail) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    justifyContent: "space-between",
                    backgroundColor: "#EDEDFC",
                    color: "#4F46E5",
                    margin: "5px",
                    border: "0px",
                    padding: "5px 10px",
                    borderRadius: "21px",
                    fontSize: "14px",
                  }}
                >
                  {email}

                  <div onClick={() => removeEmail(index)}>
                    <CircleCrossBlue />
                  </div>
                </div>
              )}
            />
            <Button
              variant="contained"
              sx={{
                marginTop: 0.2,
                bgcolor: "#4F46E5",
                border: "1px solid transparent",
                color: "#fff",
                padding: "20px 23px !important",
                width: "104px",
                "&:hover": {
                  border: "1px solid #4F46E5",
                  bgcolor: "#3730a3",
                  color: "#fff",
                },
              }}
              className="text-[16px] font-400 "
              onClick={(e) => {
                setEmailLoading(true);
                fetchEmailSave();
              }}
              // startIcon={<AddIcon />}
              disabled={buttonDisable || emailLoading || emails.length == 0}
            >
              {emailLoading ? (
                <Box
                  marginTop={0}
                  id="spinner"
                  sx={{
                    "& > div": {
                      backgroundColor: "palette.secondary.main",
                    },
                  }}
                >
                  <div className="bounce1 mt-[-40px] !bg-[#4f46e5]" />
                  <div className="bounce2 mt-[-40px] !bg-[#4f46e5]" />
                  <div className="bounce3 mt-[-40px] !bg-[#4f46e5]" />
                </Box>
              ) : (
                "Save"
              )}
            </Button>
          </div>

          <Typography className="text-[16px] font-500 text-[#111827] mt-[32px]">
            Add Keyword
          </Typography>

          <div className="sm:!w-[350px] py-10 flex items-start gap-10 sm:flex-row ">
            <InputField
              formik={formik}
              placeholder="Enter Keyword"
              name="key_name"
              onChange={formik.handleChange}
              value={formik.values.key_name}
            />
            <Button
              variant="contained"
              sx={{
                marginTop: 0.2,
                bgcolor: "#4F46E5",
                border: "1px solid transparent",
                color: "#fff",
                padding: "20px 23px !important",
                "&:hover": {
                  border: "1px solid #4F46E5",
                  bgcolor: "#3730a3",
                  color: "#fff",
                },
              }}
              className="text-[16px] font-400 "
              onClick={(e) => {
                formik.handleSubmit();
                e.preventDefault();
              }}
              startIcon={<AddIcon />}
              disabled={!formik.values.key_name || isDisable}
            >
              Add
            </Button>
          </div>
          {isLoading ? (
            <ListLoading />
          ) : keywords?.length > 0 ? (
            <div className="flex flex-wrap w-full gap-10">
              {keywords.map((item) => {
                const shouldShowTooltip = item?.key_name?.length > 40;
                return (
                  <div
                    className="flex items-center bg-[#EDEDFC] w-fit gap-10 justify-center rounded-[21px] px-10 py-8"
                    key={item.id}
                  >
                    {" "}
                    {shouldShowTooltip ? (
                      <Tooltip
                        title={shouldShowTooltip ? item?.key_name : ""}
                        disableHoverListener={!shouldShowTooltip}
                      >
                        <Typography
                          className="text-[12px] font-500 text-[#4F46E5] truncate"
                          style={{ maxWidth: "100px" }}
                          sx={{
                            minWidth: 200,
                          }}
                        >
                          {item.key_name}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <>
                        <div>
                          <Typography className="text-[12px] font-500 text-[#4F46E5]">
                            {item.key_name}
                          </Typography>
                        </div>
                      </>
                    )}
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        setIsOpenDeletedModal(true);
                        setKeywordId(item.id);
                      }}
                    >
                      <KeywordPlusIcon />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="flex flex-col justify-center align-items-center gap-20 bg-[#F7F9FB] min-h-[400px] py-40"
              style={{ alignItems: "center" }}
            >
              <NoDataFound />
              <Typography className="text-[24px] text-center font-600 leading-normal">
                No keywords found !
              </Typography>
            </div>
          )}
        </div>
      </div>
      <DeleteClient
        isOpen={isOpenDeletedModal}
        setIsOpen={setIsOpenDeletedModal}
        onDelete={() => handleDelete(keywordId)}
        isLoading={isButtonLoading}
        heading={"Delete Keyword"}
        description={"Are you sure you want to delete this Keyword? "}
      />
    </>
  );
};

export default Keyword;
