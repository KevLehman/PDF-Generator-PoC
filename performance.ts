export function measurePerformance(prevCpuUsage: NodeJS.CpuUsage) {
    const memory = process.memoryUsage();
    const used = memory.heapUsed / 1024 / 1024;
    const cpuUsage = process.cpuUsage(prevCpuUsage);

    console.table({
        "Memory Usage": `${Math.round(used * 100) / 100} MB`,
        "Resident Set Size": `${Math.round(memory.rss / 1024 / 1024 * 100) / 100} MB`,
        "CPU Usage": `${cpuUsage.user / 1000} ms`,
    })
}