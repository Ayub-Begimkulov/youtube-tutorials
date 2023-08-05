import { formatDate } from "@/utils";

interface DateDisplayProps {
  date: number;
}

export function DateDisplay({ date }: DateDisplayProps) {
  return (
    <span style={{ margin: "0 24px", color: "white", fontSize: 13 }}>
      {formatDate(date)}
    </span>
  );
}
