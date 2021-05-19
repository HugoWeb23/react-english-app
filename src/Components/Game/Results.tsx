import { useEffect, useState } from "react";
import { Loader } from "../../UI/Loader";
import { apiFetch } from "../../Utils/Api";

export const Results = ({match}: any) => {
   const idPart: string = match.params.id;
   const [partInfo, setPartInfo] = useState<any>({})
   const [loader, setLoader] = useState<boolean>(true)

   useEffect(() => {
       (async() => {
        const part = await apiFetch(`/api/part/${idPart}`)
        setPartInfo(part);
        setLoader(false)
       })()
    }, [])

    if(loader) {
        return <Loader/>
    }

    return <>
    <h2>Résultats</h2>
    {partInfo[0].questions.map((q: any) => <div className={`alert alert-${q.correcte ? 'success' : 'danger'}`}>{q.intitule} - {q.question}</div>)}
    </>
}