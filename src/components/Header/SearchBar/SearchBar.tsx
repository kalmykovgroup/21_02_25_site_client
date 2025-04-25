import {useDispatch, useSelector} from "react-redux";
import styles from "./SearchBar.module.css";
import React, {useEffect, useMemo, useRef, useState} from "react";
import useDebounce from "../../../utils/useDebounce.ts";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../../routes/routes.ts";
import {
    fetchAutocompleteSuggestions,
    selectSearchHistory,
    selectSearchQuery,
    selectSearchSuggestions
} from "../../../store/search";
import {addToHistory, removeHistoryItem} from "../../../store/search/searchSlice.ts";


import {AppDispatch, SearchGetParam} from "../../../store/types.ts";

interface SearchBarProps {
    className?: string
}


interface HighlightedSuggestion {
    text: string; // Оригинальный текст
    parts: {     // Разбитые части текста
        value: string;    // Текст части
        highlighted: boolean; // Флаг выделения
    }[];
}


const SearchBar : React.FC<SearchBarProps> = ({className}: SearchBarProps) =>  {


    const dispatch = useDispatch<AppDispatch>();
    const query = useSelector(selectSearchQuery);
    const history = useSelector(selectSearchHistory);
    const uploadedSuggestions = useSelector(selectSearchSuggestions);
    const [input, setInput] = useState(query); // Локальное состояние для мгновенного отклика

    const [focus, setFocus] = useState(false);

    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState<string[]>(history);

    //Для управления фокусом search input
    const inputRef = useRef<HTMLInputElement>(null); // ✅ Референс для input

    // 👇 Добавляем состояние для управления выбранным элементом истории
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    //Ссылка на список (ul), под поисковой строкой(история, названия возможных товаров)
    const filteredSuggestionsRef = useRef<HTMLUListElement | null>(null);

    //Если ввод пустой, отображаем историю, иначе подгружаем с сервера подсказки
    useEffect(() => {
        if(input.trim() !== ''){
            setSuggestions(uploadedSuggestions)
        }else{
            setSuggestions(history)
        }

    }, [uploadedSuggestions, history, input]);

    useEffect(() => { //Когда мы покидаем из страницы найденных товаров, то мы все сбрасываем.
        setInput(query);
    }, [query]);

    // Дебаунсируем ввод пользователя с задержкой 300 мс
    const debouncedQuery = useDebounce(input, 300);

    //Запрос на получение подсказок
    useEffect(() => {

        if (debouncedQuery.trim() === "") return;

        dispatch(fetchAutocompleteSuggestions(debouncedQuery));

    }, [debouncedQuery, dispatch]);

    //Сбрасывает состояние выбора истории или подсказки, если начинаем вводить
    useEffect(() => {
        setSelectedIndex(null);
    }, [input]);

    //Метод вызывается двумя способами, кнопка и enter
    const handleSubmit = (selectedText? : string) => {

        if(!selectedText && (!input || input.trim() === "")) return;

        inputRef.current?.blur();

        setFocus(false)

        let newQuery: string;

        if(selectedText){
            newQuery = selectedText
            setInput(selectedText)
        }else{
            newQuery = input
        }

        if(newQuery.trim() === query?.trim()){
            console.log("Попытка отправить повторный запрос.")
            return
        }

        if(newQuery.trim() === ""){
            console.log("Попытка отправить пустой запрос.")
            return;
        }

        dispatch(addToHistory(newQuery));

        navigate(`${ROUTES.SEARCH}?${SearchGetParam.QUERY}=${encodeURIComponent(newQuery)}`);
    };

    //Если изменили и убрали фокус с input, то нужно вернуть его в исходное состояние
    const handlerReset = () => {
        setInput(query)
        setFocus(false)
    }



// Полная функция экранирования для RegExp
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const useFilteredSuggestions = (
        suggestions: string[],
        input: string
    ): HighlightedSuggestion[] => {
        return useMemo(() => {
            const query = input.trim();
            if (!query) {
                return suggestions.map(text => ({
                    text,
                    parts: [{ value: text, highlighted: false }]
                }));
            }

            const safeQuery = escapeRegExp(query);
            const regex = new RegExp(`(${safeQuery})`, 'gi');

            return suggestions.map(text => {
                const parts: { value: string; highlighted: boolean }[] = [];
                let lastIndex = 0;
                let match: RegExpExecArray | null;

                while ((match = regex.exec(text)) !== null) {
                    const start = match.index;
                    const end = start + match[0].length;

                    // Добавляем текст до совпадения
                    if (start > lastIndex) {
                        parts.push({
                            value: text.slice(lastIndex, start),
                            highlighted: false
                        });
                    }

                    // Добавляем совпадение
                    parts.push({
                        value: text.slice(start, end),
                        highlighted: true
                    });

                    lastIndex = end;
                }

                // Добавляем оставшийся текст
                if (lastIndex < text.length) {
                    parts.push({
                        value: text.slice(lastIndex),
                        highlighted: false
                    });
                }

                // Если нет совпадений, возвращаем исходный текст
                if (parts.length === 0) {
                    parts.push({ value: text, highlighted: false });
                }

                return { text, parts };
            });
        }, [suggestions, input]);
    };

    const filtered = useFilteredSuggestions(suggestions, input);


    // ✅ Перемещение по списку и прокрутка
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if(filtered.length == 0) return;
            setSelectedIndex((prevIndex) => {
                const nextIndex = prevIndex === null ? 0 : prevIndex + 1;
                if (nextIndex < filtered.length) {
                    scrollToItem(nextIndex);
                    return nextIndex;
                }
                return prevIndex;
            });
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if(filtered.length == 0) return;
            setSelectedIndex((prevIndex) => {
                const prev = prevIndex === null ? filtered.length - 1 : prevIndex - 1;
                if(prev == -1){
                    return null
                }

                if (prev >= 0) {
                    scrollToItem(prev);
                    return prev;
                }
                return prevIndex;
            });
        } else if (event.key === "Enter" && selectedIndex !== null) {
            if(filtered.length == 0) return;
            handleSubmit(filtered[selectedIndex].text.replace("\u00A0", " ")); // ✅ Теперь `.text` существует!
        }else if(event.key === "Enter"){
            handleSubmit()
        }
    };

    // ✅ Функция прокрутки к активному элементу
    const scrollToItem = (index: number) => {
        if (filteredSuggestionsRef.current) {
            const listItem = filteredSuggestionsRef.current.children[index] as HTMLElement;
            if (listItem) {
                listItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }
    };




    return (
        <div className={`${styles.searchWrapper} ${className}`}>
            {/* Затемнение экрана */}
            {focus && <div className={styles.overlay} onClick={() => handlerReset()}/>}


            {/* Поле поиска с кнопкой */}
            <div className={styles.inputContainer}>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="Поиск..."
                    value={input}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocus(true)}
                    onChange={(e) =>  setInput(e.target.value)}
                />
                <button className={styles.clearSearch} onClick={() =>  setInput("")}>
                    <svg className={styles.clearSearchIcon} width="24" height="24" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4L20 20M20 4L4 20" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>

                <button className={styles.searchButton} onClick={() => handleSubmit()}>
                    Найти
                </button>
            </div>

            {focus && filtered.length > 0 && (

                <ul className={styles.historyList} ref={filteredSuggestionsRef}>
                    {filtered.map((item, index) => (
                        <li key={item.text}
                            className={`${styles.historyItem} ${ selectedIndex === index ? styles.selected : "" }`}
                        >
                            <div
                                className={styles.name}
                                onClick={() => handleSubmit(item.text)}
                                role="button"
                                tabIndex={0}
                            >
                                {item.parts.map((part, partIndex) => (
                                    part.highlighted
                                        ?
                                        <span key={`${item.text}-${partIndex}`} className={styles.highlight} >
                                        {part.value.replace(" ", "\u00A0")}
                                      </span>
                                        :
                                        <span key={`${item.text}-${partIndex}`}>
                                          {part.value.replace(" ", "\u00A0")}
                                      </span>

                                ))}
                            </div>
                            {input.trim().length == 0 && (
                                <button
                                    className={styles.removeButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(removeHistoryItem(item.text));
                                    }}
                                    aria-label="Удалить из истории"
                                >
                                    <svg
                                        className={styles.removeIcon}
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M4 4L20 20M20 4L4 20"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </button>
                            )}
                        </li>
                    ))}
                </ul>

            )}


        </div>
    );
}

export default SearchBar;
