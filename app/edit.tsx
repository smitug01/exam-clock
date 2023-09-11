import React, { FC, MouseEvent, Fragment, useState, useEffect, ChangeEvent } from "react";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faSave } from "@fortawesome/free-solid-svg-icons";

interface EditDialogProps {
    isOpen: boolean;
    onClose: (event: MouseEvent<HTMLButtonElement>) => void;
    onSave: (data: EditingData) => void;
    initialData?: EditingData;
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

const EditDialog: FC<EditDialogProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [data, setData] = useState<EditingData>(
        initialData || {
            subjects: [''],
            startTimes: [''],
            endTimes: [''],
            attendanceData: {
                expectedAttendance: 0,
                actualAttendance: 0,
                absentSeatNumbers: '',
            },
        }
    );

    useEffect(() => {
        setData(
            initialData || {
                subjects: [''],
                startTimes: [''],
                endTimes: [''],
                attendanceData: {
                    expectedAttendance: 0,
                    actualAttendance: 0,
                    absentSeatNumbers: '',
                },
            }
        );
    }, [initialData]);

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

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <div className="fixed inset-0 z-20 overflow-y-auto">
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
                        <div className="fixed inset-0 backdrop-blur-sm transition-opacity" aria-hidden={true}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75" />
                        </div>
                    </Transition.Child>
                    <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden={true}>
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
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            編輯考程
                                        </h3>
                                        <div className="mt-2">
                                            {data.subjects.map((subject, index) => (
                                                <div key={index} className="flex space-x-4 mt-2">
                                                    <input
                                                        type="text"
                                                        value={subject}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            handleSubjectChange(index, e.target.value);
                                                        }}
                                                        className="block flex-grow px-3 py-2 rounded-md bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        placeholder="科目"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.startTimes[index]}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            handleStartTimeChange(index, e.target.value);
                                                        }}
                                                        className="block w-32 px-3 py-2 rounded-md bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        placeholder="開始時間"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.endTimes[index]}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                            handleEndTimeChange(index, e.target.value);
                                                        }}
                                                        className="block w-32 px-3 py-2 rounded-md bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        placeholder="結束時間"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="text-red-600 hover:text-red-800 focus:outline-none"
                                                        onClick={() => {
                                                            const newData = { ...data };
                                                            newData.subjects.splice(index, 1); // 删除科目
                                                            newData.startTimes.splice(index, 1); // 删除对应的开始时间
                                                            newData.endTimes.splice(index, 1); // 删除对应的结束时间
                                                            setData(newData);
                                                        }}
                                                    >
                                                        刪除
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                className="mt-2 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                                                onClick={() => {
                                                    const newData = { ...data };
                                                    newData.subjects.push('');
                                                    newData.startTimes.push('');
                                                    newData.endTimes.push('');
                                                    setData(newData);
                                                }}
                                            >
                                                新增科目
                                            </button>
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="text-lg font-medium text-gray-900">出缺席資訊</h4>
                                            <div className="flex space-x-4 mt-2">
                                                <input
                                                    type="number"
                                                    value={data.attendanceData.expectedAttendance}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        handleExpectedAttendanceChange(parseInt(e.target.value, 10));
                                                    }}
                                                    className="block w-32 px-3 py-2 rounded-md bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="應到人數"
                                                />
                                                <input
                                                    type="number"
                                                    value={data.attendanceData.actualAttendance}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        handleActualAttendanceChange(parseInt(e.target.value, 10));
                                                    }}
                                                    className="block w-32 px-3 py-2 rounded-md bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="實到人數"
                                                />
                                                <input
                                                    type="text"
                                                    value={data.attendanceData.absentSeatNumbers}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        handleAbsentSeatNumbersChange(e.target.value);
                                                    }}
                                                    className="block flex-grow px-3 py-2 rounded-md bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    placeholder="缺席座號"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleSaveClick}
                                >
                                    <FontAwesomeIcon icon={faSave} className={"mr-2"} />
                                    儲存
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={onClose}
                                >
                                    <FontAwesomeIcon icon={faArrowRightFromBracket} className={"mr-2"} />
                                    取消
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );
};

export default EditDialog;
