const users=[];

function joinUser(id,username,room){
    const user={id,username,room};
    users.push(user);
    return user;

}
function currentUser(id){
    return users.find(user => user.id===id); 

}
function userLeavs(id){
    const index=users.findIndex(user => user.id === id);
    if(index !== -1){
        return users.splice(index,1)[0];
    }
}
function userRoom(room){
    return users.filter(user => user.room===room);
}

module.exports={
    joinUser,
    currentUser,
    userLeavs,
    userRoom
}