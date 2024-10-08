import CONFIG from "@/config/app_config"

const URL = CONFIG.API_URL + '/events'

async function getEvent(token: string) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    const response = await fetch(URL, {
        method: 'GET',
        headers: headers,
    })

    const jsonResponse = await response.json()

    if (!response.ok) {
        console.log('error', jsonResponse)
    } else {
        return jsonResponse
    }

}

async function getQuestions(token: string) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    const response = await fetch(`${URL}/questions`, {
        method: 'GET',
        headers: headers,
    })

    const jsonResponse = await response.json()

    if (!response.ok) {
        console.log('error', jsonResponse)
    } else {
        return jsonResponse['data']
    }
}

type questionCreate = {
    "content": string,
    "context": string
}

async function sendQuestion(token: string, questionCreateModel: questionCreate) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    const response = await fetch(`${URL}/questions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(questionCreateModel)
    })

    const jsonResponse = await response.json()
    console.log(jsonResponse);
}
export { getEvent, getQuestions, sendQuestion }