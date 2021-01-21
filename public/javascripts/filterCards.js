domIsReady(function() {
    let searchInputs = document.querySelectorAll(`.filter input[type='search']`);
    let filterArray = [...searchInputs];
    let cards = document.querySelectorAll('.cards');
    console.log(cards.length)

    const createSearchInputFilterArr = arr => arr.map(x => [x.getAttribute('name'), x.value.toLowerCase()])

    const testEmptyArr = (arr) => arr.filter(x => x.value!== "").length === 0 ? true : false;

    // const createObjectFromArray = arr => {
    //     let obj = {}
    //     arr.forEach(el => {
    //         obj[el[0]] = el[1]
    //     })
    //     return obj
    // }


    function filterFields(card) {
        let searchInputFilterArr = createSearchInputFilterArr(filterArray);
        let fields = card.querySelectorAll('.fld');
        let filteredFilterByArr = searchInputFilterArr.filter(x => (x[1]));
        let fieldValues = [...fields].map(fld => {
            fldArr = fld.getAttribute('data-key').split(': ')
            return fldArr
        })
        let xxce = fieldValues.filter((x, idx) => {
            let m = filteredFilterByArr.filter(y => y[0] === x[0] && x[1] !== "undefined" && x[1].toLowerCase().search(y[1]) !== -1)
            return (m.length > 0 ? true : false)
        })

        return [...fields].filter((item) => {
            if(xxce.length === filteredFilterByArr.length) return true
        })
    }

    // function filterFields(card) {
    //     let searchInputFilterArr = createSearchInputFilterArr(filterArray);
    //     let fields = card.querySelectorAll('.fld');
    //     return [...fields].filter((item) => {
    //         let  itemKeyValue = item.getAttribute('data-key').split(': ');
    //          if (searchInputFilterArr.find(element => element[0] === itemKeyValue[0])) {
    //             let key = searchInputFilterArr.find(element => element[0] === itemKeyValue[0]);

    //             return key[1] && itemKeyValue[1] !== "undefined" && itemKeyValue[1].toLowerCase().search(key[1]) !== -1; 
    //         }
    //     })
    // }

    
   
    function filterCards() {
        [...cards].forEach((card) => {
            card.parentElement.style.display = "none";
            let filteredCards = filterFields(card);
            if (filteredCards.length > 0) {
                card.parentElement.style.display = ''
            }
        })
        if (testEmptyArr(filterArray)) {
            cards.forEach(card => card.parentElement.style.display = "")
        }
    }

    filterArray.map((x) => {
        x.addEventListener('keyup', (e) => {
            filterCards();
        })
        x.addEventListener('click', (e) => {
            // filterCards();
            if (testEmptyArr(filterArray)) {
                cards.forEach(card => card.parentElement.style.display = "")
            }
        })
    })
})