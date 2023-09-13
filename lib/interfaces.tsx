export interface Exam {
    id: number;
    subject: string;
    startTime: string;
    endTime: string;
}

export interface Attendance {
    present: number;
    total: number;
    absentSeatNumbers?: string;
}

export interface EditingData {
    subjects: string[];
    startTimes: string[];
    endTimes: string[];
    attendanceData: {
        expectedAttendance: number;
        actualAttendance: number;
        absentSeatNumbers: string;
    };
    showSchedule: boolean;
}