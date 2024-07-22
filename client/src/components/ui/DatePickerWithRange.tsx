"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerWithRangeProps {
  className?: string;
  onChange: (dates: { startDate: Date; endDate: Date }) => void;
}

export const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({ className, onChange }) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  React.useEffect(() => {
    if (date?.from && date?.to) {
      onChange({ startDate: date.from, endDate: date.to });
    }
  }, [date, onChange]);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-6 p-1", className)}>
      <h1 className="text-3xl font-bold text-center mb-4">Select your stay dates</h1>
      <p className="text-base font-bold text-center mb-4">
        {date?.from ? (
          date.to ? (
            <>
              {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
            </>
          ) : (
            format(date.from, "LLL dd, y")
          )
        ) : (
          "Pick a date"
        )}
      </p>
      <div className="flex justify-center w-full">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
   
        />
      </div>
    </div>
  );
};
