const formulario = document.querySelector("form")

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {};

  for (let el of formulario.elements) {
    if (el.name.length > 0) {
      formData[el.name] = el.value;
    }
  }

  const URL_GET = "http://localhost:8080/api/auth/login"

  fetch(URL_GET, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
        "Content-Type": "application/json"
    }
  })
    .then((res) => res.json())
    .then(({token}) => {
        localStorage.setItem("token", token)
        // window.location = "chat.html"
    
    })
    .catch((err) => {
      console.log(err);
    });
});


function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch(url + "google", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(({token})=>{
            localStorage.setItem("token", token)
            // window.location = "chat.html"
        })
        .catch(console.log);

}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}