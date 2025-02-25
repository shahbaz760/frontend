import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

interface TimePickerProps {
  selectedDate: Date | string;
  onTimeChange: (time: string) => void;
  selectedTime: string;
  lastDate: any;
}

const TimePicker: React.FC<TimePickerProps> = ({
  selectedDate,
  onTimeChange,
  selectedTime,
  lastDate,
}) => {
  const [hour, setHour] = useState<number | string>("");
  const [minute, setMinute] = useState<number | string>("");
  const [period, setPeriod] = useState<string>("AM");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const maxTime = lastDate.split(" ")[1];
  const maxDate = moment(lastDate.split(" ")[0], "DD/MM/YYYY h:mm").format(
    "YYYY-MM-DD"
  );
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const isToday =
    new Date(selectedDate).toDateString() === new Date().toDateString();

  // Convert time string to 24-hour format for comparison
  const parseTime = (timeStr: string) => {
    const [time, period] = timeStr.split(" ");
    const [h, m] = time.split(":").map(Number);
    const hour24 =
      period === "PM" && h !== 12
        ? h + 12
        : period === "AM" && h === 12
          ? 0
          : h;
    return { hour: hour24, minute: m };
  };

  const { hour: maxHour24, minute: maxMinute } = parseTime(maxTime);

  useEffect(() => {
    if (selectedTime) {
      const [time, period] = selectedTime.split(" ");
      const [h, m] = time.split(":").map(Number);
      setHour(h);
      setMinute(m);
      setPeriod(period || "AM");
    }
  }, [selectedTime]);

  const handleTimeChange = () => {
    const formattedHour = String(hour).padStart(2, "0");
    const formattedMinute = String(minute).padStart(2, "0");
    const formattedTime = `${formattedHour}:${formattedMinute} ${period}`;
    onTimeChange(formattedTime);
    if (inputRef.current) {
      (
        inputRef.current.querySelector(".time-input") as HTMLInputElement
      ).value = formattedTime;
    }
    setShowDropdown(false);
  };

  const handleInputClick = () => {
    setShowDropdown(true);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setHour("");
    setMinute("");
    setPeriod("AM");
  }, [selectedDate]);
  const currentSelectedTime = moment(selectedDate, "DD/MM/YYYY h:mm").format(
    "YYYY-MM-DD"
  );

  // Logic to determine if a time option should be disabled
  const isTimeDisabled = (h: number, m: number, p: string): boolean => {
    const hour24 =
      p === "PM" && h !== 12 ? h + 12 : p === "AM" && h === 12 ? 0 : h;

    // Disable times greater than maxTime
    if (hour24 > maxHour24 && moment(currentSelectedTime).isSame(maxDate)) {
      return true;
    }
    if (m > maxMinute && moment(currentSelectedTime).isSame(maxDate)) {
      return true;
    }

    // Disable past times only for today
    if (isToday) {
      if (
        hour24 < currentHour ||
        (hour24 === currentHour && m < currentMinute)
      ) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="time-picker taskRemindeDateField" ref={inputRef}>
      <label htmlFor="time">Time</label>
      <input
        type="text"
        name="time"
        placeholder="HH:MM"
        onClick={handleInputClick}
        readOnly
        value={selectedTime}
        className="time-input"
      />

      {showDropdown && (
        <div className="dropdown">
          <select
            value={hour !== "" ? String(hour).padStart(2, "0") : "00"}
            onChange={(e) => setHour(Number(e.target.value))}
            className="cursor-pointer"
          >
            <option
              value="00"
              disabled={isTimeDisabled(0, parseInt(minute as string), period)}
            >
              00
            </option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <option
                key={h}
                value={String(h).padStart(2, "0")}
                disabled={isTimeDisabled(h, parseInt(minute as string), period)}
              >
                {String(h).padStart(2, "0")}
              </option>
            ))}
          </select>

          <span>:</span>

          <select
            value={minute !== "" ? String(minute).padStart(2, "0") : "00"}
            onChange={(e) => setMinute(Number(e.target.value))}
            className="cursor-pointer"
          >
            {Array.from({ length: 60 }, (_, i) => i).map((m) => (
              <option
                key={m}
                value={String(m).padStart(2, "0")}
                disabled={isTimeDisabled(parseInt(hour as string), m, period)}
              >
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="cursor-pointer"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>

          <button onClick={handleTimeChange}>Set Time</button>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
