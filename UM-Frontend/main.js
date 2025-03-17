// setup table data
const setTable = (users) =>{

    document.getElementById('tbody').innerHTML = "";


    users.forEach((user, index)=>{
        let trEle = document.createElement('tr');
    
        let srTD = document.createElement('td');
        srTD.append(index + 1);
        trEle.appendChild(srTD)

        let nameTD = document.createElement("td");
        nameTD.append(user.name)
        trEle.appendChild(nameTD)

        let ageTD = document.createElement("td");
        ageTD.append(user.age)
        trEle.appendChild(ageTD)

        let cityTD = document.createElement("td");
        cityTD.append(user.city)
        trEle.appendChild(cityTD)

        let actionTD = document.createElement("td");
        let updateI = document.createElement("i");
        updateI.setAttribute("class", "fa-solid fa-pen-to-square")
        updateI.onclick = ()=>{
            openCloseModal('updatemodal');
            setUpdateUser(user)
        }
        actionTD.appendChild(updateI)

        let deleteI = document.createElement("i");
        deleteI.setAttribute("class", "fa-solid fa-trash")
        deleteI.onclick = () =>{
            deleteUser(user.id)
        }
        actionTD.appendChild(deleteI)
        trEle.appendChild(actionTD)

        document.getElementById('tbody').appendChild(trEle)
    })



}





// for open and close modal
let modalStatus = false;

const openCloseModal = (eleID)=>{
    if(modalStatus === false){
        document.getElementById(eleID).style.display = 'flex';
        modalStatus = true;
    }else{
        document.getElementById(eleID).style.display = 'none';
        modalStatus = false;
    }
}   



// http://localhost:8000/addnewuser


async function addNewUser(){

    let name = document.getElementById('name').value;
    let age = Number(document.getElementById('age').value);
    let city = document.getElementById('city').value;

    let userObj = {
        name: name,
        age: age,
        city: city
    }

    if(!name || !age || !city){
        alert("All fields are requied!")
        return
    }

    let res = await fetch("http://localhost:8000/addnewuser", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(userObj)
    })

    let response = await res.json();

    console.log(response)

    if(response.success === true){
        openCloseModal('addmodal');
        getAllUsers()
    }

}



/// to get all users 

const getAllUsers = async() =>{

    let res = await fetch("http://localhost:8000/getusers");
    let response = await res.json();
    console.log(response)

    if(response.success === true){
        setTable(response.result)
    }

}

getAllUsers()





// to delete user 

const deleteUser = async(userID) =>{
    // http://localhost:8000/deleteuser?id=userID

    let isTrue = confirm("Are you sure?");

    if(isTrue === true){
        let res = await fetch(`http://localhost:8000/deleteuser?id=${userID}`, {
            method: "DELETE"
        })

        let response = await res.json();

        if(response.success === true){
            getAllUsers()
        }
    }
}




/// update user

const setUpdateUser = (user) =>{

    document.getElementById('updateId').value = user.id;
    document.getElementById('updateName').value = user.name;
    document.getElementById('updateAge').value = user.age;
    document.getElementById('updateCity').value = user.city;

    
}


const updateUser = async() =>{
    let id = Number(document.getElementById("updateId").value);
    let name = document.getElementById('updateName').value;
    let age = Number(document.getElementById('updateAge').value);
    let city = document.getElementById('updateCity').value;

    let userObj = {
        id: id,
        name: name,
        age: age,
        city: city
    }

    if(!userObj.name || !userObj.age || !userObj.city){
        alert("All fields are required!");
        return
    }

    let res = await fetch(`http://localhost:8000/updateuser?id=${userObj.id}`,{
        method:"PUT",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(userObj)
    })


    let response = await res.json();

    if(response.success === true){
        getAllUsers();
        openCloseModal('updatemodal')
    }
}