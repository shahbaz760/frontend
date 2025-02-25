
import CalenderDesign from "./CalenderDesign";
const CalenderPage = () => {
  const events = [
    {
      title: "Meeting",
      start: new Date(2024, 3, 15, 10, 0), // 10.00 AM
      end: new Date(2024, 3, 15, 12, 0), // 12.00 PM
    },
    {
      title: "Coffee Break",
      start: new Date(2024, 3, 16, 15, 0), // 3.00 PM
      end: new Date(2024, 3, 16, 15, 30), // 3.30 PM
    },
  ];
  return (
    <div className=" px-20">
      <div className="my-20 w-100% ">
        <CalenderDesign events={events} />
      </div>
    </div>
  );
};

export default CalenderPage;
