const $newPresentForm = document.querySelector('#form-present');

const $inputName = document.querySelector('#input-present-name');
const $inputAmount = document.querySelector('#input-present-amount');

const $btnsRemove = document.querySelectorAll('.btn-remove');

$newPresentForm.addEventListener('submit', async e => {
    try {
        e.preventDefault();
        const response = await axios({
            method: 'post',
            url: '/api/v1/presents',
            data: {
                name: $inputName.value,
                amount: $inputAmount.value,
            }
        })
        location.assign('/presents')
    } catch (err) {
        alert(err.response.data.message);
    }
})

$btnsRemove.forEach(el => {
    try {
        el.addEventListener('click', async () => {
            const confirm = prompt('Deleting a present will remove all relations it\'s. Please, provide: "confirm" to continue.');
            if (confirm === 'confirm') {
                const id = el.dataset.id;
                const response = await axios({
                    method: 'delete',
                    url: `/api/v1/presents/${id}`
                })
                location.assign('/presents')
            }
        })
    } catch (err) {
        alert('Something went wrong. Please try again.');
    }
})