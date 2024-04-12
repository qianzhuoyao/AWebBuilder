import axios from 'axios';


const parseParam = <B>(body: B) => {
    if (body instanceof Object) {
        return Object.keys(body).map(key => (`${key}=${(body as Record<string, B>)[key]}`)).join('&')
    }
    return ''
}

export const aGet = <B>(url: string, body: B):Promise<any> => {

    return new Promise((resolve, rej) => {
        const params = parseParam(body)

        axios.get(`${url}?${params}`)
            .then(function (response) {
                // handle success
                console.log(response);
                resolve(response)
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                rej(error)
            })
            .finally(function () {
                // always executed
            });
    })
}

export const aPost = <B>(url: string, body: B):Promise<any> => {
    return new Promise((resolve, rej) => {
        axios.post(url, body, {

            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                rej(error)
            });
    })
}