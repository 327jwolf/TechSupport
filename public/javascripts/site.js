const domIsReady = function(callback) {
    document.readyState === "interactive" || document.readyState === "complete" 
    ? callback() 
    : document.addEventListener("DOMContentLoaded", callback);
};

domIsReady (function() {
    let re = /(\/[a-zA-Z]+|(\/))/ ;
    let urlLocation = window.location.href.slice(7).match(re);

    let reg = /([a-z]+:\/\/[a-zA-Z0-9:]+)|(\/[a-zA-Z0-9]+)+/;
    let trailingPath = window.location.href.split('/');//.match(reg)
    // console.log(`/${trailingPath.slice(3, ).join('/')}`)
    // console.log(window.location.origin)

    let nav = document.querySelector(".nav");
    let navLinks = nav.querySelectorAll('.nav-link');
    [...navLinks].forEach(element => {

        if (element.getAttribute("href") === `/${trailingPath.slice(3, ).join('/')}`) {
            element.parentNode.style.backgroundColor = '#909090';
        }
        else {
            element.parentNode.style.backgroundColor = '';
        }
    });

    let scrollLocation;

 // This section controls theme

    let theme = document.querySelector('.toggle-theme');
    let root = document.querySelector(':root');

    let oasisLogoColor = document.querySelector('#oasis-blue');

    // Show or hides input form
    // let formDiv = document.querySelector('.form-div');
    // let toggleform = document.querySelector('.toggle-form');
    // let togFormPath = toggleform.querySelector('svg path');

    // toggleform.addEventListener('click', (e) => {
    //     if(formDiv.style.display === 'block'){
    //         formDiv.style.display = 'none';
    //         localStorage.setItem('inputForm', true);
    //     }else{
    //         formDiv.style.display = 'block';
    //         localStorage.removeItem('inputForm');
    //     }
    // });

    // if(localStorage.getItem('inputForm')){
    //     formDiv.style.display = 'none'
    // }

    function setTheme(e) {
        if(document.documentElement.hasAttribute('theme')){
            document.documentElement.removeAttribute('theme');
            // togFormPath.setAttribute('fill', ' hsl(350, 5%, 15%)');
            oasisLogoColor.setAttribute('stop-color', 'blue');
            localStorage.removeItem('theme'); 
        }
        else{
            document.documentElement.setAttribute('theme', 'dark');
            // togFormPath.setAttribute('fill', 'hsl(350, 9%, 89%)');
            oasisLogoColor.setAttribute('stop-color', 'lightblue');
            localStorage.setItem('theme', 'dark');
        }
    }

    if(localStorage.getItem('theme')){
        document.documentElement.setAttribute('theme', 'dark');
        // togFormPath.setAttribute('fill', 'hsl(350, 9%, 89%)');
        oasisLogoColor.setAttribute('stop-color', 'lightblue');
    }
 
    theme.addEventListener('click', setTheme);

    let cacheBust = () => Math.floor(Math.random(1000) * 99999);

/**********************select js areas based on route******************************/
    // let checkAllValid = {};
    if (trailingPath.includes('login')) {
        validateLoginForm()
    }
    if (trailingPath.includes('register')) {
        validateRegisterForm()
    }

    
/***************Cient Side Form Validation****************************/
    
    const validateField = {
        getMessages: function (field) {
            const msgs = []
            msgs.push(validateField.lengthCheck(field, { min: 6, max: 8 }));
            msgs.push(validateField.lowercaseCheck(field));
            msgs.push(validateField.uppercaseCheck(field));
            msgs.push(validateField.numberCheck(field));
            msgs.push(validateField.specialCharactersCheck(field));
            msgs.push(validateField.repeatCharactersCheck(field));
            return msgs;
        },
        characterTypeCheck: function (field, regex, type) {
            const matches = field.match(regex) || [];
          
            if (matches.length === 0) {
              return {
                message: `Your password has no ${type}`,
                checkOk: false
              };
            }
          
            if (matches.length < 1) {
              return {
                message: `Your password could use more ${type}`,
                checkOk: false
              };
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            };
        },
        lengthCheck: function(field, {min = 2, max = 6}) {
            const length = field.length;
            
            if (field == undefined) {
                return {
                message: `This field must contain at least ${max} characters`,
                checkOk: ''
                };
            }
            
            if (length < max) {
                return {
                message: `This field must contain at least ${max} characters`,
                checkOk: false
                };
            }
            return {
                message: '',
                checkOk: true
            };
        },
        uppercaseCheck: function(field) {
            return validateField.characterTypeCheck(field, /[A-Z]/g, 'uppercase characters');
        },
        lowercaseCheck: function(field) {
            return validateField.characterTypeCheck(field, /[a-z]/g, 'lowercase characters');
        },
        numberCheck: function(field) {
            return validateField.characterTypeCheck(field, /[0-9]/g, 'numbers');
        },
        specialCharactersCheck: function(field) {
            return validateField.characterTypeCheck(field, /[^0-9a-zA-Z\s]/g, 'special characters');
        },
        repeatCharactersCheck: function(field) {
            const matches = field.match(/(.)\1/g) || [];
            if (matches.length > 0) {
                return {
                message: 'Your password has repeat characters',
                checkOk: false
                };
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            };
        },
        matchCharacters: function(field) {
            const matches = field.match(/[^A-Za-z\.\'\-0-9]+/g) || [];
            if (matches.length > 0) {
                return {
                message: 'Field contains illegal characters, only A-Za-z0-9.\' allowed',
                checkOk: false
                };
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            };
        },
        matchEmailDomain: function(field) {
            const matches = field.match(/@oasiscws.com/g) || [];
            if (matches.length === 0) {
                return {
                message: 'Only the @oasiscws.com domain is allowed.',
                checkOk: false
                };
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            };
        },
        matchEmail: function(field) {
            const matches = field.match(/[a-zA-Z0-9\_\-\.\+]+@oasiscws.com/g) || []; // !#$%&'*+-/=?^_`{|}~ [^_-\.\+]
            if (matches.length === 0) {
                return {
                message: 'Email not valid format at this point.',
                checkOk: false
                };
            }
            return {
                message: '',
                checkOk: field !== "" ? true : false
            }
        },
        confirmPassword: function(confirmfield, passwordfield){
            if (confirmfield !== passwordfield) {
                return {
                message: 'Confirm password does not match password.',
                checkOk: false
                };
            }
            return {
                message: '',
                checkOk: confirmfield !== "" ? true : false
            };
        },
    }

    function messagesToElements(el, msgs) {
        el.target.nextElementSibling.innerHTML = '';
        msgs.forEach(msg => {
            if(msg.message !== '') {
                const messageEl = document.createElement('div');
                messageEl.innerText = msg.message;
                el.target.nextElementSibling.appendChild(messageEl);
            }
        });
    }

    function validatePwField(e) {
        const msgs = validateField.getMessages(e.target.value);
        messagesToElements(e, msgs);
    }

/*******************************************************************/

    function validateRegisterForm () {
        let registerForm = document.querySelector('#register');
        let registerSubmitBtn = registerForm.querySelector('.btn');
        let registerInputCollection = registerForm.querySelectorAll('.form-control');
        let passwordInput = registerForm.querySelector('input[name="password"]');
        let registedFormInputs = registerForm.querySelectorAll('input');
        registerSubmitBtn.disabled = true;

        const validForm = () => {
            let formOKtoSubmit = [...registedFormInputs].map(el => el.classList.contains('validityChecked') ? 'true' : 'false').includes('false');
            if(formOKtoSubmit){
                registerSubmitBtn.disabled = true;
            }else{
                registerSubmitBtn.disabled = false;
            }
        }

        
       [... registerInputCollection].forEach(el => {
            
            el.addEventListener('keyup', (el) => {
                if (el.target.value !== "" && el.target.nextElementSibling.innerHTML === "") {
                    el.target.classList.add("validityChecked");
                } else {
                    el.target.classList.remove("validityChecked");
                }
                validForm();
            });
            if (el.getAttribute('name') === 'password') {
                el.addEventListener('input', validatePwField);
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        validatePwField(el);
                    }
                    
                });
            }

            if (el.getAttribute('name') === 'firstname' || el.getAttribute('name') === 'lastname') {
                el.addEventListener('input', (el) => {
                    let msgs = [
                        validateField.lengthCheck(el.target.value, {min: 1, max: 3}),
                        validateField.matchCharacters(el.target.value)
                    ];
                    messagesToElements(el, msgs);
                });
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        let msgs = [
                            validateField.lengthCheck(el.target.value, {min: 1, max: 3}),
                            validateField.matchCharacters(el.target.value)
                        ];
                        messagesToElements(el, msgs);
                    }
                    
                });
            }

            if (el.getAttribute('name') === 'email') {
                el.addEventListener('input', (el) => {
                    let msgs = [
                        validateField.matchEmailDomain(el.target.value),
                        validateField.matchEmail(el.target.value)
                    ];
                    messagesToElements(el, msgs);
                });
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        let msgs = [
                            validateField.matchEmailDomain(el.target.value),
                            validateField.matchEmail(el.target.value)
                        ];
                        messagesToElements(el, msgs);
                    }
                });
            }

            if (el.getAttribute('name') === 'confirmpassword') {
                el.addEventListener('input', (el) => {
                    let msgs = [
                        validateField.confirmPassword(el.target.value, passwordInput.value)
                    ];
                    messagesToElements(el, msgs);
                });
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        let msgs = [
                            validateField.confirmPassword(el.target.value, passwordInput.value)
                        ];
                        messagesToElements(el, msgs);
                    }
                });
            }
            
        });

        registerSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            registerForm.querySelector('form').submit();

        });
    }



    function validateLoginForm() {
        let loginForm = document.querySelector('#login');
        let loginSubmitBtn = loginForm.querySelector('.btn');
        let loginEmail = loginForm.querySelector('input[name="email"]');
        let passwordInput = loginForm.querySelector('input[name="password"]');
        
        loginSubmitBtn.disabled = true;

        const validForm = () => {
            let formOKtoSubmit = [loginEmail, passwordInput].map(el => el.classList.contains('validityChecked') ? 'true' : 'false').includes('false');
            if(formOKtoSubmit){
                loginSubmitBtn.disabled = true
            }else{
                loginSubmitBtn.disabled = false
            }
        }

        [loginEmail, passwordInput].forEach(el => {
            
            el.addEventListener('keyup', (el) => {
                if (el.target.value !== "" && el.target.nextElementSibling.innerHTML === "") {
                    el.target.classList.add("validityChecked");
                } else {
                    el.target.classList.remove("validityChecked");
                }
                validForm()
            });
            if (el.getAttribute('name') === 'password') {
                el.addEventListener('input', validatePwField);
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        validatePwField(el);
                    }
                    
                });
            }

            if (el.getAttribute('name') === 'email') {
                el.addEventListener('input', (el) => {
                    let msgs = [
                        validateField.matchEmailDomain(el.target.value),
                        validateField.matchEmail(el.target.value)
                    ];
                    messagesToElements(el, msgs);
                });
                el.addEventListener('mouseenter', (el) => {
                    if (!el.target.classList.contains('validityChecked')) {
                        let msgs = [
                            validateField.matchEmailDomain(el.target.value),
                            validateField.matchEmail(el.target.value)
                        ];
                        messagesToElements(el, msgs);
                    }
                });
            }
        });

        loginSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            loginForm.querySelector('form').submit();

        });
    }

    if (trailingPath.includes('dashboard')) {
        supportForm();
    }


    
    function supportForm(){
        // Main form Selectors
        const entryFormOpen = document.querySelector('.open-hidden');
        const entryFormWrapper = document.querySelector('.form-wrapper');
        const entryForm = entryFormWrapper.querySelector('.entry-form')
        const createdBy = entryFormWrapper.querySelector('input[name=createdBy]');
        const createdAt = entryFormWrapper.querySelector('input[name=createdAt]');

        const ticketNumber = entryFormWrapper.querySelector('input[name=ticketnumber]');
        const machineList = entryFormWrapper.querySelector('#machineList');
        const problemList = entryFormWrapper.querySelector('#problemList');
        const partsneeded = entryFormWrapper.querySelector('#pn');

        // cards selectors
        const cards = document.querySelectorAll('.card-div');
        const cardcontainer = document.querySelector('.cardsDiv')

        // card subform selectors
        const subForm = document.querySelectorAll('.subform');
        const subform = cardcontainer.querySelector('.subform');

        // Search Pop-up Selectors
        const searchModal = document.querySelector('.search-wrapper');
        const searchFields = searchModal.querySelectorAll('.search-field');
        const bodyNumTarget = searchModal.querySelector('#n-search');
        const btnCloseSearchModal = searchModal.querySelector('#btn-close-modal');
        const filterDiv = document.querySelector('.filterDiv');
        const cardcollapse = document.querySelector('.card-collapse');
        

        let pnClicked = "";


        [...cards].forEach((card, index) => {
            const btn = card.querySelector('.addForm');
            btn.addEventListener('click', e => {
                e.preventDefault();
              
                if (subform.classList.contains('none')) {
                    const ticketNum = e.target.parentElement.querySelector(`#tick${index}`).innerText;
                    const ticketNumInput = cardcontainer.querySelector('input[name=ticketnumber]');
                    ticketNumInput.value = ticketNum;

                    const createdByInput = cardcontainer.querySelector('input[name=createdBy]');
                    createdByInput.value = getUserId();

                    const createdAtInput = cardcontainer.querySelector('input[name=createdAt]');
                    let now = new Date();
                    createdAtInput.value = now; 
                    if(e.target.parentElement.nextElementSibling !== null){
                        const box = e.target.parentElement.nextElementSibling.getBoundingClientRect();
                        console.log(box)
                        subform.style.position = 'absolute';
                        subform.style.top = `${window.scrollY + box.top - 450}px`;
                        subform.style.left = `${((window.innerWidth - box.width) / 2)*.55}px`;
                        subform.style.zIndex = '5';
                    }
                    

                    subform.classList.remove('none');
                    // btn.innerText = 'Close';
                } else {
                    subform.classList.add('none');
                    btn.innerText = 'Add New Details Form';
                    
                }
                
            })
        });


        [...subForm].forEach((form, idx) => {
            const pn = form.querySelector(`#pn-sub`);
            pn.addEventListener('click',  (e) => {
                 e.preventDefault();
                openPartsSearchModal(e);
            });
        });

         

        setSelectMenus('/api/machinetypes/all', machineList, 'machinename', `machineType`);
        setSelectMenus('/api/problemcatagory/all', problemList, `catagoryname`);

        entryFormOpen.addEventListener('click', (e) => {
            if(entryFormWrapper.style.display === 'block'){
                entryFormWrapper.style.display = 'none';
                entryForm.reset()
            }else{
                entryFormWrapper.style.display = 'block';
                getTicketNumber(ticketNumber);
                createdBy.value = getUserId();
                let now = new Date();
                createdAt.value = now; //.toUTCString();
            }
        })

        cardcollapse.addEventListener('click', (e) => {
            if(filterDiv.classList.contains('none')){
                filterDiv.classList.remove('none')
            }else{
                filterDiv.classList.add('none')
            }
        })

        function closeSearchModal(e){
            searchModal.style.display = 'none';
            bodyNumTarget.innerHTML = ``;
            [...searchFields].forEach(item => item.value = "");
            // input.removeEventListener("input", _inputEventListener)
        }

        btnCloseSearchModal.addEventListener('click', closeSearchModal);

        partsneeded.addEventListener('click', (e) => {
            e.preventDefault()
            openPartsSearchModal(e);
        });

        function openPartsSearchModal(e) {
            e.preventDefault();
            pnClicked = e.target
            searchModal.style.display = 'block';
        }
     

        let j = 1;
        [... searchFields].forEach((searchBoxInput) => {
            searchBoxInput.addEventListener('input', async function _inputEventListener (inputEl) {
                inputEl.preventDefault();
                let searchParameter = inputEl.target.value;
                let apiUrlSearchParam = inputEl.target.getAttribute('id') === 'number-search' ? 'pn' : 'desc';

                let timer;
                bodyNumTarget.innerHTML = ``;
                clearTimeout(timer);
                if (searchParameter === "*" || searchParameter.length > 3) {
                    timer = await sleep(350);
                    bodyNumTarget.innerHTML = ``;
                    let lookupResult = '';

                    try {
                        lookupResult = await getData(`${window.location.origin}/api/parts/${apiUrlSearchParam}/${searchParameter}`, 'GET', {data: 'yes'})
                        lookupResult.forEach((item, idx) => {
                            const elContainer = createPartSearchModalItems(item, idx)

                            elContainer.addEventListener('click', (e) => {
                                e.preventDefault();
                                let inputField = '';
                                let htmlPartsSection = createPartSearchResultElement(j);

                                pnClicked.nextElementSibling.insertAdjacentHTML('beforeend', htmlPartsSection);
                                inputField = document.querySelector(`#inputParts-${j}`);
                                let removeBtn = document.querySelector(`#remove-btn${j}`);
                                removeBtn.addEventListener('click', e => {
                                    e.preventDefault();
                                    e.target.parentElement.parentElement.remove()
                                });
                                inputField.value = `${item.partNumber} - ${item.description}`;
                                j++;
                                document.querySelector('#number-search').value = '';
                                document.querySelector('#desc-search').value = '';
                                // closeSearchModal();
                            })

                            bodyNumTarget.appendChild(elContainer);

                            let elNum = document.createElement("div");
                            elNum.style.width = '17%';
                            elNum.style.display = 'inline-block';
                            elNum.innerText = item.partNumber;
                            elContainer.appendChild(elNum);

                            let elDesc = document.createElement("div");
                            elDesc.style.width = '80%';
                            elDesc.style.display = 'inline-block';
                            elDesc.innerText = item.description;
                            elContainer.appendChild(elDesc);
                            elNum = ""
                            elDesc = ""
                        })
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
        });
    
    
    }


/********************************************************************************************************************************************************/

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createPartSearchResultElement(idx){
        return `
            <li id="part-li${idx}">
                <div class="gc3" id="parts-div${idx}">
                    <input class="form-control w50" id="inputParts-${idx}" type="text" name="parts[${idx}][part]" placeholder="">
                    <input type="radio" id="missing-${idx}" name="parts[${idx}][status]" value="Missing">
                    <label class="inline-label" for="missing-${idx}">Missing</label>
                    <input type="radio" id="needed-${idx}" name="parts[${idx}][status]" value="Needed" checked >
                    <label class="inline-label" for="needed-${idx}">Needed</label>
                    <button class="btn" id="remove-btn${idx}">Remove</button>
                </div>
            </li>
        `;

    }

    function createPartSearchModalItems(item, idx){
        let element = document.createElement("div");
        element.style.paddingTop = '.5rem';
        element.setAttribute('data-key', item._id);
        element.setAttribute('id', `result-${idx}`);
        element.classList.add('search-res');
        if(idx%2 === 0) {
            element.classList.add('bground-color');
        }
        return element

    }

    async function getTicketNumber (ticketNumEL) {
        try {
            const result = await getData(`${window.location.origin}/autoinc`, 'GET', {data: 'yes'});
            ticketNumEL.value = await result;    
        } catch (error) {
            console.error(error);
        }
    }

    function setSelectMenus(url, selector, typeValue1 , typeValue2='') {
        getData(`${window.location.origin}${url}`, 'GET', {data: 'yes'})
        .then(list => {
            let optstr= '';
            list.forEach(type => {
                let opt = document.createElement('option');
                opt.value = `${type[typeValue1]}  ${type[typeValue2] ? type[typeValue2] : ""}`;
                selector.appendChild(opt); 
            });
        })
        .catch(e => console.error(e));
    }

    function createPartFromSearch(target, destination, bodyNumTarget) {
        
    }



    function getUserId(){
        const userid = document.querySelector('input[name=userId]');
        return userid.value;
    }

    async function getData(url = '', method, data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(data) // body data type must match "Content-Type" header

        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    // Example POST method implementation:
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'reload', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
})