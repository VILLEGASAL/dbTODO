
export let getDate = ():string => {

    let today = new Date();
    let currentDay = today.getDay();


    let options:object = {

        weekday: "long",
        day: "numeric",
        month: "long"
    }

    let day:string = today.toLocaleDateString('en-US', options);

    return day;
}

let getDay = ():string => {

    let today = new Date();
    let currentDay = today.getDay();


    let options:object = {

        weekday: "long",
    }

    let day:string = today.toLocaleDateString('en-US', options);

    return day;
}

