async function buildVinylsTable( vinylsTable, vinylsTableHeader, token, message ) {
    try {
        const response = await fetch('/api/v1/vinyls', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        const data = await response.json();
        let children = [vinylsTableHeader];
        if (response.status === 200) {
            if (data.count === 0) {
                vinylsTable.replaceChildren(...children);
                return 0;
            } else {
                for (let i = 0; i < data.vinyls.length; i++) {
                    let editButton = `<td><button type="button" class="editButton" data-id=${data.vinyls[i]._id}>Edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.vinyls[i]._id}>Delete</button></td>`;
                    let rowHTML = `<td>${data.vinyls[i].albumTitle}</td><td>${data.vinyls[i].artistName}</td><td>${data.vinyls[i].vinylColor}</td><td>${data.vinyls[i].dateObtained}</td><td>${data.vinyls[i].pressing}</td><td>${data.vinyls[i].cost}</td><td>${data.vinyls[i].catalog}</td>${editButton}${deleteButton}`;
                    let rowEntry = document.createElement("tr");
                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                vinylsTable.replaceChildren(...children);
            }
            return data.count;
        } else {
            message.textContent = data.msg;
            return 0;
        }
    } catch (error) {
        message.textContent = 'An error has occurred.';
        return 0;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const logoff = document.getElementById("logoff");
    const message = document.getElementById("message");
    const loginRegister = document.getElementById("login-register");
    const register = document.getElementById("register");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const loginButton = document.getElementById("login-button");
    const registerDiv = document.getElementById("register-div");
    const name = document.getElementById("name");
    const email1 = document.getElementById("email1");
    const password1 = document.getElementById("password1");
    const password2 = document.getElementById("password2");
    const registerButton = document.getElementById("register-button");
    const registerCancel = document.getElementById("register-cancel");
    const vinyls = document.getElementById("vinyls");
    const vinylsMessage = document.getElementById("vinyls-message");
    const vinylsTable = document.getElementById("vinyls-table");
    const vinylsTableHeader = document.getElementById("vinyls-table-header");
    const addVinyl = document.getElementById("add-vinyl");
    const editVinyl = document.getElementById("edit-vinyl");
    const albumTitle = document.getElementById("album-title");
    const artistName = document.getElementById("artist-name");
    const vinylColor = document.getElementById("vinyl-color");
    const dateObtained = document.getElementById("date-obtained");
    const pressing = document.getElementById("pressing");
    const cost = document.getElementById("cost");
    const catalog = document.getElementById("catalog");
    const addingVinyl = document.getElementById("adding-vinyl");
    const editCancel = document.getElementById("edit-cancel");

    let showing = loginRegister;
    let token = null;
    document.addEventListener('startDisplay', async () => {
        showing = loginRegister;
        token = localStorage.getItem('token');
        if(token) {
            logoff.style.display = 'block';
            const count = await buildVinylsTable(
                vinylsTable, vinylsTableHeader, token, message
            );
            if(count > 0) {
                vinylsMessage.textContent = '';
                vinylsTable.style.display = 'block';
            } else {
                vinylsMessage.textContent = 'You currently do not have any vinyls in your collection.';
                vinylsTable.style.display = 'none';
            }
            vinyls.style.display= 'block';
            showing = vinyls;
        } else {
            loginRegister.style.display = 'block';
        }
    });

    let thisEvent = new Event('startDisplay');
    document.dispatchEvent(thisEvent);
    let suspendInput = false;
    
    document.addEventListener('click', async (e) => {
        if(suspendInput) {
            return;
        }
        if(e.target.nodeName === 'BUTTON') {
            message.textContent = '';
        }
        //Starting point 
        if(e.target === logoff) {
            localStorage.removeItem('token');
            token = null;
            showing.style.display = 'none';
            loginRegister.style.display = 'block';
            showing = loginRegister;
            vinylsTable.replaceChildren(vinylsTableHeader);
            logoff.style.display = 'none';
            message.textContent = 'You have logged off successfully.';
        } else if (e.target === register) {
            showing.style.display = 'none';
            registerDiv.style.display = 'block';
            showing = registerDiv;
        } else if (e.target == registerCancel) {
            showing.style.display = 'none';
            loginRegister.style.display = 'block';
            showing = loginRegister;
            email.value = '';
            password.value = '';
            name.value = '';
            email1.value = '';
            password1.value = '';
            password2.value = '';
        } else if (e.target === loginButton) {
            suspendInput = true;
            try {
                const response = await fetch('/api/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email.value, 
                        password: password.value
                    }),
                });
                const data = await response.json();
                if (response.status === 200) {
                    message.textContent = `You have logged in successfully. Welcome ${data.user.name}.`;
                    token = data.token;
                    localStorage.setItem('token', token);
                    showing.style.display = 'none';
                    thisEvent = new Event('startDisplay');
                    email.value = '';
                    password.value = '';
                    document.dispatchEvent(thisEvent);
                } else {
                    message.textContent = data.msg;
                }
            } catch (error) {
                message.textContent = 'An error has occurred.';
            }
            suspendInput = false;
        } else if (e.target === registerButton) {
            if (password1.value != password2.value) {
                message.textContent = 'The passwords entered do not match.'
            } else {
                suspendInput = true;
                try {
                    const response = await fetch('/api/v1/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: name.value,
                            email: email1.value, 
                            password: password1.value
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201) {
                        message.textContent = `You have registered successfully. Welcome ${data.user.name}.`;
                        token = data.token;
                        localStorage.setItem('token', token);
                        showing.style.display = 'none';
                        thisEvent = new Event('startDisplay');
                        document.dispatchEvent(thisEvent);
                        name.value = '';
                        email1.value = '';
                        password1.value = '';
                        password2.value = '';
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (error) {
                    message.textContent = 'An error has occurred.';
                }
                suspendInput = false;
            }
        } else if ( e.target === addVinyl) {
            showing.style.display = 'none';
            editVinyl.style.display = 'block';
            showing = editVinyl;
            delete editVinyl.dataset.id;
            albumTitle.value = '';
            artistName.value = '';
            vinylColor.value = '';
            dateObtained.value = '';
            pressing.value = 'Original Pressing';
            cost.value = '';
            catalog.value = '';
            addingVinyl.textContent = 'Add';
        } else if (e.target === editCancel) {
            showing.style.display = 'none';
            albumTitle.value = '';
            artistName.value = '';
            vinylColor.value = '';
            dateObtained.value = '';
            pressing.value = 'Original Pressing';
            cost.value = '';
            catalog.value = '';
            thisEvent = new Event('startDisplay');
            document.dispatchEvent(thisEvent);
        } else if (e.target === addingVinyl) {
            if (!editVinyl.dataset.id) {
                suspendInput = true;
                try {
                    const response = await fetch('/api/v1/vinyls', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            albumTitle: albumTitle.value,
                            artistName: artistName.value,
                            vinylColor: vinylColor.value,
                            dateObtained: dateObtained.value,
                            pressing: pressing.value,
                            cost: cost.value,
                            catalog: catalog.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 201) {
                        message.textContent = 'The vinyl has been saved.';
                        showing.style.display = 'none';
                        thisEvent = new Event('startDisplay');
                        document.dispatchEvent(thisEvent);
                        albumTitle.value = '';
                        artistName.value = '';
                        vinylColor.value = '';
                        dateObtained.value = '';
                        pressing.value = '';
                        cost.value = '';
                        catalog.value = '';
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (error) {
                    message.textContent = 'An error has occurred.';
                }
                suspendInput = false;
            } else {
                suspendInput = true;
                try {
                    const vinylID = editVinyl.dataset.id;
                    const response = await fetch(`/api/v1/vinyls/${vinylID}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            albumTitle: albumTitle.value,
                            artistName: artistName.value,
                            vinylColor: vinylColor.value,
                            dateObtained: dateObtained.value,
                            pressing: pressing.value,
                            cost: cost.value,
                            catalog: catalog.value,
                        }),
                    });
                    const data = await response.json();
                    if (response.status === 200) {
                        message.textContent = 'The vinyl has been updated.';
                        showing.style.display = 'none';
                        albumTitle.value = '';
                        artistName.value = '';
                        vinylColor.value = '';
                        dateObtained.value = '';
                        pressing.value = '';
                        cost.value = '';
                        catalog.value = '';
                        thisEvent = new Event('startDisplay');
                        document.dispatchEvent(thisEvent);
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (error) {
                    message.textContent = 'An error has occurred.';
                }
            } 
            suspendInput = false;
            
        } else if (e.target.classList.contains('editButton')) {
            editVinyl.dataset.id = e.target.dataset.id;
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/vinyls/${e.target.dataset.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });
                const data = await response.json();
                if (response.status === 200) {
                    albumTitle.value = data.vinyl.albumTitle;
                    artistName.value = data.vinyl.artistName;
                    vinylColor.value = data.vinyl.vinylColor;
                    dateObtained.value = data.vinyl.dateObtained;
                    pressing.value = data.vinyl.pressing;
                    cost.value = data.vinyl.cost;
                    catalog.value = data.vinyl.catalog;
                    showing.style.display = 'none';
                    showing = editVinyl;
                    showing.style.display = 'block';
                    addingVinyl.textContent = 'Update';
                    message.textContent = '';
                } else {
                    message.textContent = 'The vinyl was not found.';
                    thisEvent = new Event('startDisplay');
                    document.dispatchEvent(thisEvent);
                }
            } catch (error) {
                message.textContent = 'An error has occurred.';
            }
            suspendInput = false;

        } else if (e.target.classList.contains("deleteButton")) {
            suspendInput = true;
            try {
                const response = await fetch(`/api/v1/vinyls/${e.target.dataset.id}`, {
                    method:'DELETE', 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, 
                    },
                });
                if(response.status === 200) {
                    message.textContent = 'The vinyl has been deleted.';
                    thisEvent = new Event('startDisplay');
                    document.dispatchEvent(thisEvent);
                } else {
                    message.textContent = 'The vinyl was not found.';
                    thisEvent = new Event('startDisplay');
                    document.dispatchEvent(thisEvent);
                }
            } catch (err) {
                message.textContent = 'An error has occurred.';
            }
            suspendInput = false;
        }
    })
});  