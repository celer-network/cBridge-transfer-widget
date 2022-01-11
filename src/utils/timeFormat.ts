function formatTimeCountDown(times: number) {
    let day = "0";
    let hour = "0";
    let minute = "0";
    let second = "0";
    if (times > 0) {
        day = "" + Math.floor(times / (60 * 60 * 24));
        hour = "" + (Math.floor(times / (60 * 60)) - (+day * 24));
        minute = "" + (Math.floor(times / (60)) - (+day * 24 * 60) - (+hour * 60));
        second = "" + (Math.floor(times) - (+day * 24 * 60 * 60) - (+hour * 60 * 60) - (+minute * 60));
    }
    if (+hour <= 9) hour = "0" + hour;
    if (+minute <= 9) minute = "0" + minute;
    if (+second <= 9) second = "0" + second;
    if (day === "00" || day === "0"){
        return `${hour}h ${minute}m ${second}s`
    } 
    return `${day}d ${hour}h ${minute}m ${second}s`
}

export {
    formatTimeCountDown,
}