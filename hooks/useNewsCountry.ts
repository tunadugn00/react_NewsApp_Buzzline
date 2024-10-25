import newsCountryList from "@/constants/CountryList";
import { useCallback, useState } from "react"


export const useNewsCountries = () =>{
    const [newsCountries, setNewsCountries] = useState(newsCountryList)

    const toggleNewsCountry = useCallback ((id: number) => {
        setNewsCountries((preNewsCountries) =>{
            return preNewsCountries.map((item, index) =>{
                if( index === id) {
                    return {
                        ...item,
                        selected: !item.selected
                    }
                }
                return item;
            })
        });
    }, []);

    return{
        newsCountries,
        toggleNewsCountry
    }
}