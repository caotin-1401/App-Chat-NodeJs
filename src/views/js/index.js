const socket = io();

document.getElementById("form-messages").addEventListener("submit", (event) => {
    event.preventDefault();
    let mes = document.getElementById("input-messages").value;
    let asknow = (err) => {
        if (err) {
            return alert("tin nhan khong hop le");
        }
    };
    socket.emit("send mes from client", mes, asknow);
});

socket.on("send mes from server", (mess) => {
    console.log(mess);
    const { mes, username, createAt } = mess;
    let contentHTML = document.getElementById("app__messages").innerHTML;
    const message = `
    <div class="message-item">
    <div class="message__row1">
        <p class="message__name">${username}</p>
        <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
        <p class="message__content">
        ${mes}
        </p>
    </div>
</div>
    `;
    let contentRender = contentHTML + message;
    document.getElementById("app__messages").innerHTML = contentRender;

    document.getElementById("input-messages").value = "";
});

//Gửi vị trí
document.getElementById("btn-share-location").addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send location from client", latitude, longitude);
    });
});
socket.on("send location from server", (data) => {
    const { createAt, mes, username } = data;
    let contentHTML = document.getElementById("app__messages").innerHTML;
    const message = `
    <div class="message-item">
    <div class="message__row1">
        <p class="message__name">${username}</p>
        <p class="message__date">${createAt}</p>
    </div>
    <div class="message__row2">
        <p class="message__content">
        <a href="${mes}" target="_blank">Vị trí của ${username}
        </a>
            
        </p>
    </div>
</div>
    `;
    let contentRender = contentHTML + message;
    document.getElementById("app__messages").innerHTML = contentRender;
});

//query strin
const param = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const { username, room } = param;
socket.emit("join room from client", { room, username });

//hien thi ten phong
document.getElementById("app__title").innerHTML = room;

//List users
socket.on("send list user from server", (listUser) => {
    let contentHTML = [];
    listUser.map((item) => {
        contentHTML += `
        <li class="app__item-user">${item.username}</li>
        `;
    });
    document.getElementById("app__list-user--content").innerHTML = contentHTML;
});

//basic về socket io
//nhan su kien tu server
// socket.on("send count", (count) => {
//     document.getElementById("value-count").innerHTML = count;
// });

// document
//     .getElementById("button-increment")
//     .addEventListener("click", () => {
//         socket.emit("increment");
//     });
