import fetch from "../util/fetch-fill";
import URI from "urijs";

// records endpoint
window.path = "http://localhost:3000/records";

// transform response
const transformResponse = ({ res, page }) => {
    let result = {
        ids: [],
        open: [],
        closedPrimaryCount: 0,
        previousPage: (page > 1) ? page - 1 : null,
        nextPage: (page < 50 && res.length > 0) ? page + 1 : null 
    };
    res.map(record => {
        const isPrimary = ["red", "blue", "yellow"].indexOf(record.color) !== -1;
        const isOpen = record.disposition === "open";

        result.ids.push(record.id);

        if(isOpen) {
            result.open.push({ 
                ...record,
                isPrimary
            });
        }

        if(!isOpen && isPrimary) {
            result.closedPrimaryCount++;
        }
    })

    //console.log('result', result)
    return result
}

// Your retrieve function plus any additional functions go here ...
const retrieve = async (options) => {
    if(typeof options === 'undefined') options = {}
    if(typeof options.page === 'undefined') options.page = 1
    if(typeof options.colors === 'undefined') options.colors = []

    try {
        const url = new URI(window.path);
        const offset = (options.page * 10) - 10

        url.setSearch({
            limit: 10,
            offset,
            "color[]": options.colors 
        })

        const response = await fetch(url);
        const res = await response.json();
        const transformRes = transformResponse({
            res,
            page: options.page
        });

        return transformRes;
    } catch (e) {
        const errorMessage = "Error with request";
        console.log('error', errorMessage, e)
    }
}


export default retrieve;
