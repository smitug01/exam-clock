import React, {
  FC,
  MouseEvent,
  Fragment,
  useState,
  useEffect,
  ChangeEvent,
} from "react";
import { Transition, Switch } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faXmark,
  faTrashCan,
  faPlusCircle,
  faRotateRight,
  faWarning
} from "@fortawesome/free-solid-svg-icons";

import { EditingData, ImportExamData } from "@/lib/interfaces";

interface EditDialogProps {
  isOpen: boolean;
  onClose: (event: MouseEvent<HTMLButtonElement>) => void;
  onSave: (data: EditingData) => void;
  initialData?: EditingData;
}

const EditDialog: FC<EditDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [data, setData] = useState<EditingData>(
    initialData || {
      subjects: [""],
      startTimes: [""],
      endTimes: [""],
      attendanceData: {
        expectedAttendance: 0,
        actualAttendance: 0,
        absentSeatNumbers: "",
      },
      showSchedule: true,
    },
  );

  useEffect(() => {
    setData(
      initialData || {
        subjects: [""],
        startTimes: [""],
        endTimes: [""],
        attendanceData: {
          expectedAttendance: 0,
          actualAttendance: 0,
          absentSeatNumbers: "",
        },
        showSchedule: true,
      },
    );
  }, [initialData]);

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const handleSaveClick = () => {
    onSave(data);
  };

  const handleSubjectChange = (index: number, value: string) => {
    const newData = { ...data };
    newData.subjects[index] = value;
    setData(newData);
  };

  const handleStartTimeChange = (index: number, value: string) => {
    const newData = { ...data };
    newData.startTimes[index] = value;
    setData(newData);
  };

  const handleEndTimeChange = (index: number, value: string) => {
    const newData = { ...data };
    newData.endTimes[index] = value;
    setData(newData);
  };

  const handleExpectedAttendanceChange = (value: number) => {
    const newData = { ...data };
    newData.attendanceData.expectedAttendance = value;
    setData(newData);
  };

  const handleActualAttendanceChange = (value: number) => {
    const newData = { ...data };
    newData.attendanceData.actualAttendance = value;
    setData(newData);
  };

  const handleAbsentSeatNumbersChange = (value: string) => {
    const newData = { ...data };
    newData.attendanceData.absentSeatNumbers = value;
    setData(newData);
  };

  const handleShowScheduleChange = () => {
    const newData = { ...data };
    newData.showSchedule = !data.showSchedule;
    setData(newData);
  };

  const restoreDefaultExam = () => {
    const newData = { ...data };
    newData.subjects = [];
    newData.startTimes = [];
    newData.endTimes = [];

    fetch("/api/import?exam=1")
    .then((response) => response.json())
    .then((data) => {
      data.map((exam: ImportExamData) => {
        newData.subjects.push(exam.subject);
        newData.startTimes.push(exam.startTime);
        newData.endTimes.push(exam.endTime);
      })
      setData(newData)
    })
    .catch((error) => {
      console.error("Error importing exam data:", error);
    });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function isTimePassed (examTime: string) {
    const now = currentTime.getMinutes() + currentTime.getHours() * 60
    const exam = parseInt(examTime.split(":")[1]) + parseInt(examTime.split(":")[0]) * 60

    return now > exam;
  }

  function timeValidation (examTimeArray: Array<string>) {
    const now = currentTime.getMinutes() + currentTime.getHours() * 60
    for (const examTime of examTimeArray) {
      const exam = parseInt(examTime.split(":")[1]) + parseInt(examTime.split(":")[0]) * 60
      if (now > exam) {
        return true;
      }
    };
    return false;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-20 overflow-y-auto font-medium">
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 backdrop-blur-sm transition-opacity"
              aria-hidden={true}
            >
              <div className="absolute inset-0 dark:bg-slate-800 bg-gray-500 opacity-75" />
            </div>
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden={true}
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-slate-700 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-2xl mb-4 leading-6 font-semibold text-gray-900 dark:text-white"
                      id="modal-title"
                    >
                      編輯考程
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-3 py-1.5 bg-green-700 dark:bg-green-600 text-base font-medium text-white hover:bg-green-800 hover:dark:bg-green-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm active:scale-95"
                        onClick={() => {restoreDefaultExam()}}
                      >
                        <FontAwesomeIcon
                          icon={faRotateRight}
                          className={"my-auto mr-2"}
                        />
                        恢復預設值
                      </button> 
                    </h3>
                    <div className="mt-2">
                    {timeValidation(data.endTimes) ? (
                        <div className="text-base font-bold text-orange-500 dark:text-orange-300">
                          <FontAwesomeIcon
                            icon={faWarning}
                            className={"my-auto mr-2"}
                          />
                          注意: 有考試項目已經結束 (黃框)
                        </div>
                      ) : (<></>)}  
                      {data.subjects.map((subject, index) => (
                        <div key={index} className="flex space-x-4 mt-2">
                          <input
                            type="text"
                            value={subject}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              handleSubjectChange(index, e.target.value);
                            }}
                            className={`block flex-grow px-3 py-2 rounded-md bg-gray-100 ${isTimePassed(data.endTimes[index]) ? "border-4 border-orange-300 dark-orange-500" : "border border-gray-300 dark:border-slate-600"} dark:bg-slate-600 dark:placeholder-white dark:text-white placeholder-gray-500 text-gray-900 focus:dark:border-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="請輸入科目..."
                          />
                          <input
                            type="text"
                            value={data.startTimes[index]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              handleStartTimeChange(index, e.target.value);
                            }}
                            className={`block w-32 px-3 py-2 rounded-md bg-gray-100 ${isTimePassed(data.endTimes[index]) ? "border-4 border-orange-300 dark-orange-500" : "border border-gray-300 dark:border-slate-600"} dark:bg-slate-600 dark:placeholder-white dark:text-white placeholder-gray-500 text-gray-900 focus:dark:border-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="請輸入開始時間... (24小時制)"
                          />
                          <input
                            type="text"
                            value={data.endTimes[index]}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              handleEndTimeChange(index, e.target.value);
                            }}
                            className={`block w-32 px-3 py-2 rounded-md bg-gray-100 ${isTimePassed(data.endTimes[index]) ? "border-4 border-orange-300 dark-orange-500" : "border border-gray-300 dark:border-slate-600"} dark:bg-slate-600 dark:placeholder-white dark:text-white placeholder-gray-500 text-gray-900 focus:dark:border-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="請輸入結束時間... (24小時制)"
                          />
                          <button
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-3 py-1.5 bg-red-500 dark:bg-red-400 text-base font-medium text-white hover:light:bg-red-600 hover:dark:bg-red-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm active:scale-95"
                            onClick={() => {
                              const newData = { ...data };
                              newData.subjects.splice(index, 1);
                              newData.startTimes.splice(index, 1);
                              newData.endTimes.splice(index, 1);
                              setData(newData);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              className={"my-auto"}
                            />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="mt-2 text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 hover:dark:text-indigo-500 focus:outline-none"
                        onClick={() => {
                          const newData = { ...data };
                          newData.subjects.push("");
                          newData.startTimes.push("");
                          newData.endTimes.push("");
                          setData(newData);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPlusCircle}
                          className={"mr-2"}
                        />
                        新增科目
                      </button>
                    </div>
                    <div className="border-t-2 border-t-gray-800 dark:border-t-gray-400 mt-3">
                      <h4 className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
                        出缺席資訊
                      </h4>
                      <div className="flex space-x-4 mt-2">
                        <div>
                          <h4 className="text-normal font-normal">應到人數</h4>
                          <input
                            type="number"
                            value={data.attendanceData.expectedAttendance}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              handleExpectedAttendanceChange(
                                parseInt(e.target.value, 10),
                              );
                            }}
                            className="block w-32 mt-1 px-3 py-2 rounded-md bg-gray-100 border light:border-gray-300 dark:border-slate-600 dark:bg-slate-600 dark:placeholder-white dark:text-white placeholder-gray-500 text-gray-900 focus:dark:border-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="應到人數"
                          />
                        </div>
                        <div>
                          <h4 className="text-normal font-normal">實到人數</h4>
                          <input
                            type="number"
                            value={data.attendanceData.actualAttendance}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              handleActualAttendanceChange(
                                parseInt(e.target.value, 10),
                              );
                            }}
                            className="block w-32 mt-1 px-3 py-2 rounded-md bg-gray-100 border light:border-gray-300 dark:border-slate-600 dark:bg-slate-600 dark:placeholder-white dark:text-white placeholder-gray-500 text-gray-900 focus:dark:border-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="實到人數"
                          />
                        </div>
                        <div>
                          <h4 className="text-normal font-normal">缺席座號</h4>
                          <input
                            type="text"
                            value={data.attendanceData.absentSeatNumbers}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              handleAbsentSeatNumbersChange(e.target.value);
                            }}
                            className="block flex-grow mt-1 px-3 py-2 rounded-md bg-gray-100 border light:border-gray-300 dark:border-slate-600 dark:bg-slate-600 dark:placeholder-white dark:text-white placeholder-gray-500 text-gray-900 focus:dark:border-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="請輸入缺席座號..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-end items-end ml-auto">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-2.5 py-1.5 bg-red-500 dark:bg-red-400 text-base font-medium text-white hover:light:bg-red-600 hover:dark:bg-red-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm active:scale-90"
                      onClick={onClose}
                    >
                      <FontAwesomeIcon icon={faXmark} className={"text-3xl"} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className=" w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-500 hover:dark:bg-indigo-600 text-base font-medium text-white active:scale-95 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSaveClick}
                >
                  <div className="my-auto">
                    <FontAwesomeIcon icon={faSave} className={"mr-2"} />
                    儲存
                  </div>
                </button>
                <span className="my-auto ml-2 pr-3 border-r-2 border-r-black dark:border-r-gray-400">
                  考試過程中顯示考程表
                </span>
                <Switch
                  checked={data.showSchedule}
                  onChange={handleShowScheduleChange}
                  className={`${
                    data.showSchedule
                      ? "bg-teal-500"
                      : "bg-gray-200 dark:bg-gray-700"
                  }
                                    relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                  <span
                    aria-hidden="true"
                    className={`${
                      data.showSchedule ? "translate-x-9" : "translate-x-0"
                    }
                    pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full ${
                      data.showSchedule
                        ? "bg-white"
                        : "bg-slate-700 dark:bg-white"
                    } shadow-lg ring-0 transition duration-200 ease-in-out`}
                  />
                </Switch>
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default EditDialog;
