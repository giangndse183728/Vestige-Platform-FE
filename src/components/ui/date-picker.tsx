"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/utils/cn"
import { Calendar as RDRCalendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePickerDemo({ value, onChange, inputClassName, wrapperClassName }: any) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Parse value for calendar
  const parsedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : new Date();

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Handle calendar change
  const handleCalendarChange = (date: Date) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
      setOpen(false);
    }
  };

  return (
    <div className={wrapperClassName || "relative w-full"}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <input
              ref={inputRef}
              type="text"
              placeholder="YYYY-MM-DD"
              className={cn("border px-2 py-2 w-full", inputClassName)}
              value={value || ""}
              onChange={handleInputChange}
              readOnly
            />
          
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 rounded-none font-metal w-full bg-white border mt-2 left-0" align="start">
          <RDRCalendar
            
            date={parsedDate}
            onChange={handleCalendarChange}
            showMonthAndYearPickers={true}
            minDate={new Date(1950, 0, 1)}
            maxDate={new Date()}
            color="#900000"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
  
