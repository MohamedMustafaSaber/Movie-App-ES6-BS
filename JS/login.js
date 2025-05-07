let btnLogin=document.getElementById("login");
let formValidation=document.querySelector("form");
let email=document.getElementById("email");
let passValid=document.getElementById("pass-invalid");
let emailValid=document.getElementById("email-invalid");
let password=document.getElementById("password");
let invalidMsg=document.getElementById("invalid-inputs");
let signupBtn=document.getElementById("signup");




signupBtn.addEventListener("click",()=>{
    window.location.href="registration.html"
})

formValidation.addEventListener("submit",validation);

function validation(e)
{
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

        e.stopPropagation()
    }
    else
    {
        passValid.classList.add("d-none");
        emailValid.classList.add("d-none");
        UserAuthantication()
    }
    // formValidation.classList.add("was-validated");

   

}

function UserAuthantication()
{

    let tempUsers=JSON.parse(localStorage.getItem("Users")||"[]");
    let found=false;
   for(let user of  tempUsers)
    {
        if(user.Email==email.value && user.Password==password.value)
        {
            // setcookies("Email",user.Email)
            sessionStorage.setItem("CurrentUser",JSON.stringify(user))
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