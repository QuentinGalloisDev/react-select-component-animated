
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './AnimatedSelect.css';

export const Select = ({ options, label, searchInput, fadeInDuration, fadeOutDuration, debounceDelay, onChange, value }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(value || options[0] || ''); // Initialise avec la première option
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [initialized, setInitialized] = useState(false);
    const selectBoxRef = useRef(null);
    const searchInputRef = useRef(null);
    const optionsContainerRef = useRef(null);
    const optionRefs = useRef({}); // Pour stocker les refs des options

    //Permet à l'animation CSS de se jouer correctement lors de l'ouverture du menu déroulant.
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialized(true);
        }, 0);

        return () => clearTimeout(timer);
    }, []);
    //Filtre les options en fonction du terme de recherche (searchTerm) et met à jour l'état filteredOptions avec les options filtrées
    useEffect(() => {
        setFilteredOptions(
            options.filter(option =>
                option.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        if (searchInput && isOpen) {
            searchInputRef.current.focus();
        }
    }, [searchTerm, options, isOpen, searchInput]);
    //Met à jour l'état selectedOption pour qu'il corresponde à la prop value lorsqu'elle change
    useEffect(() => {
        if (value) {
            setSelectedOption(value);
            //ou réinitialisation quand les options changent et selectedOption est vide
        } else if (options.length > 0 && !selectedOption) {
            setSelectedOption(options[0]);
        }
    }, [value, options, selectedOption]);
    // Fonction pour gérer l'ouverture et la fermeture du menu déroulant en alternant l'état isOpen. 

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        // Elle s'assure également que le champ de recherche reçoit le focus lorsque le menu est ouvert, 
        // pour que l'utilisateur puisse immédiatement commencer à taper une recherche
        if (!isOpen && searchInput) {
            searchInputRef.current.focus();
        }
    };

    const handleOptionClick = (option) => {
        //met à jour l'état selectedOption avec l'option qui a été cliquée
        setSelectedOption(option);
        //ferme le menu déroulant
        setIsOpen(false);
        //efface le texte saisi dans le champ de recherche.
        setSearchTerm('');
        //Si une fonction onChange est fournie en tant que prop, elle est appelée avec l'option sélectionnée.
        //permet à la fonction parent de gérer les changements de sélection.
        if (onChange) {
            onChange(option); // Appel de la fonction de rappel
        }
    };

    // Fonction pour limiter la fréquence à laquelle une fonction est exécutée, afin d'améliorer les performances en évitant les appels répétés lors de la saisie rapide.
    const debounce = (func, delay) => {
        let timeoutId;
        //Retourne une nouvelle fonction qui attend un délai (delay) avant d'appeler la fonction d'origine (func).
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    //Fonction de filtrage qui utilise la fonction debounce pour ne mettre à jour l'état searchTerm qu'après un certain délai après que l'utilisateur ait cessé de taper.
    const debouncedSearch = useCallback(debounce((value) => {
        setSearchTerm(value);
    }, debounceDelay), []);
    // Chaque fois que l'utilisateur tape dans la barre de recherche, la fonction handleSearchChange appelle debouncedSearch avec le nouveau terme de recherche
    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleKeyDown = (e) => {
        //Lorsqu'une des touches Enter ou Space est pressée, la fonction vérifie si le menu est ouvert (isOpen). 
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            //Si oui, elle sélectionne la première option filtrée et ferme le menu en appelant handleOptionClick. 
            if (isOpen) {
                const firstOption = filteredOptions[0];
                if (firstOption) {
                    handleOptionClick(firstOption);
                }
                //Si le menu est fermé, elle ouvre le menu en appelant toggleDropdown().
            } else {
                toggleDropdown();
            }
            //Lorsque la touche Escape est pressée, elle ferme le menu déroulant en mettant isOpen à false.
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };
    // Vérifie si l'élément actuellement focalisé (e.relatedTarget) est à l'intérieur du conteneur des options
    const handleBlur = (e) => {
        //Si ce n'est pas le cas, cela signifie que l'utilisateur a cliqué en dehors de la boîte de sélection et du menu déroulant, donc le menu se ferme.
        if (optionsContainerRef.current && !optionsContainerRef.current.contains(e.relatedTarget)) {
            setIsOpen(false);
        }
    };

    const handleOptionKeyDown = (e, option) => {
        //Lorsqu'une des touches Enter ou Space est pressée sur une option, 
        //la fonction appelle handleOptionClick(option) pour sélectionner l'option et fermer le menu déroulant
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOptionClick(option);
        }
    };
    // Variables css personnalisées pour gérer le comportement des animations du menu déroulant.
    const containerStyle = {
        '--fade-in-duration': fadeInDuration,
        '--fade-out-duration': fadeOutDuration
    };

    return (
        <div className="animated-select-container" style={containerStyle}>
            <div>{label}</div>
            <div
                className="animated-select-box"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby="selected-option"
                ref={selectBoxRef}
                onBlur={handleBlur}
            >
                <span id="selected-option">{selectedOption}</span>
                <span className={`arrow ${isOpen ? 'open' : ''}`}>{">"}</span>
            </div>
            <div
                className={`options-dropdown ${isOpen ? 'open' : 'closed'} ${initialized ? 'initialized' : 'no-animation'}`}
                onBlur={handleBlur}
                tabIndex={-1}
                ref={optionsContainerRef}
                role="listbox"
                aria-hidden={!isOpen}
            >
                {searchInput && (
                    <input
                        type="text"
                        className={`search-bar ${isOpen ? 'open' : 'closed'}`}
                        placeholder="Rechercher..."
                        onChange={handleSearchChange}
                        aria-label="Search options"
                        ref={searchInputRef}
                        tabIndex={isOpen ? 0 : -1}
                    />
                )}
                <div
                    className={`options-container ${isOpen ? 'open' : 'closed'}`}
                    role="listbox"
                    aria-activedescendant={selectedOption}
                    tabIndex={isOpen ? 0 : -1}
                >
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className="option"
                            onClick={() => handleOptionClick(option)}
                            role="option"
                            aria-selected={option === selectedOption}
                            tabIndex={isOpen ? 0 : -1}
                            onBlur={handleBlur}
                            onKeyDown={(e) => handleOptionKeyDown(e, option)}
                            ref={(el) => (optionRefs.current[option] = el)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

