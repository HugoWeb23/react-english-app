
export const Results = ({score = {}}: any) => {
    return <>
    <h2>Résultats</h2>
    <p>Vous avez obtenu <b>{score.points} / {score.totalPoints}</b></p>
    </>
}