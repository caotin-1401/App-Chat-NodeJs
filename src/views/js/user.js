let listUser = [];
const addUser = (newUser) => {
    listUser = [...listUser, newUser];
};
const getListUser = (room) => listUser.filter((item) => item.room === room);

let removeUser = (id) => {
    console.log(id);
    listUser = listUser.filter((item) => item.id != id);
    console.log(listUser);
};

const findUser = (id) => {
    return listUser.find((item) => item.id === id);
};
module.exports = {
    getListUser,
    addUser,
    removeUser,
    findUser,
};
