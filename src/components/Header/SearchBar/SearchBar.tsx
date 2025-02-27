import {useDispatch, useSelector} from "react-redux";
import {RootState, AppDispatch} from "../../../store/store.ts";
import {setFocus,  addToHistory, removeFromHistory} from "../../../store/header/searchSlice.ts";
import styles from "./SearchBar.module.css";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    executeSearchChange,
    fetchProductSuggestionsThunk
} from "../../../store/productSpace/productsSlice.ts";
import useDebounce from "./../../../useDebounce.ts";

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
    const {isFocused, query, searchHistory} = useSelector((state: RootState) => state.searchSlice);
    const {arrayOfSuggestions} = useSelector((state: RootState) => state.productsSlice);

    const [inputValue, setInputValue] = useState(query);

    const [suggestions, setSuggestions] = useState<string[]>(searchHistory);

    useEffect(() => {
        setInputValue(query);

    }, [query]);

    useEffect(() => {
        if(inputValue.trim() !== ''){
            setSuggestions(arrayOfSuggestions)
        }else{
            setSuggestions(searchHistory)
        }

    }, [arrayOfSuggestions, searchHistory, inputValue]);

    //Для управления фокусом search input
    const inputRef = useRef<HTMLInputElement>(null); // ✅ Референс для input

    // 👇 Добавляем состояние для управления выбранным элементом истории
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    //Ссылка на список (ul), под поисковой строкой(история, названия возможных товаров)
    const filteredSuggestionsRef = useRef<HTMLUListElement | null>(null);

    // Дебаунсируем ввод пользователя с задержкой 300 мс
    const debouncedQuery = useDebounce(inputValue, 300);

    //Запрос на получение подсказок
    useEffect(() => {

        if (debouncedQuery.trim() === "") return;

        dispatch(fetchProductSuggestionsThunk(debouncedQuery));

    }, [debouncedQuery, dispatch]);

    useEffect(() => {
        setSelectedIndex(null);
    }, [inputValue]);

    //Метод вызывается двумя способами, кнопка и enter
    const handleSubmit = (selectedText? : string) => {

        inputRef.current?.blur();
        dispatch(setFocus(false))

        let enterTxt: string;

        if(selectedText){
            enterTxt = selectedText
            setInputValue(selectedText)
        }else{
            enterTxt = inputValue
        }

        if(enterTxt.trim() === query.trim() || (enterTxt.trim() === "" && query.trim() === "")){
            console.log("Повторный запрос отменен!")
            return
        };
        //История поисковых запросов
        if (enterTxt.trim() && enterTxt.trim() !== "" && !selectedText) {
            dispatch(addToHistory(enterTxt));
        }

        //Если мы что-то искали и хотим вернуться к началу, выполняем запрос с пустой поисковой строкой.
        //Мы проверяем что запрос до этого был, мы все стерли и хотим вернуться.
        //query.trim() !== "" - это подтверждает что запрос с какими-то данными уже был.
        dispatch(executeSearchChange(enterTxt));
    };
    
    //Если изменили и убрали фокус с input, то нужно вернуть его в исходное состояние
    const handlerReset = () =>{
        setInputValue(query)
        dispatch(setFocus(false))
    }

    //Очистка поисковой строки
    const handleRemoveHistory = (item: string) => {
        dispatch(removeFromHistory(item));
    };

// Полная функция экранирования для RegExp
    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const useFilteredSuggestions = (
        suggestions: string[],
        inputValue: string
    ): HighlightedSuggestion[] => {
        return useMemo(() => {
            const query = inputValue.trim();
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
        }, [suggestions, inputValue]);
    };

    const filtered = useFilteredSuggestions(suggestions, inputValue);


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
            {isFocused && <div className={styles.overlay} onClick={() => handlerReset()}/>}


            {/* Поле поиска с кнопкой */}
            <div className={styles.inputContainer}>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="Поиск..."
                    value={inputValue}
                    onKeyDown={handleKeyDown}
                    onFocus={() => dispatch(setFocus(true))}
                    onChange={(e) =>  setInputValue(e.target.value)}
                />
                <button className={styles.clearSearch} onClick={() =>  setInputValue("")}>
                    <svg className={styles.clearSearchIcon} width="24" height="24" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 4L20 20M20 4L4 20" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                </button>

                <button className={styles.searchButton} onClick={() => handleSubmit()}>
                    Найти
                </button>
            </div>

            {isFocused && filtered.length > 0 && (

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
                            {inputValue.trim().length == 0 && (
                                <button
                                    className={styles.removeButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveHistory(item.text);
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
