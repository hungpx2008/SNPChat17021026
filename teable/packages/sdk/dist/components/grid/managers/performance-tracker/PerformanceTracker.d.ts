declare class PerformanceTracker {
    private startTimes;
    private totalTimes;
    startTrack(key: string): void;
    endTrack(key: string): void;
    getTotalTime(key: string): number;
    reset(): void;
    getAllTotalTimes(): {
        [key: string]: number;
    };
}
export declare const performanceTracker: PerformanceTracker;
export {};
