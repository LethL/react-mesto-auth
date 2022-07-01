export const BASE_URL = 'https://auth.nomoreparties.co';

function handleResponse(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Ошибка: ${res.status}`)
}

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({password, email})
    }).then((res) => {
        return handleResponse(res)
    })
};

export const authorize = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({password, email})
    }).then((res) => {
        return handleResponse(res)
    })
};