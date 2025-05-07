let btnLogin=document.getElementById("login");
let formValidation=document.querySelector("form");
let email=document.getElementById("email");
<<<<<<< HEAD
let passValid=document.getElementById("pass-invalid");
let emailValid=document.getElementById("email-invalid");
let password=document.getElementById("password");
let invalidMsg=document.getElementById("invalid-inputs");
let signupBtn=document.getElementById("signup");




signupBtn.addEventListener("click",()=>{
    window.location.href="registration.html"
})
=======
let password=document.getElementById("password");
let invalidMsg=document.getElementById("invalid-inputs");

console.log(email)
console.log(password)
>>>>>>> e5fdf8335bfa1bff6f4730d1c85b64f974a29a14

formValidation.addEventListener("submit",validation);

function validation(e)
{
<<<<<<< HEAD
    e.preventDefault()
    if (!formValidation.checkValidity()) 
    {
        if(!email.value)
        {
            console.log(email.value)
            emailValid.classList.remove("d-none");
        }
        else if(email.value)
            emailValid.classList.add("d-none");

        if(!password.value)
            passValid.classList.remove("d-none");
        else if(password.value)
            passValid.classList.add("d-none");

=======
    if (!formValidation.checkValidity()) 
    {
        e.preventDefault()
>>>>>>> e5fdf8335bfa1bff6f4730d1c85b64f974a29a14
        e.stopPropagation()
    }
    else
    {
<<<<<<< HEAD
        passValid.classList.add("d-none");
        emailValid.classList.add("d-none");
        UserAuthantication()
    }
    // formValidation.classList.add("was-validated");
=======
        e.preventDefault()
        UserAuthantication()
    }
    formValidation.classList.add("was-validated");
>>>>>>> e5fdf8335bfa1bff6f4730d1c85b64f974a29a14

   

}

function UserAuthantication()
{

<<<<<<< HEAD
    let tempUsers=JSON.parse(localStorage.getItem("Users")||"[]");
=======
    let tempUsers=JSON.parse(localStorage.getItem("Users")||[]);
>>>>>>> e5fdf8335bfa1bff6f4730d1c85b64f974a29a14
    let found=false;
   for(let user of  tempUsers)
    {
        if(user.Email==email.value && user.Password==password.value)
        {
<<<<<<< HEAD
            // setcookies("Email",user.Email)
            sessionStorage.setItem("CurrentUser",JSON.stringify(user))
=======
            setcookies("Email",user.Email)
>>>>>>> e5fdf8335bfa1bff6f4730d1c85b64f974a29a14
            found=true;
            window.location.href="Home.html";
        }

        
    }
    if(found==false)
    {

        invalidMsg.innerHTML="Incorrect Email or Password";
        invalidMsg.style.color="red";
    }


}

function setcookies(name,email,hours=3)
{
    let date = new Date();
    date.setTime(date.getTime() + (hours*60*60*1000));
    document.cookie=`${name}=${email}; expires=${date.toUTCString()}; path=/`;
}