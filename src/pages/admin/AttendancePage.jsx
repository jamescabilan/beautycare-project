import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { showToast } from '../../utils/helpers';
import '../../styles/admin-attendance.css';

export function AttendancePage() {
  const { attendanceLog, logAttendance } = useContext(AppContext);
  const [staffClockStatus, setStaffClockStatus] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockToggle = (staffName) => {
    const today = new Date().toLocaleDateString('en-PH');
    const existing = attendanceLog.find(
      a => a.staff === staffName && a.date === today && !a.clockOut
    );

    if (existing) {
      // Clock out
      existing.clockOut = new Date().toLocaleTimeString('en-PH');
      const clockInTime = new Date(existing.clockIn);
      const clockOutTime = new Date();
      const hours = ((clockOutTime - clockInTime) / 3600000).toFixed(2);
      existing.hours = hours;
      setStaffClockStatus(prev => ({ ...prev, [staffName]: false }));
      showToast(`${staffName} clocked out (${hours}h logged)`, 'info');
    } else {
      // Clock in
      logAttendance({
        staff: staffName,
        date: today,
        clockIn: new Date().toLocaleTimeString('en-PH'),
        clockOut: null,
        hours: null
      });
      setStaffClockStatus(prev => ({ ...prev, [staffName]: true }));
      showToast(`${staffName} clocked in!`, 'success');
    }
  };

  const today = new Date().toLocaleDateString('en-PH');
  const todayAttendance = attendanceLog.filter(a => a.date === today);
  const uniqueStaffToday = [...new Set(todayAttendance.map(a => a.staff))];

  return (
    <div className="attendance-page">
      <div className="page-header-alt">
        <div>
          <h2>Attendance Management</h2>
          <p>Monitor staff clock-in/out and working hours</p>
        </div>
      </div>

      <div className="attendance-container">
        <div className="clock-section">
          <div className="digital-clock">
            <div className="clock-display">
              {currentTime.toLocaleTimeString('en-PH')}
            </div>
            <div className="clock-date">
              {currentTime.toLocaleDateString('en-PH', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="today-summary">
            <div className="summary-item">
              <span className="label">Staff Clocked In</span>
              <span className="value">{uniqueStaffToday.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Total Check-ins</span>
              <span className="value">{todayAttendance.filter(a => a.clockIn).length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Check-outs</span>
              <span className="value">{todayAttendance.filter(a => a.clockOut).length}</span>
            </div>
          </div>
        </div>

        <div className="table-section">
          <div className="section-title">Today's Attendance Log</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Hours Worked</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-message">No attendance records for today</td>
                  </tr>
                ) : (
                  todayAttendance.map((record, idx) => (
                    <tr key={idx}>
                      <td className="staff-name">{record.staff}</td>
                      <td>{record.clockIn}</td>
                      <td>{record.clockOut || '—'}</td>
                      <td>{record.hours ? `${record.hours}h` : '—'}</td>
                      <td>
                        <span className={`badge ${record.clockOut ? 'badge-completed' : 'badge-active'}`}>
                          {record.clockOut ? 'Completed' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-section" style={{ marginTop: '40px' }}>
          <div className="section-title">Attendance History</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Staff</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLog.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-message">No attendance records yet</td>
                  </tr>
                ) : (
                  attendanceLog.slice().reverse().map((record, idx) => (
                    <tr key={idx}>
                      <td>{record.date}</td>
                      <td className="staff-name">{record.staff}</td>
                      <td>{record.clockIn}</td>
                      <td>{record.clockOut || '—'}</td>
                      <td>{record.hours ? `${record.hours}h` : '—'}</td>
                      <td>
                        <span className={`badge ${record.clockOut ? 'badge-completed' : 'badge-pending'}`}>
                          {record.clockOut ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
