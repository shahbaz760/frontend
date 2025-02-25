import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { MentionsTargetElement, MessageBubbleAlignment } from 'src/app/pages/Enums/Enums'
import { CometChatTextFormatter } from 'src/utils/formatters';
interface IMessageTranslationBubbleProps {
  /** 
   * The text that has been translated.
   */
  translatedText: string;

  /** 
   * The alignment of the message bubble (left or right).
   */
  alignment: MessageBubbleAlignment;

  /** 
   * Optional help text to display below the translated text.
   * Defaults to a localized message.
   */
  helpText?: string;

  /** 
   * Optional array of text formatters to apply to the translated text.
   */
  textFormatters?: Array<CometChatTextFormatter>;

  /** 
   * Optional React children to render inside the bubble.
   */
  children?: ReactNode;

  /* boolean value to toggle styling for sender and receiver message */
  isSentByMe?: boolean;
}

/**
 * Default props for the MessageTranslationBubble component.
 * 
 * @type {Partial<IMessageTranslationBubbleProps>}
 */
const defaultProps: Partial<IMessageTranslationBubbleProps> = {
  translatedText: "",
  alignment: MessageBubbleAlignment.right,
  helpText: "Text Translate",
  textFormatters: [],
  isSentByMe: true
}

/**
 * Renders a message translation bubble that displays translated text with optional formatting and help text.
 * 
 * @param {IMessageTranslationBubbleProps} props - The props for the component.
 * @returns {JSX.Element | null} The rendered component or null if no translated text is provided.
 */
const MessageTranslationBubble = (props: IMessageTranslationBubbleProps) => {

  const { children, helpText, translatedText, alignment, textFormatters, isSentByMe } = { ...defaultProps, ...props }
  const textElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (textFormatters) {

      const textElement = textElementRef.current;

      let finalText: string | void = translatedText;

      if (textFormatters && textFormatters.length) {
        textFormatters.forEach((formatter: CometChatTextFormatter) => {
          //@ts-ignore
          finalText = formatter.getFormattedText(finalText!, {
            mentionsTargetElement: MentionsTargetElement.textbubble,
          });
        });
      }
      textElement!.textContent = "";

      pasteHtml(textElement, finalText);
    }
  }, [textFormatters]);

  /**
   * Inserts HTML content into a text element and applies text formatters if any.
   * 
   * @param {HTMLDivElement} textElement - The target element to insert HTML content into.
   * @param {string} html - The HTML content to insert.
   */
  function pasteHtml(textElement: HTMLDivElement | null, html: string) {
    try {
      let el = document.createElement("div");
      el.innerHTML = html;
      let frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        if (node instanceof HTMLElement) {
          if (textFormatters && textFormatters.length) {
            for (let i = 0; i < textFormatters.length; i++) {
              node = textFormatters[i].registerEventListeners(
                node,
                node.classList
              );
            }
          }
          frag.appendChild(node);
        }
        lastNode = frag.appendChild(node);
      }
      textElement?.appendChild(frag);
    } catch (error) {
      console.log(error);
    }
  }

  if (!translatedText && translatedText?.trim().length) {
    return null
  }

  return (
    <div className="cometchat">
      <div
        className={`cometchat-tanslation-bubble ${!isSentByMe ? "cometchat-tanslation-bubble-incoming" : "cometchat-tanslation-bubble-outgoing"}`}
      >
        <div style={{ display: "flex", gap: "8px", flexDirection: "column", width: "100%" }}>
          <div
            className="cometchat-tanslation-bubble__original-text"
          >
            {children}
          </div>
          <div
            className="cometchat-tanslation-bubble__separator"
          />
          <div
            ref={textElementRef}
            className="cometchat-tanslation-bubble__translated-text"
          />
        </div>
        <div
          className="cometchat-tanslation-bubble__helper-text"
        >
          {helpText}
        </div>
      </div>
    </div>
  )
}

export { MessageTranslationBubble };