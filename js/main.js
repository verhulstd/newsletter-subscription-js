/* IMPORTS */
import tippy from "tippy.js";
import firebase from "firebase";

/* SETTINGS */
let existingSubscribers = [];
const form = document.querySelector("form");
const input = document.querySelector("input");
let typeCheck = false;
let subscribed = false;
const errors = {
  empty: "The value appears to be empty.",
  invalid: "The given value is not a valid e-mail address.",
  exists: "This e-mailaddress allready subscribed"
};

/* FIREBASE SYNC */
var config = {
  apiKey: "AIzaSyBie2pZub90OBsTNpRJaCeo-mcawkvxLkU",
  authDomain: "crud-6bb2c.firebaseapp.com",
  databaseURL: "https://crud-6bb2c.firebaseio.com",
  projectId: "crud-6bb2c",
  storageBucket: "crud-6bb2c.appspot.com",
  messagingSenderId: "54516471283"
};
firebase.initializeApp(config);
firebase
  .database()
  .ref("/subscriptions")
  .on("value", syncArray);

function syncArray(snapshot) {
  existingSubscribers = [];
  let object = snapshot.val();
  for (const prop in object) {
    existingSubscribers.push(object[prop]);
  }
}

/* ON KEYPRESS¨*/
input.addEventListener("keyup", e => {
  if (typeCheck) {
    if (validate()) {
      clearError();
    }
  }
});

/* ON SUBMIT */
form.addEventListener("submit", e => {
  e.preventDefault();
  if (validate()) {
    clearError();
    //submit to firebase
    firebase
      .database()
      .ref("/subscriptions")
      .push(input.value);
    form.classList.remove("fadeInDown");
    const classList = ["animated", "fadeOut"];
    form.querySelector("div").classList.add(...classList);
    form.querySelector("button").classList.add(...classList);
  }
});

var animationEnd = (function(el) {
  var animations = {
    animation: "animationend",
    OAnimation: "oAnimationEnd",
    MozAnimation: "mozAnimationEnd",
    WebkitAnimation: "webkitAnimationEnd"
  };

  for (var t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
})(document.createElement("div"));

form.querySelector("button").addEventListener(animationEnd, function() {
  if (!subscribed) {
    form.querySelector("button").style.display = "none";
    form.querySelector("div").style.display = "none";
    form.querySelector("section").classList.add(...["animated", "fadeIn"]);
    form.querySelector("section").style.display = "block";
    startCounter();
    subscribed = true;
  }
});

function startCounter() {
  let count = 5;
  let timer = setInterval(function() {
    count--;
    form.querySelector("span").innerHTML = count;
    if (count == 0) {
      clearInterval(timer);
      resetSubscription();
    }
  }, 1000);
}

function resetSubscription() {
  subscribed = false;
  form.querySelector("button").style.display = "block";
  form.querySelector("div").style.display = "block";
  form.querySelector("section").classList.remove(...["animated", "fadeIn"]);
  form.querySelector("button").classList.remove(...["animated", "fadeOut"]);
  form.querySelector("div").classList.remove(...["animated", "fadeOut"]);
  form.querySelector("section").style.display = "none";
  input.value = "";
  input.focus();
  form.querySelector("span").innerHTML = 5;
  clearError();
}

/* VALIDATION FUNCTIONS */
function validate() {
  if (input.value == "") {
    showError(errors.empty);
    return false;
  }
  if (existingSubscribers.includes(input.value)) {
    showError(errors.exists);
    return false;
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.value)) {
    showError(errors.invalid);
    return false;
  }
  return true;
}

/* ERROR HANDLING */
function showError(message) {
  typeCheck = true;
  form.classList.add("error");
  input.setAttribute("title", message);
  if (!input._tippy) {
    tippy(".tippy", {
      arrow: true,
      arrowType: "round",
      size: "large",
      offset: "0,4",
      trigger: "manual", // 'click', 'manual'
      dynamicTitle: true
    });
  }
  input._tippy.show();
  input._tippy.disable();
  input.focus();
}

/* RESET FORMSTATE */
function clearError() {
  typeCheck = false;
  form.classList.remove("error");
  if (input._tippy) {
    input._tippy.enable();
    input._tippy.hide();
  }
  input.removeAttribute("title");
}
