import axios from 'axios';

export const aPost = <B>(url: string, body: B) => {
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