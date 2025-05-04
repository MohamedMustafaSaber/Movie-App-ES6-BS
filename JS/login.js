let btnLogin=document.getElementById("login");
let formValidation=document.querySelector("form");
let email=document.getElementById("email");
let password=document.getElementById("password");
let invalidMsg=document.getElementById("invalid-inputs");

console.log(email)
console.log(password)

formValidation.addEventListener("submit",validation);

function validation(e)
{
    if (!formValidation.checkValidity()) 
    {
        e.preventDefault()
        e.stopPropagation()
    }
    else
    {
        e.preventDefault()
        UserAuthantication()
    }
    formValidation.classList.add("was-validated");

   

}

function UserAuthantication()
{

    let tempUsers=JSON.parse(localStorage.getItem("Users")||[]);
    let found=false;
   for(let user of  tempUsers)
    {
        if(user.Email==email.value && user.Password==password.value)
        {
            setcookies("Email",user.Email)
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