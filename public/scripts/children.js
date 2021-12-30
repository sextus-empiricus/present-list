const $newChildForm = document.querySelector('#form-child');

const $inputName = document.querySelector('#input-child-name');
const $inputAddress = document.querySelector('#input-child-address');
const $selectPresent = document.querySelector('#select-child-present');

const $btnsSave = document.querySelectorAll('.btn-save');
const $btnsRemove = document.querySelectorAll('.btn-remove');
const $selectsPresent = [...document.querySelectorAll('.present-select')];

$newChildForm.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const response = await axios({
            method: 'post',
            url: '/api/v1/children',
            data: {
                name: $inputName.value,
                address: $inputAddress.value,
                present: $selectPresent.value,
            }
        });
        location.assign('/children')
    } catch (err) {
        alert(err.response.data.message);
    }
})

$btnsSave.forEach(async el => {
    try {
        el.addEventListener('click', async () => {
            const id = el.dataset.id

            const selectendPresent = ($selectsPresent.filter(el => {
                return el.dataset.id === id;
            }))[0];
            //  validation on front site. becouse of sth the "catch" here don't catch any backend errors;
            if (selectendPresent.selectedOptions[0].textContent !== 'none') {
                const availableNumber = ((selectendPresent.selectedOptions[0].textContent).split('available: ')[1]).split(')')[0];
                if (availableNumber <= 0) {
                    location.assign('/children');
                    return alert('All gifts of this type have been assigned to some child. Please chose another one.');
                }
            }
            const response = await axios({
                method: 'patch',
                url: `/api/v1/children/${id}`,
                data: {
                    present: selectendPresent.value,
                }
            });
            location.assign('/children');
        })
    } catch (err) {
        //  doesn't work;
    }
})

$btnsRemove.forEach(el => {
    try {
        el.addEventListener('click', async () => {
            const confirm = prompt('Provide: "confirm" to continue.');
            if (confirm === 'confirm') {
                const id = el.dataset.id;
                const response = await axios({
                    method: 'delete',
                    url: `/api/v1/children/${id}`,
                });
                location.assign('/children');
            }
        })
    } catch (err) {
        alert('Something went wrong. Please try again.');
    }
})