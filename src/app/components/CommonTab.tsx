import React, { SetStateAction, useEffect, useState } from "react";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router-dom";

interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
  actionBtn?: () => React.ReactNode;
  tabHeight?: boolean;
}

interface TabProps {
  tabs: Tab[];
  setActive?: React.Dispatch<SetStateAction<number | string>>;
  tabHeight?: boolean;
  actionBtn?: () => React.ReactNode;
}

const TabComponent: React.FC<TabProps> = ({
  tabs,
  setActive,
  tabHeight,
  actionBtn,
}) => {
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Get a specific query parameter
  const paramValue = queryParams.get("type");
  const [activeTab, setActiveTab] = useState<string>(paramValue ?? tabs[0].id);
  const currentTab = tabs.find((tab) => tab.id === activeTab);

  useEffect(() => {
    if (location.pathname.includes("/client/detail") && paramValue) {
      setActiveTab(paramValue);
    }
  }, [queryParams]);

  return (
    <div className="relative">
      <div
        className={`flex justify-between gap-[20px] pt-[1.5rem] pb-[1.6rem] items-center flex-wrap px-[1rem] min-h-[4rem] md:h-[77px] 
        `}
      >
        <div className={`flex justify-left gap-[20px] flex-wrap `}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${
                activeTab === tab.id
                  ? "border-b-[3px] !border-secondary text-secondary"
                  : "border-b-[3px] !border-transparent text-para_light"
              } py-2  focus:outline-none text-[1.8rem] font-500 `}
              onClick={() => {
                navigate(`${location.pathname}?type=${tab.id}`);
                setActiveTab(tab.id);
                // setActive(tab.id);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="">
          {tabs.find((tab) => tab.id === activeTab)?.actionBtn()}
        </div>
      </div>
      <div className="mt-4 pb-1 ">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default TabComponent;
