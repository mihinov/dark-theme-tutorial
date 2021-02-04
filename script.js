class ThemeRadio {
  constructor(selectorRadios) {
    const nodeListBool = NodeList.prototype.isPrototypeOf(selectorRadios);
    
    this.themeRadiosDOM = nodeListBool ? selectorRadios : document.querySelectorAll(selectorRadios);
    this.matchMediaDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.initRadioValueFromLocalStorage(this.themeRadiosDOM);

    this.addEventsListenerRadio(this.themeRadiosDOM, 'input', (event) => {
      const target = event.target;
      const value = target.value;
      
      localStorage.setItem('theme', JSON.stringify(value));
      this.choosingDesiredTheme(value);
    });

  }

  addEventsListenerRadio(domElems, eventName, eventFunc) {
    for (let i = 0; i < domElems.length; i++) {
      const domElem = domElems[i];
      domElem.addEventListener(eventName, eventFunc);
    }
  }

  initRadioValueFromLocalStorage(radioDomElems) {
    const radioArrElems = Array.from(radioDomElems);

    const theme = JSON.parse(localStorage.getItem('theme'));

    if (theme) {
      const findRadio = radioArrElems.find(radio => radio.value === theme);
      findRadio.checked = true;
      const themeActiveName = this.getRadioValue(this.themeRadiosDOM);
      this.choosingDesiredTheme(themeActiveName);
    } else { // в локальном хранилище нету темы
      radioArrElems[0].checked = true;
      const themeActive = this.getRadioValue(radioDomElems);
      localStorage.setItem('theme', JSON.stringify(themeActive));
      this.choosingDesiredTheme(themeActive);
    }
  }

  addTheme(themeName, excludeClasses = ['light-theme', 'dark-theme']) {
    const classesDOM = Array.from(document.documentElement.classList);

    for (const className of classesDOM) {
      const findClassExclude = excludeClasses.find(excludeClass => excludeClass === className);
      if (findClassExclude) {
        document.documentElement.classList.remove(findClassExclude);
      }
    }

    document.documentElement.classList.add(themeName);
  }

  getRadioValue(radioDomElems) {
    const radioArrElems = Array.from(radioDomElems);
    const findActiveRadio = radioArrElems.find(item => item.checked === true);
    
    return findActiveRadio.value;
  }

  choosingDesiredTheme(themeName) {
    if (themeName === 'default-theme') {
      const theme = this.getDefaultTheme();
      this.addTheme(theme);
      this.matchMediaDark.addEventListener('change', this.matchMediaDarkListener);
    } else if (themeName === 'light-theme' || themeName === 'dark-theme') {
      this.addTheme(themeName);
      this.matchMediaDark.removeEventListener('change', this.matchMediaDarkListener);
    }
  }

  matchMediaDarkListener = (event) => {
    const darkActive = event.matches;
    if (darkActive) {
      this.addTheme('dark-theme');
    } else {
      this.addTheme('light-theme');
    }
  }

  getDefaultTheme() {
    return this.matchMediaDark.matches ? 'dark-theme' : 'light-theme';
  }
}

const radiosTheme = document.querySelectorAll('.radio-theme');
const themeRadio = new ThemeRadio(radiosTheme);