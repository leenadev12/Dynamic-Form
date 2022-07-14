import axios from "axios";

import { formValues, formPayload, formError } from "./formSlice";

type DataProps = {
    [key: string]: string | number
}

export const submit = (data: DataProps) => async (dispatch: any) => {
    dispatch(formPayload(data))

    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }

    const response = await axios.post('https://ulventech-react-exam.netlify.app/api/form', data, { headers })
        .then(response => {
            if (response) {
                dispatch(formValues(response.data))
            }
        }).catch(err => dispatch(formError(err.response.data.message)))
}
