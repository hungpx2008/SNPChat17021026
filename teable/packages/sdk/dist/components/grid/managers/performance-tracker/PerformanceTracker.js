class PerformanceTracker {
    startTimes = {};
    totalTimes = {};
    startTrack(key) {
        this.startTimes[key] = performance.now();
    }
    endTrack(key) {
        if (this.startTimes[key] == null) {
            console.error(`PerformanceTracker: endTrack called with key "${key}" without calling startTrack first`);
            return;
        }
        const endTime = performance.now();
        const sliceTime = endTime - this.startTimes[key];
        this.totalTimes[key] = (this.totalTimes[key] || 0) + sliceTime;
        delete this.startTimes[key];
    }
    getTotalTime(key) {
        return this.totalTimes[key] || 0;
    }
    reset() {
        this.startTimes = {};
        this.totalTimes = {};
    }
    getAllTotalTimes() {
        return this.totalTimes;
    }
}
export const performanceTracker = new PerformanceTracker();
