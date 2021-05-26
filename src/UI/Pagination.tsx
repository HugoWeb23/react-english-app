import Pagination from 'react-bootstrap/Pagination'

interface IPaginate {
    totalPages: number,
    currentPage: number,
    pageChange: any
}

export const Paginate = ({ totalPages, currentPage: pageCourante, pageChange }: IPaginate) => {

    const range = (from: number, to: number, step: number = 1) => {
        let i = from;
        const range: number[] = [];

        while (i <= to) {
            range.push(i);
            i += step;
        }
        return range;
    };

    const fetchPageNumbers = () => {
        const pagesVoisines: number = 1;
        const nombresTotaux: number = pagesVoisines * 2 + 3;
        const totalBlocks: number = nombresTotaux + 2;

        if (totalPages > totalBlocks) {
            let pages = [];

            const leftBound = pageCourante - pagesVoisines;
            const rightBound = pageCourante + pagesVoisines;
            const avantDernierePage = totalPages - 1;

            const premierePage = leftBound > 2 ? leftBound : 2;
            const dernierePage = rightBound < avantDernierePage ? rightBound : avantDernierePage;

            pages = range(premierePage, dernierePage);

            const compteurPages = pages.length;
            const decompte = nombresTotaux - compteurPages - 1;

            const flecheGauche = premierePage > 2;
            const flecheDroite = dernierePage < avantDernierePage;

            const flecheGauchePage = "LEFT";
            const flecheDroitePage = "RIGHT";

            if (flecheGauche && !flecheDroite) {
                const extraPages = range(premierePage - decompte, premierePage - 1);
                pages = [flecheGauchePage, ...extraPages, ...pages];
            } else if (!flecheGauche && flecheDroite) {
                const extraPages = range(dernierePage + 1, dernierePage + decompte);
                pages = [...pages, ...extraPages, flecheDroitePage];
            } else if (flecheGauche && flecheDroite) {
                pages = [flecheGauchePage, ...pages, flecheDroitePage];
            }

            return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    }

    const pages = fetchPageNumbers();

    return <Pagination className="d-flex justify-content-end">
        <Pagination.First onClick={() => pageChange(1)} disabled={pageCourante === 1} />

        {pages.map((page: number | string, index: number) => {
            if (page === 'LEFT') {
                return <Pagination.Prev onClick={() => pageChange(pageCourante - 2)} disabled={pageCourante === 1} />
            }
            if (page === 'RIGHT') {
                return <Pagination.Next onClick={() => pageChange(pageCourante + 2)} disabled={pageCourante === totalPages} />
            }
            return <Pagination.Item key={index} active={page === pageCourante} onClick={() => pageChange(page)}>{page}</Pagination.Item>
        })}

        <Pagination.Last onClick={() => pageChange(totalPages)} disabled={pageCourante === totalPages} />
    </Pagination>
}