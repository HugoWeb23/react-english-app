interface IErrors {
    field: any,
    message: string
}

export class ApiErrors {
    errors: any
    constructor(errors: any) {
        this.errors = errors
    }

    get globalErrors() {
        if(this.errors.globalErrors) {
            const errors: any[] = []
            this.errors.globalErrors.forEach((error: any) => errors.push(error.message))
            console.log(this.errors)
            return errors;
        }
        return []
    }

    get errorsPerField() {
        if(this.errors.errorsPerField) {
            const errors: any[] = [];
            Object.entries(this.errors.errorsPerField).map(([key, value]: any) => errors.push({ ['field']: key, ['message']: value.message }));
            console.log(this.errors)
            return errors;
        }
        return []
       
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

    const response = await fetch('http://localhost:5000' + endpoint, options)
    if (response.status == 204) {
        return null;
    }
    const responseData = await response.json();
    if (response.ok) {
        return responseData
    } else {
        if (responseData.errors) {
            throw new ApiErrors({errorsPerField: responseData.errors})
        } if (responseData.globalErrors) {
            throw new ApiErrors({globalErrors: responseData.globalErrors})
        }
    }
}