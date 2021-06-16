interface IErrors {
    field: any,
    message: string
}

export class ApiErrors {
    errors: IErrors
    constructor(errors: IErrors) {
        this.errors = errors
    }

    get globalErrors() {
        return this.errors;
    }

    get errorsPerField() {
        const errors: IErrors[] = [];
       Object.entries(this.errors).map(([key, value]) => errors.push({['field']:key, ['message']: value.message}));
       return errors;
    }
}

export const apiFetch = async (endpoint: string, options = {}) => {
    const token = null;
    options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        ...options
    }
    
    const response = await fetch('https://hugomongoapi.herokuapp.com' + endpoint, options)
    if (response.status == 204) {
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