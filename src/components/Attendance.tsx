import { useState, useMemo } from 'react';
import { Calendar, Check } from 'lucide-react';
import { AppState, MonthlyAttendance } from '../types';
import { Button } from './ui';
import Card from './common/Card';
import PageTitle from './common/PageTitle';

interface AttendanceProps {
  state: AppState;
  onUpdateAttendance: (attendance: MonthlyAttendance[]) => void;
}

const Attendance = ({ state, onUpdateAttendance }: AttendanceProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const employees = useMemo(() => 
    state.contacts.filter(c => c.type === 'employee'),
    [state.contacts]
  );

  const daysInMonth = useMemo(() => 
    new Date(currentYear, currentMonth + 1, 0).getDate(),
    [currentYear, currentMonth]
  );

  const monthDays = useMemo(() => 
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth]
  );

  const employeeAttendance = useMemo(() => {
    const attendanceMap = new Map(
      state.attendance
        .filter(a => a.year === currentYear && a.month === currentMonth)
        .map(a => [a.employeeId, a])
    );

    return employees.map(emp => ({
      employee: emp,
      attendance: attendanceMap.get(emp.id) || {
        employeeId: emp.id,
        year: currentYear,
        month: currentMonth,
        records: {}
      }
    }));
  }, [state.attendance, employees, currentYear, currentMonth]);

  // Calculate attendance summary for each employee
  const attendanceSummary = useMemo(() => {
    return employeeAttendance.map(({ employee, attendance }) => {
      const present = Object.values(attendance.records).filter(Boolean).length;
      const absent = daysInMonth - present;
      return {
        employeeId: employee.id,
        name: employee.name,
        present,
        absent
      };
    });
  }, [employeeAttendance, daysInMonth]);

  const handleAttendanceChange = (employeeId: string, day: number) => {
    const newAttendance = [...state.attendance];
    const existingIndex = newAttendance.findIndex(
      a => a.employeeId === employeeId && 
           a.year === currentYear && 
           a.month === currentMonth
    );

    if (existingIndex >= 0) {
      const record = { ...newAttendance[existingIndex] };
      record.records[day] = !record.records[day];
      newAttendance[existingIndex] = record;
    } else {
      newAttendance.push({
        employeeId,
        year: currentYear,
        month: currentMonth,
        records: { [day]: true }
      });
    }

    onUpdateAttendance(newAttendance);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const getNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Get day name for a specific date
  const getDayName = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageTitle title="Attendance" />
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              onClick={getPreviousMonth}
            >
              Previous
            </Button>
            <span className="text-lg font-medium">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <Button 
              variant="secondary" 
              onClick={getNextMonth}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Card>
        {employees.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No employees found. Add employees in the Contacts section.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-medium text-gray-500 text-left">
                    <div>Date</div>
                    <div className="text-xs text-gray-400">Day</div>
                  </th>
                  {employees.map(employee => (
                    <th key={employee.id} className="p-4 text-sm font-medium text-gray-500">
                      <div>{employee.name}</div>
                      <div className="text-xs text-gray-400">{employee.email}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthDays.map(day => {
                  const isToday = day === today.getDate() && 
                                currentMonth === today.getMonth() && 
                                currentYear === today.getFullYear();
                  return (
                    <tr key={day} className={isToday ? 'bg-blue-50' : ''}>
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-medium">{day}</div>
                        <div className="text-xs text-gray-500">{getDayName(day)}</div>
                      </td>
                      {employeeAttendance.map(({ employee, attendance }) => {
                        const isPresent = attendance.records[day];
                        return (
                          <td key={employee.id} className="p-4 text-center">
                            <button
                              onClick={() => handleAttendanceChange(employee.id, day)}
                              className={`w-6 h-6 rounded ${
                                isPresent 
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                              }`}
                            >
                              <Check className="w-4 h-4 mx-auto" />
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Attendance Summary */}
      {employees.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceSummary.map(summary => (
              <div key={summary.employeeId} className="p-4 rounded-lg bg-gray-50">
                <div className="font-medium text-gray-800 mb-2">{summary.name}</div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Present: {summary.present}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="text-gray-600">Absent: {summary.absent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Attendance;