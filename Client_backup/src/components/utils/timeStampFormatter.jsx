export const convertTimestampToNormal = (timestamp, flag) => {
    console.log("Upload Time", timestamp);
    let date = "";
    if (flag) {
        date = new Date(timestamp * 1000); // timestamp is in seconds
    } else {
        date = new Date(timestamp); // timestamp is in milliseconds
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0'); // Add milliseconds

    const formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    return formatted;
};

export const convertTimestampToNormalWithoutMS = (timestamp, flag) => {
    console.log("Upload Time", timestamp);
    let date = "";
    if (flag) {
        date = new Date(timestamp * 1000); // timestamp is in seconds
    } else {
        date = new Date(timestamp); // timestamp is in milliseconds
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const formatted = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formatted;
};


export const convertNormalToTimestamp = (normalDate) => {

    const [year, month, dayAndTime] = normalDate.split("-");
    const [day, time] = dayAndTime.split(" ");
    const [hours, minutes, seconds] = time.split(":");

    const date = new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is zero-based
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds)
    );

    // Convert to Unix timestamp (in seconds)
    const timestamp = Math.floor(date.getTime() / 1000);
    return timestamp

}
