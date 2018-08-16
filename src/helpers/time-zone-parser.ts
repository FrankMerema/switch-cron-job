export const processDate = (date: Date) => {
    let timezoneOffset = 0;
    const currentDate = new Date();

    if (date.getTimezoneOffset() < 0) {
        timezoneOffset = -60000 * date.getTimezoneOffset();
    } else {
        timezoneOffset = 60000 * date.getTimezoneOffset();
    }

    currentDate.setTime(date.valueOf() + timezoneOffset);

    return currentDate;
};
