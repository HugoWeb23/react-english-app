export class ApiErrors {
    constructor(errors) {
        this.errors = errors
    }

    get globalErrors() {
        return this.errors;
    }

    get errorsPerField() {
        const errors = [];
       Object.entries(this.errors).map(([key, value]) => errors.push({['field']:key, ['message']: value.message}));
       return errors;
    }
}

export const apiFetch = async (endpoint, options = {}) => {
    const token = null;
    options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        ...options
    }
    
    const response = await fetch('http://localhost:5000' + endpoint, options)
    if (response.status == 204) {
        return null;
    } else if(response.status == 401) {
        return null;
    }
    const responseData = await response.json();
    if (response.ok) {
        return responseData
    } else {
        if(responseData.errors) {
            throw new ApiErrors(responseData.errors)
        }
    }
}