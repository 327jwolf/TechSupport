domIsReady(function() {
    let searchInputs = document.querySelectorAll(`.filter input[type='search']`);
    let filterArray = Array.from(searchInputs);
    let cards = document.querySelectorAll('.cards');

    function createFilterObj(){
		let obj = []
		filterArray.map(x => {
			let val = x.value.toLowerCase();
            let key = x.getAttribute('name');
			obj.push([key, val]);
		})
		return obj;
    }

    function filterFields(fields, filterByObj) {
        return Array.from(fields).filter((item) => {
            let keyValue = item.getAttribute('data-key').split(': ');
            if (filterByObj.find(element => element[0] == keyValue[0])) {
                let key = filterByObj.find(element => element[0] == keyValue[0]);
                return key[1] && keyValue[1].toLowerCase().search(key[1]) === -1; 
            }
            // console.log(keyValue)
            
        })
    }
    
    function filterCards() {
        let filterObj = createFilterObj();
        let cardArray = Array.from(cards);
        // console.log(cardArray)

        cardArray.forEach(card => {
            card.parentElement.style.display = "";
            let cardHeaderItems = card.querySelectorAll('.fld');
            // let cardDiv = card.querySelectorAll('.card-div');
            let headerItems = filterFields(cardHeaderItems, filterObj);
            // let divItems = filterFields(cardDivItems, filterObj);
            headerItems.forEach(item => card.parentElement.style.display = 'none');
            // divItems.forEach(item => card.style.display = 'none');
        })
    }

    filterArray.map((x, index) => {
		if (index >= 0) {
			x.addEventListener('keyup', (e) => {
				filterCards()
			})
		}
    })
})