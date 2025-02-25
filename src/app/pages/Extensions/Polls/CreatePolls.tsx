import React, { useState, useEffect } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { PollsConstants } from './PollsConstants';
import { CometChatButton } from '../../BaseComponents/CometChatButton/CometChatButton';
import { CometChatUIKitConstants } from '../../constants/CometChatUIKitConstants';


interface CreatePollProps {
  /** 
    * Title for the poll creation form.
    * Optional, defaults to localized "CREATE_POLL".
    */
  title?: string;

  /** 
   * User object if the poll is directed to a specific user.
   * Optional.
   */
  user?: CometChat.User;

  /** 
   * Group object if the poll is directed to a specific group.
   * Optional.
   */
  group?: CometChat.Group;

  /** 
   * Callback function to be called when the close button is clicked.
   * Optional.
   */
  ccCloseClicked?: () => void;

  /** 
   * Default number of answer options to display initially.
   * Optional, defaults to 3.
   */
  defaultAnswers?: number;

  /** 
   * Placeholder text for the poll question input field.
   * Optional, defaults to localized "QUESTION".
   */
  questionPlaceholderText?: string;

  /** 
   * Placeholder text for the answer input fields.
   * Optional, defaults to localized "ANSWER".
   */
  answerPlaceholderText?: string;

  /** 
   * Help text for the answer input fields.
   * Optional, defaults to localized "SET_THE_ANSWERS".
   */
  answerHelpText?: string;

  /** 
   * Text to display for adding additional answer options.
   * Optional, defaults to localized "ADD_ANOTHER_ANSWER".
   */
  addAnswerText?: string;

  /** 
   * URL of the add answer icon image.
   * Optional, defaults to a predefined plus icon.
   */
  addAnswerIconURL?: string;

  /** 
   * Text to display on the create poll button.
   * Optional, defaults to localized "CREATE".
   */
  createPollButtonText?: string;
}

/**
 * CreatePoll component that provides a form to create a new poll.
 * 
 * @param {CreatePollProps} props - The props for the component.
 * @returns {JSX.Element} The rendered CreatePoll component.
 */
const CreatePoll: React.FC<CreatePollProps> = ({
  title = "Create Poll",
  user,
  group,
  ccCloseClicked,
  defaultAnswers = 2,
  questionPlaceholderText = "Ask question",
  answerPlaceholderText = "Enter your option",
  answerHelpText = "Options",
  addAnswerText = "Add Option",
  createPollButtonText = "Create",
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [inputOptionItems, setInputOptionItems] = useState<{ key: string; value: string }[]>([]);
  const [isErrorOrWarning, setIsErrorOrWarning] = useState(false);
  const [errorText, setErrorText] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatePollEnabled, setIsCreatePollEnabled] = useState(false);

  const [type, setType] = useState<string>('');

  useEffect(() => {
    const initializeOptions = () => {
      setInputOptionItems(Array.from({ length: defaultAnswers }, () => ({ key: '', value: '' })));
    };

    if (user) {
      setType(CometChatUIKitConstants.MessageReceiverType.user);
    } else if (group) {
      setType(CometChatUIKitConstants.MessageReceiverType.group);
    }

    initializeOptions();
  }, [user, group, defaultAnswers]);

  useEffect(() => {
    if (inputOptionItems.length >= 12) {
      setIsErrorOrWarning(true);
      setErrorText("You’ve reached the limit. You can add up to 12 options.")
    } else {
      setIsErrorOrWarning(false);
      setErrorText("")
    }
  }, [inputOptionItems.length])

  useEffect(() => {
    const inputValue = inputOptionItems.map((item) => item.value).filter((value) => value !== '');
    if (inputValue.length >= 2 && !(inputQuestion.trim().length === 0)) {
      setIsCreatePollEnabled(true)
    } else {
      setIsCreatePollEnabled(false)
    }

  }, [inputQuestion, inputOptionItems])

  /**
   * Adds a new option to the poll form.
   */
  const addPollOption = () => {
    setInputOptionItems((prevItems) => [...prevItems, { key: '', value: '' }]);
  };

  /**
   * Removes an option from the poll form.
   * 
   * @param {number} index - The index of the option to remove.
   */
  const removePollOption = (index: number) => {
    setInputOptionItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  /**
  * Creates the poll and submits.
  * 
  * @returns {boolean} Returns true if the poll creation is initiated, false if there's an error.
  */
  const createPoll = (): boolean => {

    const inputValue = inputOptionItems.map((item) => item.value).filter((value) => value !== '');
    if (inputQuestion.trim().length === 0 || inputValue.length !== inputOptionItems.length) {
      setIsErrorOrWarning(true);
      setErrorText("Please fill in all required fields before creating a poll.")
      return false;
    }
    setIsLoading(true)
    setIsErrorOrWarning(false);

    const receiverId =
      type === CometChat.RECEIVER_TYPE.USER
        ? user?.getUid() ?? (user as any)?.uid
        : group?.getGuid() ?? (group as any)?.guid;


    let optionList: any[] = [
      ...inputValue
    ];
    CometChat.callExtension(PollsConstants.polls, PollsConstants.post, PollsConstants.v2_create, {
      question: inputQuestion,
      options: optionList,
      receiver: receiverId,
      receiverType: type,
    })
      .then((response: any) => {
        setIsLoading(false)
        if (response?.success) {
          ccCloseClicked?.();
        }
      })
      .catch(() => {
        setIsLoading(false)
        setIsErrorOrWarning(true);
        setErrorText("Something went wrong. Please try again.")
      });

    return true;
  };

  return (
    <div className="cometchat" style={{ width: "fit-content", height: "fit-content" }}>
      <div className="cometchat-create-poll">
        <div className="cometchat-create-poll__header">
          <div className="cometchat-create-poll__header-title">
            {title}
          </div>
          <button
            className="cometchat-create-poll__header-close-icon"
            onClick={() => ccCloseClicked && ccCloseClicked()}
          />
        </div>
        <div className="cometchat-create-poll__body">
          <div className="cometchat-create-poll__body-question">
            <div className="cometchat-create-poll__body-question-title">
              {"Questions"}
            </div>
            <input
              className="cometchat-create-poll__body-question-input"
              type="text"
              placeholder={questionPlaceholderText}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
            />
          </div>

          <div className="cometchat-create-poll__body-options-wrapper">
            <div className="cometchat-create-poll__body-options-title">
              {answerHelpText}
            </div>
            <div className="cometchat-create-poll__body-options">
              {inputOptionItems.map((option, i) => (
                <div key={i} className="cometchat-create-poll__body-option">
                  <input
                    className="cometchat-create-poll__body-option-input"
                    type="text"
                    placeholder={answerPlaceholderText}
                    value={option.value}
                    onChange={(e) =>
                      setInputOptionItems((prevItems) =>
                        prevItems.map((item, index) => (index === i ? { ...item, value: e.target.value } : item))
                      )
                    }

                  />
                  {i > 1 &&
                    <button
                      className="cometchat-create-poll__body-option-remove-button"
                      onClick={() => removePollOption(i)}
                    />
                  }
                </div>
              ))}
            </div>
            <button
              className={`cometchat-create-poll__body-options-add-button ${(inputOptionItems.length >= 12) ? "cometchat-create-poll__body-options-add-button-disabled" : ""}`}
              disabled={(inputOptionItems.length >= 12)}
              onClick={addPollOption}>+ {addAnswerText}
            </button>
          </div>

        </div>
        <div className='cometchat-create-poll__footer'>
          {isErrorOrWarning && <div className='cometchat-create-poll__error'>
            <div className='cometchat-create-poll__error-icon'></div>
            <div className='cometchat-create-poll__error-text'>
              {errorText}
            </div>

          </div>
          }
          <div className={`cometchat-create-poll__button ${!isCreatePollEnabled ? "cometchat-create-poll__button-disabled" : " "}`}>
            <CometChatButton
              onClick={createPoll} disabled={!isCreatePollEnabled} isLoading={isLoading && isCreatePollEnabled} text={createPollButtonText} />
          </div>

        </div>
      </div>
    </div>
  );
};

export { CreatePoll };