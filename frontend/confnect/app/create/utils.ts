import CONFIG from "@/config/app_config"

export type eventCreate = {
    "name": string,
    "description": string,
    "email": string
}

const URL = CONFIG.API_URL + '/events'

export default async function createEvent(eventCreateModel: eventCreate) {
    const headers = {
        'Content-Type': 'application/json'
    }
    const response = await fetch(URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(eventCreateModel)
    })

    const jsonResponse = await response.json()

    if (!response.ok) {
        console.log('error', jsonResponse)
        return {}
    } else {
        return { token: jsonResponse['token']['value'], role: jsonResponse['token']['role'] }
    }

}