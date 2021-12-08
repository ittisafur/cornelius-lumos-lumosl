export default {
    name: 'formatLineBreaks',
    filter: string => {
        let parts = string.split(',');
        return parts.reduce((a, v) => {
            a += `<span>${v}</span><br />`;
            return a;
        }, "");
    }
}