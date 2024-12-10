export interface AttendanceRecord {
  employeeId: string;
  date: string;
  present: boolean;
}

export interface MonthlyAttendance {
  employeeId: string;
  year: number;
  month: number;
  records: {
    [day: number]: boolean;
  };
}