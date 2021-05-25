import Form from 'react-bootstrap/Form'

interface IElementsPerPage {
    elementsPerPage: number,
    onChange: (page: number) => void
}

export const ElementsPerPage = ({elementsPerPage, onChange}: IElementsPerPage) => {
    return <Form inline>
    <Form.Label className="my-1 mr-2" htmlFor="numberofresults">
        Afficher
 </Form.Label>
    <Form.Control as="select" id="numberofresults" onChange={(e) => onChange(parseInt(e.target.value, 10))} custom>
        {[2, 5, 10, 15, 25, 50].map((n: number, index: number) => {
            return <option key={index} value={n} selected={elementsPerPage == n}>{`${n} éléments`}</option>
        })}
    </Form.Control>
</Form>
}