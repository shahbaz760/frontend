import { FormLabel, Grid, IconButton } from "@mui/material";
import { CrossGreyIcon } from "public/assets/icons/common";
import { MicIcon } from "public/assets/icons/task-icons";
import { useEffect, useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import CommonChip from "../chip";
import MicrophonePopup from "../client/MicrophonePopup";
import ActionModal from "../ActionModal";
const AudioRecorderComponent = ({
  audioBlob,
  setAudioBlob,
  edit = false,
  isForChat = false,
  isForPreview = false,
  closeAudioBox = false,
  setCloseAudioBox = null,
  handleEditTaskTitle = null,
  deleteAudio = null,
}) => {
  const recorderControls = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
  });
  const [audioUrl, setAudioUrl] = useState(null);
  const [visible, setVisible] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [save, setSave] = useState(false);
  const [isMicrophoneModal, setIsMicrophoneModal] = useState(false);
  const [isRecordingModal, setIsRecordingModal] = useState(false);
  const [isDeleteRecording, setIsDeleteRecording] = useState(false);
  const urlForImage = import.meta.env.VITE_API_BASE_IMAGE_URL;

  useEffect(() => {
    if (audioBlob && edit && !isLoaded) {
      setAudioUrl(audioBlob);
      setVisible(true);
      setIsLoaded(true);
    }
  }, [audioBlob]);

  useEffect(() => {
    if (closeAudioBox) {
      handleCross();
    }
  }, [closeAudioBox]);

  const handleMicroAccess = async () => {
    setVisible(true);
    try {
      const permission = await navigator.permissions.query({
        //@ts-ignore
        name: "microphone",
      });
      if (permission.state === "denied") {
        setAudioBlob(null);
        setAudioUrl(null);
        recorderControls.startRecording();
        setIsMicrophoneModal(true);
        setVisible(false);
      } else if (permission.state === "granted") {
        setAudioBlob(null);
        setAudioUrl(null);
        recorderControls.startRecording();
        setVisible(true);
        setIsMicrophoneModal(false);
      } else if (permission.state === "prompt") {
        // Try to access the microphone to trigger the prompt
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          // If access is granted
          setIsMicrophoneModal(false);
        } catch (error) {
          // If access is denied or the prompt is closed without granting access
          setIsMicrophoneModal(true);
          setVisible(false);
        }
      }
      permission.onchange = () => {
        if (permission.state === "denied") {
          recorderControls.startRecording();
          setIsMicrophoneModal(true);
          setVisible(false);
        } else if (permission.state === "granted") {
          // recorderControls.startRecording();
          // setVisible(true);
          setIsMicrophoneModal(false);
        } else if (permission.state === "prompt") {
          // Try to access the microphone to trigger the prompt
          navigator.mediaDevices.getUserMedia({ audio: true }).then(
            () => {
              // If access is granted
              setIsMicrophoneModal(false);
            },
            () => {
              setIsMicrophoneModal(true);
              setVisible(false);
            }
          );
        }
      };
    } catch (error) {
      console.error("Error checking microphone permission:", error);
    }
  };

  const addAudioElement = (blob) => {
    if (discard) {
      if (deleteAudio != null) {
        // deleteAudio()
      }
      // If discarding, do not create or append any audio element
      // setAudioUrl(null);
      if (!audioUrl) {
        setVisible(false);
      }

      return; // Exit the function early
    }
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    setAudioUrl(url);
    setAudioBlob(blob);
    if (handleEditTaskTitle != null) {
      handleEditTaskTitle([], null, "0", [], blob);
    }
    // audio.controls = true;
    // document.body.appendChild(audio);
    setSave(false);
  };

  const handleDiscard = () => {
    setDiscard(true);
    recorderControls.stopRecording();
    setAudioUrl(null);
    setAudioBlob(null);
    setVisible(false);
    // setTimeout(() => setVisible(true), 0); // Toggle visibility to force re-render
  };
  // const handleCross = () => {
  //   setDiscard(true);
  //   recorderControls.stopRecording();

  //   if (!isForChat) {
  //     if (deleteAudio != null) {
  //       deleteAudio();
  //     }
  //     setAudioBlob("");
  //     // setAudioUrl("");
  //   }
  //   // setVisible(false);
  //   // recorderControls.stopRecording();
  //   // addAudioElement(null);
  // };
  const handleSave = () => {
    setDiscard(false);
    setSave(true);
    recorderControls.stopRecording();
    // setCloseAudioBox(false)
  };
  const handleCross = () => {
    setDiscard(true);
    recorderControls.stopRecording(); // Stop the recorder if active
    setAudioBlob(null); // Clear the audio blob
    setAudioUrl(null); // Reset the audio URL
    setVisible(false); // Hide the audio container
  };
  useEffect(() => {
    if (!audioBlob) {
      setVisible(false);
    }
  }, [audioBlob]);

  return (
    <>
      <Grid item md={edit ? 6 : 6}>
        {!isForChat && !isForPreview && (
          <FormLabel className="block text-[16px] font-medium text-[#111827] mb-5 ">
            Voice Memo
          </FormLabel>
        )}
        {/* <Grid container spacing={1}> */}
        <Grid item md={12}>
          {isForChat ? (
            <IconButton
              disabled={recorderControls.isRecording}
              onClick={(e) => {
                e.stopPropagation();
                setAudioBlob(null);
                setAudioUrl(null);
                handleMicroAccess();
              }}
              sx={{
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  cursor: "pointer",
                }}
              >
                <MicIcon width={20} height={20} color="#757982" />
              </span>
            </IconButton>
          ) : (
            !isForPreview && (
              <CommonChip
                colorSecondary
                // className="w-full"
                disabled={recorderControls.isRecording}
                label="Record voice memo"
                icon={<MicIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  if (audioUrl) {
                    setIsRecordingModal(true);
                  } else {
                    setAudioBlob(null);
                    setAudioUrl(null);
                    handleMicroAccess();
                  }
                }}
                style={{ border: "0.5px solid #4F46E5" }}
                className="w-full"
              />
            )
          )}
          {visible && (
            <div
              className={`my-10 flex flex-col gap-[10px]  audio-container  overflow-x-auto
                 ${isForChat ? "forChatStyle" : isForPreview ? "forPreviewStyle" : ""}`}
            >
              {!audioUrl && (
                <div>
                  <AudioRecorder
                    onRecordingComplete={(blob) => {
                      if (discard) {
                        // Pass null to addAudioElement if discarded
                        addAudioElement(null);
                      } else {
                        // Pass the blob to addAudioElement if saved
                        addAudioElement(blob);
                      }
                    }}
                    recorderControls={recorderControls}
                    // showVisualizer={true}
                  />
                  <div className="mt-10">
                    <button
                      onClick={(e) => {
                        e?.stopPropagation();
                        // recorderControls.stopRecording();
                        handleSave();
                      }}
                      className={`
                      text-[#4F46E5]
                      text-[16px] font-500 underline mr-10`}
                    >
                      {isForChat ? "Send" : "Save"}
                    </button>{" "}
                    <button
                      onClick={handleDiscard}
                      // disabled={recordingAudio}
                      className={`
                      text-[#4F46E5]
                      text-[16px] font-500 underline mr-10`}
                      id="cancel-voice-memo"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {audioUrl && (
                <div
                  style={{
                    position: "relative",
                  }}
                >
                  {!isForPreview && (
                    <div
                      className="border-1 border-solid rounded-full  absolute right-[-2px] top-[-4px] flex  cursor-pointer z-10 items-center justify-center 
                    border-[#E7E8E9]"
                    >
                      <CrossGreyIcon
                        className="h-20 w-20 p-4"
                        fill="#757982"
                        onClick={() => {
                          // e.stopPropagation();
                          setIsDeleteRecording((prev) => !prev);
                        }}
                      />
                    </div>
                  )}
                  <div
                    className=" flex  mt-[1rem]"
                    style={{ alignItems: "center" }}
                  >
                    <audio src={audioUrl} controls></audio>
                  </div>
                </div>
              )}
            </div>
          )}
        </Grid>
      </Grid>
      <MicrophonePopup
        isOpen={isMicrophoneModal}
        setIsOpen={setIsMicrophoneModal}
        heading={`Whoops! Looks like you denied access`}
        media="micro"
      />
      <ActionModal
        modalTitle="Delete Voice Memo"
        modalSubTitle="There's an existing recording. Do you want to delete it and start a new one?"
        open={isRecordingModal}
        handleToggle={() => setIsRecordingModal((prev) => !prev)}
        type="delete"
        onDelete={() => {
          handleCross();
          setIsRecordingModal((prev) => !prev);
          handleMicroAccess();
        }}
      />
      <ActionModal
        modalTitle="Delete Attachment"
        modalSubTitle="Are you sure you want to delete this attachment?"
        open={isDeleteRecording}
        handleToggle={() => setIsDeleteRecording((prev) => !prev)}
        type="delete"
        onDelete={() => {
          handleCross();
          setIsDeleteRecording((prev) => !prev);
        }}
      />
    </>
  );
};
export default AudioRecorderComponent;
