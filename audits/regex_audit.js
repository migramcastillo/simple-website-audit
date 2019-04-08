
const regex_test = (html, regex_strings, configuration) => {
    let ocurrences = [];
    let ocurrence;

    for (let str of regex_strings) {
        const regex = new RegExp(str, "gm");
        let indexes = [];

        while ((ocurrence = regex.exec(html))) {
            indexes.push(ocurrence.index);
        }

        let errors = indexes.map(index => {
            if (index - configuration.offsetRegex <= 0) return html.substr(0, configuration.offsetRegex * 2);
            else return html.substr(index - configuration.offsetRegex, configuration.offsetRegex * 2);
        });

        ocurrences = [...ocurrences, ...errors];
    }

    return ocurrences;
}

module.exports = regex_test;