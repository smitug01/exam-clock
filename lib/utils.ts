import { Exam } from "@lib/interfaces";

export const saveExamScheduleToLocalStorage = (schedule: Exam[]) => {
  localStorage.setItem("examSchedule", JSON.stringify(schedule));
};

export const loadExamScheduleFromLocalStorage = () => {
  const schedule = localStorage.getItem("examSchedule");
  return schedule ? JSON.parse(schedule) : [];
};

export const calculateRemainingTime = (endTime: string) => {
    const now = new Date();
    const end = new Date(now.toDateString() + " " + endTime);
    const remainingMinutes = Math.floor((end.getTime() - now.getTime()) / (60 * 1000));

    if (remainingMinutes < 10) {
        const remainingSeconds = Math.floor((end.getTime() - now.getTime()) / 1000) % 60;
        return `${remainingMinutes >= 0 ? remainingMinutes : 0} 分鐘 ${remainingSeconds >= 0 ? remainingSeconds : 0} 秒`;
    } else if (remainingMinutes == 0) {
      const remainingSeconds = Math.floor((end.getTime() - now.getTime()) / 1000) % 60;
      return `${remainingSeconds >= 0 ? remainingSeconds : 0} 秒`;
    }

    return `${remainingMinutes >= 0 ? remainingMinutes : 0} 分鐘`;
};
