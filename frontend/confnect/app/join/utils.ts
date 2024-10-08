import CONFIG from "@/config/app_config";

export type eventJoin = {
    "inviteCode": string,
    "password": string
}

const URL = CONFIG.API_URL + '/events'

export default async function joinEvent(eventJoinModel: eventJoin) {
    const headers = {
        'Content-Type': 'application/json',
    }
    console.log(JSON.stringify(eventJoinModel));
    const url = URL + "/events/join"
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(eventJoinModel)
    })

    const jsonResponse = await response.json()
    if (!response.ok) {
        console.log('error', jsonResponse)
    } else {
        console.log(jsonResponse);
        return jsonResponse['token']['value']
    }
}