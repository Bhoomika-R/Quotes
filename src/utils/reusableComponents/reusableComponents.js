export const formatDate = (dateString) => {
    const date = new Date(dateString);
    console.log(date); // Add this to check the parsed date

    // Check if the date is valid
    if (isNaN(date)) {
        console.error('Invalid Date');
        return;
    }

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    console.log('result', `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
    return `${year}-${month}-${day}`;
}
