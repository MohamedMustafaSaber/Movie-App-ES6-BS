let fname=document.getElementById("fname");
let lname=document.getElementById("lname");
let age=document.getElementById("age");
let email=document.getElementById("email");
let password=document.getElementById("password");
let formValidation=document.querySelector("form");
let duplicateEmail=document.querySelector(".dup-email");
let signinBtn=document.getElementById("signin");
let users;


if(localStorage.Users!=null)
{
    users=JSON.parse(localStorage.Users);
}
else
{
     users=[];
}
signinBtn.addEventListener("click",()=>{
    window.location.href="login.html"
})
formValidation.addEventListener("submit",validation);
function validation(e)
{
    if (!formValidation.checkValidity()) 
    {
        e.preventDefault()
        e.stopPropagation()
        document.activeElement.blur();
    }
    else
    {
        e.preventDefault()
        signupData();
    }
    formValidation.classList.add("was-validated");

   
}

function signupData()
{
     if(checkDub_User())    
        createUser()
    else
        return;
  
    
}
function checkDub_User()
{
    if(users.some(user=>user.Email===email.value))
    {
        duplicateEmail.innerHTML="This email is already registered!";
        duplicateEmail.style.color="red"
        return false;

    }
    else
    {
        duplicateEmail.innerHTML="";
        return true;

    }
}
function createUser()
{
    let user={};
    user.Firstname=fname.value;
    user.Lastname=lname.value;
    user.Age=age.value;
    user.Email=email.value;
    user.Password=password.value;
    user.favorites={
        movie: [],
        tvShows: [],
        people: []};
    users.push(user);
    localStorage.setItem("Users",JSON.stringify(users));
    window.location.href = "login.html";


}







