import { useEffect, useCallback } from 'react';

export function DefaultCallbackPostRequest(endPoint, bodyData, authTokens = '') {
    let url = process.env.REACT_APP_API_URL + endPoint;

    let header = {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + authTokens,
    };

    const handleCallback = useCallback(async (setState = false, extraData = {}) => {
        let out = await fetch(url, {
            method: 'POST',
            headers: header,
            body: JSON.stringify(Object.assign({}, bodyData, extraData))
        })
            .then(res => res.json())
            .then(json => {
                setState && setState(json)
                return json
            })
        return (out)
    }, [bodyData]);
    return (handleCallback);
}

export function DefaultCallbackGetRequest(endPoint, authTokens, stateHandler) {
    let url = process.env.REACT_APP_API_URL + endPoint;
    let header = {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + authTokens,
    };

    const handleCallback = useCallback(async () => {
        await fetch(url, {
            method: 'GET',
            headers: header,
        })
            .then(res => res.json())
            .then(json => stateHandler(json))
    }, []);

    return (handleCallback);
}