const pad = (n) => String(n).padStart(2, '0');
export function dayString(d = new Date()) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function atTime(day, hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m, 0, 0);
}
export function startOfDay(d = new Date()) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
export function hhmm(d) {
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
//# sourceMappingURL=time.js.map