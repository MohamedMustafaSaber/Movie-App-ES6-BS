let fname=document.getElementById("fname");
let lname=document.getElementById("lname");
let age=document.getElementById("age");
let email=document.getElementById("email");
let password=document.getElementById("password");
let formValidation=document.querySelector("form");
let duplicateEmail=document.querySelector(".dup-email");
let users;


if(localStorage.Users!=null)
{
    users=JSON.parse(localStorage.Users);
}
else
{
     users=[];
}

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
        // console.log(user.Email)
        // duplicateEmail.innerHTML="";
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
    users.push(user);
    localStorage.setItem("Users",JSON.stringify(users));
    setcookies("Email",user.Email)
    window.location.href = "Home.html";
    // window.location.href="Home.html"


}

function setcookies(name,email,hours=3)
{
    let date = new Date();
    date.setTime(date.getTime() + (hours*60*60*1000));
    document.cookie=`${name}=${email}; expires=${date.toUTCString()}; path=/`;
}







