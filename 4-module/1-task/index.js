function makeFriendsList(friends) {
  const friendsList = document.createElement('UL');
  friends.forEach(friend => {
    const friendItem = document.createElement('LI');
    friendItem.innerHTML = `${friend.firstName} ${friend.lastName}`;
    friendsList.appendChild(friendItem);
  });
  return friendsList;
}
