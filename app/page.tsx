"use client";

import { useState, useEffect, FC } from "react";
import EditDialog from "@/components/editDialog";
import { Exam, Attendance, EditingData } from "@/lib/interfaces";
import {
  saveExamScheduleToLocalStorage,
  loadExamScheduleFromLocalStorage,
  calculateRemainingTime
} from "@/lib/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCodeBranch
} from "@fortawesome/free-solid-svg-icons"

const Home: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentEditingData, setCurrentEditingData] = useState<
    EditingData | undefined
  >(undefined);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [examSchedule, setExamSchedule] = useState<Exam[]>([
    { id: 1, subject: "數學", startTime: "01:00", endTime: "02:00" },
    { id: 2, subject: "國文", startTime: "03:00", endTime: "04:00" },
    { id: 3, subject: "自然", startTime: "05:00", endTime: "06:00" },
  ]);
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [attendance, setAttendance] = useState<Attendance>({
    present: 36,
    total: 36,
  });
  const [showSchedule, setShowSchedule] = useState<boolean>(true);

  const formatEditingData = (): EditingData => {
    return {
      subjects: examSchedule.map((exam) => exam.subject),
      startTimes: examSchedule.map((exam) => exam.startTime),
      endTimes: examSchedule.map((exam) => exam.endTime),
      attendanceData: {
        expectedAttendance: attendance.total,
        actualAttendance: attendance.present,
        absentSeatNumbers: attendance.absentSeatNumbers || "",
      },
      showSchedule: showSchedule,
    };
  };

  const importExam = () => {
    fetch("/api/import?exam=1")
        .then((response) => response.json())
        .then((data) => {
          setExamSchedule(data);
        })
        .catch((error) => {
          console.error("Error importing exam data:", error);
        });
  };

  const handleEditClick = () => {
    setCurrentEditingData(formatEditingData());
    setIsDialogOpen(true);
  };

  const handleDialogSave = (data: EditingData) => {
    setExamSchedule((prev) =>
      data.subjects.map((_subject, index) => ({
        ...prev[index],
        subject: data.subjects[index],
        startTime: data.startTimes[index],
        endTime: data.endTimes[index],
      })),
    );

    setAttendance({
      ...attendance,
      total: data.attendanceData.expectedAttendance,
      present: data.attendanceData.actualAttendance,
      absentSeatNumbers: data.attendanceData.absentSeatNumbers,
    });

    setShowSchedule(data.showSchedule);

    setIsDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const savedSchedule = loadExamScheduleFromLocalStorage();
    if (savedSchedule.length > 0) {
      setExamSchedule(savedSchedule);
    }
  }, []);

  useEffect(() => {
    saveExamScheduleToLocalStorage(examSchedule);
  }, [examSchedule]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const now = currentTime;
    const current = examSchedule.find((exam) => {
      const examStartDate = new Date(now.toDateString() + " " + exam.startTime);
      const examEndDate = new Date(now.toDateString() + " " + exam.endTime);

      if (exam.endTime < exam.startTime) {
        examEndDate.setDate(examEndDate.getDate() + 1);
      }

      return now >= examStartDate && now <= examEndDate;
    });

    setCurrentExam(current ?? null);
  }, [currentTime, examSchedule]);

  return (
    <>
      <div className="absolute flex w-full top-0 left-0 p-2 text-xs text-gray-400 font-bold">
          Maintain By{" "}
          <a href="https://github.com/smitug01" className="text-blue-500">
            &nbsp;@smitug01&nbsp;
          </a>{" "}
          &{" "}
          <a href="https://github.com/kevin0216" className="text-blue-500">
          &nbsp;@kevin0216
          </a>
          <a
            href="https://github.com/smitug01/exam-clock/releases/tag/v0.2.1"
            className="ml-auto text-end text-gray-300"
          >
            <FontAwesomeIcon
              icon={faCodeBranch}
              className={"mr-1"}
            />
            v0.2u2 (0.2.2dev)
          </a>
      </div>
      <EditDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        initialData={currentEditingData}
      />
      <div className="p-4 bg-white dark:bg-slate-900 min-h-screen flex flex-col">
        <div className="flex flex-grow justify-center items-center flex-col">
          {currentExam && (
            <div className="text-5xl mb-2 font-black">
              {currentExam.subject}
            </div>
          )}
          <div className="text-9xl mb-2 font-black">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </div>
          <br />
          {currentExam && (
            <div className="text-6xl font-black">
              還剩 {calculateRemainingTime(currentExam.endTime)} 分鐘
            </div>
          )}
        </div>
        <div className="flex justify-between items-end mt-4">
          {!showSchedule && currentExam ? (
            <></>
          ) : (
            <span>
              <h2 className="text-4xl mb-2">今天的考程表</h2>
              <ul>
                {examSchedule.map((exam) => (
                    <li className={`text-6xl ${
                      parseInt(exam.endTime.split(":")[0]) < currentTime.getHours() ? "opacity-30 text-thin" : exam.id == currentExam?.id ? "font-bold text-yellow-100" : "font-normal"
                    }`} key={exam.id}>
                      {exam.startTime} - {exam.endTime} {exam.subject}
                    </li>
                ))}
              </ul>
            </span>
          )}
          <div className="text-4xl font-medium ml-auto content-end text-end">
            應到人數: {attendance.total} <br />
            實到人數: {attendance.present} <br />
            {attendance.absentSeatNumbers ? (
              <>缺席座號: {attendance.absentSeatNumbers}</>
            ) : (
              <>全到，無缺考</>
            )}
          </div>
        </div>
        <div className="flex items-end mt-8">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded text-2xl font-medium hover:bg-blue-600 active:scale-95"
            onClick={() => handleEditClick()}
          >
            編輯考程與人數
          </button>
          <button
              className="ml-8 bg-green-500 text-white px-6 py-3 rounded text-2xl font-medium hover:bg-green-600 active:scale-95"
              onClick={() => importExam()}
          >
            導入考程與人數
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
