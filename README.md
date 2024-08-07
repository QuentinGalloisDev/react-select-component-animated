# react-select-componenet-animated created using `create-react-app`.

## InstallationRun the following command:`npm install react-select-componenet-animated`

# react-select-component-animated

Un composant React pour les sélections animées avec des transitions fluides et personnalisables.

## Installation

Installez le package via npm :

```bash
npm install react-select-component-animated

# Exemple : 

## import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select-component-animated';

options={['Vanille', 'Chocolat', 'Menthe', 'Café']}

function App() {
  return (
    <div>
      <h1>Example of react-select-component-animated</h1>
      <Select options={options} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

# Props 

| Name | Description | Type | Default
| --- | --- | --- | --- |
| Label | Une étiquette descriptive pour le composant de sélection. Exemple : "Choisissez une option".| String | 
| Options | Un tableau d'options disponibles pour la sélection. Exemple : ['Option 1', 'Option 2', 'Option 3'].| Array
| searchInput | Indique si un champ de recherche doit être affiché pour filtrer les options. Exemple : true.| Boolean
| fadeInDuration | Durée de l'animation de l'apparition du menu déroulant en CSS. Spécifiée en unités de temps CSS (comme s ou ms). Exemple : "0.3s".| String
| fadeOutDuration | Durée de l'animation de la disparition du menu déroulant en CSS. Spécifiée en unités de temps CSS (comme s ou ms). Exemple : "0.3s". | String
| debounceDelay | Délai de debounce en millisecondes pour la mise à jour du terme de recherche. Utilisé pour limiter la fréquence des mises à jour lors de la saisie dans le champ de recherche. Exemple : 300. | Number
| onChange | Fonction de rappel appelée lorsque la sélection change. Reçoit la nouvelle option sélectionnée en argument.Exemple : function handleChange(selectedOption) {console.log(selectedOption);} | Function
| value | La valeur actuellement sélectionnée. Peut être utilisée pour initialiser la sélection ou pour la mettre à jour de manière contrôlée. Exemple : "Option 1". | String 

#Explication des fonctionnalités
##Initialisation et état :

useState initialise et gère l'état local, comme l'ouverture du menu (isOpen), l'option sélectionnée (selectedOption), le terme de recherche (searchTerm) et les options filtrées (filteredOptions).
Effets :

useEffect initialise les options filtrées et met à jour les options disponibles et la sélection en réponse aux changements de props.
Gestion du menu déroulant :

toggleDropdown ouvre et ferme le menu.
handleOptionClick gère la sélection d'une option et ferme le menu.
Débounce :

debounce limite la fréquence de mise à jour du terme de recherche pour améliorer les performances.
Clavier et focus :

handleKeyDown et handleOptionKeyDown gèrent la navigation au clavier.
handleBlur ferme le menu lorsque le focus est perdu.

## Styles :

containerStyle applique des variables CSS pour contrôler les animations.