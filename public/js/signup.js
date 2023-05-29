const button = document.querySelector('#signup-button');

button.addEventListener('click', () => {
    const key = Number(document.querySelector("#num").value + "" + document.querySelector('#key').value);
    const username = document.querySelector('#name').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const data = {
        key: key,
        name: username,
        password: password
    };
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: `'{"key": ${key},"name": "${name}","password": "${password}"}'`,
        mode: 'no-cors'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'http://localhost:3000/login';
            } else {
                alert(data.message);
            }
        });
});