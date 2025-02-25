import React, { JSX, useRef } from "react";


import { CometChat } from "@cometchat/chat-sdk-javascript";
import { useCometChatList } from "./useCometChatList";
import { CometChatSearchBar } from "../CometChatSearchBar/CometChatSearchBar";
import {
  useCometChatErrorHandler,
  useStateRef, useRefSync
} from "src/utils/CometChatCustomHooks";
import { TitleAlignment, States } from "../../Enums/Enums";
/**
 * Extracts the value associated with the passed key from the passed object
 *
 * @param key - Property on the `item` parameter
 * @param item - Any object
 * @returns String converted value associated with the `key` property of the `item`  object
 */
function getKeyValue<T>(key: keyof T, item: T): string {
  let res: string;

  const keyValue = item[key];
  if (typeof keyValue === "function") {
    const result = keyValue.call(item);
    if (typeof result === "undefined") {
      if ((item as any)?.id) {
        res = String((item as any)?.id);
      } else {
        res = String(result);
      }
    } else {
      res = String(result);
    }
  } else {
    res = String(keyValue);
  }

  return res;
}

export type DivElementRef = HTMLDivElement | null;

interface ListProps<T> {
  /**
   * Menu view of the component
   *
   * @defaultValue `""`
   */
  headerView?: JSX.Element;
  /**
   * Alignment of the `title` text
   *
   * @defaultValue `TitleAlignment.left`
   */
  titleAlignment?: TitleAlignment;
  /**
   * Hide the search bar
   *
   * @defaulValue `false`
   */
  hideSearch?: boolean;
  /**
   * Text to fill the search input with
   *
   * @defaultValue `""`
   */
  searchText?: string;
  /**
   * Function to call when the search input text changes
   *
   * @remarks
   * This function will only be called after 500ms of the search input text change
   */
  onSearch?: (searchStr: string) => void;
  /**
   * Image URL for the search icon to use in the search bar
   */
  searchIconURL?: string;
  /**
   * Text to be displayed when the search input has no value
   *
   * @defaultValue `"Search"`
   */
  searchPlaceholderText?: string;
  /**
   * List of objects to display
   */
  list: T[];
  /**
   * Custom list item view to be rendered for each object in the `list` prop
   */
  itemView: (item: T, itemIndex: number) => JSX.Element;
  /**
   * Function to call when the scrollbar is at the top-most position of the scrollable list
   */
  onScrolledToBottom?: () => Promise<any>;
  /**
   * Function to call when the scrollbar is at the bottom-most position of the scrollable list
   */
  onScrolledToTop?: () => Promise<any>;
  /**
   * Function to call when the scrollbar is not at the bottom-most position of the scrollable list
   */
  scrolledUpCallback?: (boolean?: boolean) => void;
  /**
   * Show alphabetical header
   *
   * @defaultValue `true`
   */
  showSectionHeader?: boolean;
  /**
   * Property on each object in the `list` prop
   *
   * @remarks
   * This property will be used to extract the section header character from each object in the `list` prop
   */
  sectionHeaderKey?: keyof T | string;
  /**
   * Property on each object in the `list` prop
   *
   * @remarks
   * This property will be used to extract the key value from each object in the `list` prop. The extracted key value is set as a `key` of a React element
   */
  listItemKey?: keyof T | string;
  /**
   * Fetch state of the component
   */
  state: States;
  /**
   * Custom view for the loading state of the component
   */
  loadingView?: JSX.Element;
  /**
   * Image URL for the default loading view
   */
  loadingIconURL?: string;
  /**
   * Hide error view
   *
   * @remarks
   * If set to true, hides the default and the custom error view
   *
   * @defaultValue `false`
   */
  hideError?: boolean;
  /**
   * Custom view for the error state of the component
   */
  errorView?: JSX.Element;
  /**
   * Text to display in the default error view
   *
   * @defaultValue `"ERROR"`
   */
  errorStateText?: string;
  /**
   * Custom view for the empty state of the component
   */
  emptyView?: JSX.Element;
  /**
   * Text to display in the default empty view
   *
   * @defaultValue `"EMPTY"`
   */
  emptyStateText?: string;
  /**
   * Set the scrollbar to the bottom-most position of the scrollable list
   *
   * @remarks
   * If the scrollbar of the scrollable list is set to the bottom-most position of the scrollable list because of this `prop`, the component won't call the `onScrolledToBottom` prop
   */
  scrollToBottom?: boolean;
  /**
   * Function to call whenever the component encounters an error
   */
  onError?: ((error: CometChat.CometChatException) => void) | null;
  /**
 * Title of the component
 *
 * @defaultValue `""`
 */
  title?: string;
}
/**
 * Renders a list component that can display a title, search bar,
 * and items with optional section headers.
 *
 * @param props - The props for configuring the list
 */
function List<T>(props: ListProps<T>): JSX.Element {
  const {
    hideSearch = false,
    searchText = "",
    onSearch,
    searchPlaceholderText = "Search",
    list,
    itemView,
    showSectionHeader = true,
    sectionHeaderKey,
    listItemKey,
    onScrolledToBottom,
    onScrolledToTop,
    state,
    loadingView,
    hideError = false,
    errorView,
    emptyView,
    scrollToBottom = false,
    onError,
    scrolledUpCallback,
    headerView,
    title = ""
  } = props;
  // Refs for DOM elements and other states
  const intersectionObserverRootRef = useRef<DivElementRef>(null);
  const intersectionObserverTopTargetRef = useRef<DivElementRef>(null);
  const intersectionObserverBottomTargetRef = useRef<DivElementRef>(null);
  const didComponentScrollToBottomRef = useRef(false);
  const timeoutIdRef = useRef<number | null>(null);
  const scrollHeightTupleRef = useRef<[number, number]>([0, 0]);
  const didTopObserverCallbackRunRef = useRef(false);
  // Memoized refs for callbacks to prevent unnecessary re-renders

  const onScrolledToTopRef = useRefSync(onScrolledToTop);
  const onScrolledToBottomRef = useRefSync(onScrolledToBottom);
  const onSearchRef = useRefSync(onSearch);
  const errorHandler = useCometChatErrorHandler(onError);

  /**
 * Handles changes in the search input field and triggers a search with a debounce of 500ms.
 *
 * @param e - The event object containing the new search value
 */
  const handleSearchChanged = (e: { value?: string }) => {
    const newSearchText = e.value;
    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = window.setTimeout(() => {
      onSearchRef.current?.(newSearchText!);
      timeoutIdRef.current = null;
    }, 500);
  }


  /**
   * Renders the search box if the hideSearch prop is false.
   */
  function getSearchBox(): JSX.Element | null {
    if (hideSearch) {
      return null;
    }
    return (
      <div className="cometchat-list__header-search-bar
">
        <CometChatSearchBar onChange={handleSearchChanged} searchText={searchText} placeholderText={searchPlaceholderText} />
      </div>

    );
  }
  /**
   * Renders the list of items, including section headers if applicable.
   */
  function getList(): JSX.Element[] | null {
    if (
      (state === States.loading && list.length === 0) ||
      state === States.empty ||
      state === States.error
    ) {
      return null;
    }
    let currrentSectionHeader = "";
    return list.map((item, itemIdx) => {
      let listSectionJSX: JSX.Element | null = null;
      if (showSectionHeader) {
        let itemSectionHeader: string;
        if (sectionHeaderKey === undefined) {
          errorHandler(
            new CometChat.CometChatException({
              code: "ERROR",
              name: "Error",
              message:
                "'sectionHeaderKey' prop must be provided when 'showSectionHeader' prop is set to true. 'showSectionHeader' is set to be true by default",
            })
          );
          itemSectionHeader = " ";
        } else {
          itemSectionHeader = (getKeyValue(sectionHeaderKey as keyof T, item) ||
            " ")[0].toUpperCase();
        }
        let sectionHeaderJSX: JSX.Element | null = null;

        if (!currrentSectionHeader || currrentSectionHeader !== itemSectionHeader) {
          sectionHeaderJSX = (
            <div
              className="cometchat-list__section-header"
            >
              {/* {itemSectionHeader} */}
            </div>
          );
          currrentSectionHeader = itemSectionHeader;
        }
        // listSectionJSX = (
        //   <div className="cometchat-list__section">{sectionHeaderJSX}</div>
        // );
      }
      return (
        <div key={listItemKey ? getKeyValue(listItemKey as keyof T, item) : itemIdx} className="cometchat-list__item-wrapper">
          {listSectionJSX}
          {itemView(item, itemIdx)}
        </div>
      );
    });
  }
  /**
    * Renders the loading view while the list is in the loading state.
    */
  function getLoadingView(): JSX.Element {
    return (
      <div
        className="cometchat-list__loading-view"
      >
        {loadingView}
      </div>
    )
  }

  /**
    * Renders the error view if the list is in the error state and hideError is false.
    */
  function getErrorView(): JSX.Element | null {
    if (hideError) {
      return null;
    }
    return <div
      className="cometchat-list__error-view"
    >
      {errorView}
    </div>
  }

  /**
    * Renders the empty view if the list is empty.
    */
  function getEmptyView(): JSX.Element {
    return (
      <div
        className="cometchat-list__empty-view"
      >
        {emptyView}
      </div>
    )
  }

  /**
    * Renders the appropriate view based on the current state (loading, error, empty).
    */
  function getStateView(): JSX.Element | null {
    let res: JSX.Element | null = null;


    switch (state) {
      case States.loading:
        if (list.length === 0) {
          res = getLoadingView();
        }
        break;
      case States.error:
        res = getErrorView();
        break;
      case States.empty:
        res = getEmptyView();
        break;
      case States.loaded:
        break;
      default:
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const x: any = state;
    }
    return res;
  }
  // Hooks for managing scroll events and search input refs

  useCometChatList({
    intersectionObserverRootRef,
    intersectionObserverBottomTargetRef,
    onScrolledToBottomRef,
    onScrolledToTopRef,
    intersectionObserverTopTargetRef,
    scrollToBottom,
    didComponentScrollToBottomRef,
    scrollHeightTupleRef,
    didTopObserverCallbackRunRef,
    errorHandler,
    scrolledUpCallback
  });
  /**
 * Renders the title view if the title prop is provided.
 */
  function getTitle(): JSX.Element {
    return (
      <div
        className="cometchat-list__header-title"
      >
        {title}
      </div>
    );
  }
  return (
    <div className="cometchat" style={{
      width: "100%",
      height: "100%"
    }}>
      <div className="cometchat-list">
        <div className="cometchat-list__header">
          {headerView ?? null}
          {!headerView && title ? getTitle() : null}
          {getSearchBox()}
        </div>
        <div ref={intersectionObserverRootRef} className="cometchat-list__body">
          <div ref={intersectionObserverTopTargetRef} style={{ height: "1px", minHeight: "1px" }}></div>
          {getList()}
          {getStateView()}
          <div ref={intersectionObserverBottomTargetRef} style={{ height: "1px", minHeight: "1px" }}></div>
        </div>
      </div>
    </div>
  );
}

const genericMemo: <T>(component: T) => T = React.memo;
/**
 * Renders a scrollable list
 */
export const CometChatList = genericMemo(List);
