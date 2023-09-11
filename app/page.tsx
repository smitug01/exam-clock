"use client"

import { useState, useEffect, FC } from 'react';
import EditDialog from './edit';

interface Exam {
  id: number;
  subject: string;
  startTime: string;
  endTime: string;
}

interface Attendance {
  present: number;
  total: number;
  absentSeatNumbers?: string;
}

interface EditingData {
  subjects: string[];
  startTimes: string[];
  endTimes: string[];
  attendanceData: {
    expectedAttendance: number;
    actualAttendance: number;
    absentSeatNumbers: string;
  };
}

const Home: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentEditingData, setCurrentEditingData] = useState<EditingData | undefined>(undefined);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [examSchedule, setExamSchedule] = useState<Exam[]>([
    { id: 1, subject: '數學', startTime: '01:00', endTime: '02:00' },
    { id: 2, subject: '國文', startTime: '03:00', endTime: '04:00' },
    { id: 3, subject: '自然', startTime: '05:00', endTime: '06:00' },
  ]);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [attendance, setAttendance] = useState<Attendance>({ present: 36, total: 36 });

  const formatEditingData = (): EditingData => {
    return {
      subjects: examSchedule.map(exam => exam.subject),
      startTimes: examSchedule.map(exam => exam.startTime),
      endTimes: examSchedule.map(exam => exam.endTime),
      attendanceData: {
        expectedAttendance: attendance.total,
        actualAttendance: attendance.present,
        absentSeatNumbers: attendance.absentSeatNumbers || "",
      },
    };
  };

  const handleEditClick = () => {
    setCurrentEditingData(formatEditingData());
    setIsDialogOpen(true);
  };

  const handleDialogSave = (data: EditingData) => {
    setExamSchedule(prev => data.subjects.map((subject, index) => ({
      ...prev[index],
      subject: data.subjects[index],
      startTime: data.startTimes[index],
      endTime: data.endTimes[index],
    })));

    setAttendance({
      ...attendance,
      total: data.attendanceData.expectedAttendance,
      present: data.attendanceData.actualAttendance,
      absentSeatNumbers: data.attendanceData.absentSeatNumbers,
    });

    setIsDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const now = currentTime;
    const current = examSchedule.find(exam => {
      const examStartDate = new Date(now.toDateString() + ' ' + exam.startTime);
      const examEndDate = new Date(now.toDateString() + ' ' + exam.endTime);

      if (exam.endTime < exam.startTime) {
        examEndDate.setDate(examEndDate.getDate() + 1);
      }

      return now >= examStartDate && now <= examEndDate;
    });

    setCurrentExam(current ?? null);
  }, [currentTime, examSchedule]);

  const calculateRemainingTime = (endTime: string): number => {
    const now = new Date();
    const end = new Date(now.toDateString() + ' ' + endTime);
    const remainingMinutes = Math.floor((end.getTime() - now.getTime()) / 60000);
    return remainingMinutes >= 0 ? remainingMinutes : 0;
  };

  return (
      <>
        <div className="absolute top-0 left-0 p-2 text-xs text-gray-400">
          Coding By <a href="https://github.com/smitug01" className="text-blue-500">@smitug01</a>
        </div>
        <EditDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            onSave={handleDialogSave}
            initialData={currentEditingData}
        />
        <div className="p-4 bg-white min-h-screen flex flex-col">
          <div className="flex flex-grow justify-center items-center flex-col">
            {currentExam && (
                <div className="text-5xl mb-2">
                  {currentExam.subject}
                </div>
            )}
            <div className="text-9xl mb-2">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <br />
            {currentExam && (
                <div className="text-4xl">
                  還剩 {calculateRemainingTime(currentExam.endTime)} 分鐘
                </div>
            )}
          </div>
          <div className="mt-4">
            <h2 className="text-2xl mb-2">今天的考程表</h2>
            <ul>
              {examSchedule.map((exam) => (
                  <li className="text-4xl" key={exam.id}>
                    {exam.startTime} - {exam.endTime} {exam.subject}
                  </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between items-end mt-4">
            <button
                className="bg-blue-500 text-white px-6 py-3 rounded text-2xl"
                onClick={() => handleEditClick()}
            >
              編輯考程與人數
            </button>
            <div className="text-4xl">
              應到人數: {attendance.total} <br />
              實到人數: {attendance.present} <br />
              缺席座號: {attendance.absentSeatNumbers}
            </div>
          </div>
        </div>
      </>
  );
};

export default Home;