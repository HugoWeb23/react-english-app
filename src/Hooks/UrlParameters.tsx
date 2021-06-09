import {IFiletredQuestions} from '../Types/Interfaces'

export const ObjectToUrlParameters = (obj: IFiletredQuestions): string => {
    const params = Object.entries(obj)
    let url: string | null = null
    params.forEach((value: any) => {
      let name: string;
      let singleValue: string | number | boolean;
      value.forEach((v: any, index: number) => {
        index === 0 && (name = v)
        index !== 0 && (singleValue = v)
        if (Array.isArray(v)) {
          v.forEach((current) => {
            if (name === "theme") {
              current = current._id;
            }
            if (url === null) {
              url = `?${name}=${current}`;
              return;
            }
            url += `&${name}=${current}`;
          });
        } else if (index !== 0 && (v.length > 0 || typeof v === "number")) {
          if (url === null) {
            url = `?${name}=${singleValue}`;
          } else {
            url += `&${name}=${singleValue}`;
          }
        }
      });
    });
    return url ?? '';
  };