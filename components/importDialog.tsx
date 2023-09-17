import React, { FC, MouseEvent, Fragment, ChangeEvent, useState } from "react";
import { Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ImportExamData } from "@lib/interfaces";

interface ImportDialogProps {
    isOpen: boolean;
    onClose: (event: MouseEvent<HTMLButtonElement>) => void;
    onImportData: (data: ImportExamData[]) => void;
}

const ImportDialog: FC<ImportDialogProps> = ({ isOpen, onClose, onImportData }) => {
    const [courseCode, setCourseCode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSaveClick = (event: MouseEvent<HTMLButtonElement>) => {
        setLoading(true);
        fetch("/api/import?code=" + courseCode)
            .then((response) => response.json())
            .then((data) => {
                onImportData(data);
                setLoading(false);
                setCourseCode("");
                onClose(event);
            })
            .catch((error) => {
                console.error("Error importing exam data:", error);
                setLoading(false);
            });
    };

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
                            <div className="absolute inset-0 bg-gray-500 opacity-75" />
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
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                                <div className="content-end items-end ml-auto absolute top-4 right-4">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-slate-600 shadow-sm px-2.5 py-1.5 bg-red-500 dark:bg-red-400 text-base font-medium text-white hover:bg-red-600 dark:hover:bg-red-500 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm active:scale-90"
                                        onClick={onClose}
                                    >
                                        <FontAwesomeIcon icon={faXmark} className={"text-3xl"} />
                                    </button>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3
                                            className="text-2xl mb-4 leading-6 font-semibold text-gray-900 dark:text-white"
                                            id="modal-title"
                                        >
                                            導入考程
                                        </h3>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={courseCode}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    setCourseCode(e.target.value)
                                                }
                                                className="block w-64 px-3 py-2 rounded-md bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="輸入考程代碼"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={handleSaveClick}
                                    disabled={loading}
                                >
                                    <div className="my-auto">
                                        <FontAwesomeIcon icon={faSave} className={"mr-2"} />
                                        {loading ? '正在載入...' : '導入'}
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={onClose}
                                >
                                    <div className="my-auto">
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} className={"mr-2"}/>
                                        取消
                                    </div>
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </div>
        </Transition>
    );
};

export default ImportDialog;
