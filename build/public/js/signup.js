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
    let data = {
        key: key,
        name: username,
        password: password
    }
    $.ajax({
        type: "POST",
        url: "/signup",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.success) {
                location.href = '/login';
            } else {
                alert("로그인 실패");
            }
        }
    });
});