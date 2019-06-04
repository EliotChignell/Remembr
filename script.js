let newBtn = document.querySelector("#newBtn"),
    loadInput = document.querySelector("#loadInput"),
    mainContainer = document.querySelector(".mainContainer");
  
let obj = {};
let arr = [];
let counter = 0;
const chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let value;
let correct = 0;
let wrong = 0;
// let ejson = {};

Array.prototype.shuffle = function(){
  for (var i = 0; i < this.length; i++){
    var a = this[i];
    var b = Math.floor(Math.random() * this.length);
    this[i] = this[b];
    this[b] = a;
  }
}

function shuffleProperties(ob) {
  let keys = Object.keys(ob);
  let newObj = {};
  keys.shuffle();
  for (var i=0;i<keys.length;i++) {
    newObj[keys[i]] = ob[keys[i]];
  }
  return newObj;
}

function newClick() {
  counter = 0;
  /*
  mainContainer.innerHTML = `<br><center><form action="javascript:addItem()"><input type="text" placeholder="Term:Description" id="termInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><p>Press enter to add item</p></form><br><button id="finishBtn" onclick="finish()">Finish</button><br><br><button id="newBtn" onclick="returnHome();">Return Home</button></center>`;
  */
  redisplay();
}

function loadClick() {
  value = document.querySelector('#loadInput').value;

  mainContainer.innerHTML = `<center><h1>Loading...</h1></center>`;

  $.get("https://api.myjson.com/bins/1cgedr" , function(data, textStatus, jqXHR) {
    if (data[value.toLowerCase()]) {
      counter = 0;
      arr = [];
      let list = shuffleProperties(data[value.toLowerCase()]);
      for (var k in list) {
        arr.push(`${k}:${list[k]}`);
      }
      loadMenu();
      // mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[0]}</h1><br><form action="javascript:check()"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
    } else {
      returnHome();
      alert("That password does not exist!");
    }
  });

}

function loadMenu() {
  mainContainer.innerHTML = `<center><br><button id="finishBtn">${value.toLowerCase()}</button><br><br><hr><br><br><button id="studyBtn" onclick="study()">Study</button><br><br><button id="testBtn" onclick="test()">Test</button><br><br><button id="newBtn" onclick="returnHome()">Return Home</button></center>`;
}

function addItem() {
  counter++;
  let key = document.querySelector("#termInput").value.split(':')[0];
  let val = document.querySelector("#termInput").value.split(':')[1];
  obj[key] = val;
  redisplay();
}

function redisplay() {
  mainContainer.innerHTML = `<br><center><form action="javascript:addItem()"><input type="text" placeholder="Term:Description" id="termInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><p>Press enter to add item</p></form><br></center>`;
  for (var i in obj) {
     mainContainer.innerHTML += `<br><center><p class="termP" id="item${counter}" onclick="removeItem(${counter})">${i}:${obj[i]}</p></center>`;
  }
  mainContainer.innerHTML += `<br><center><button id="finishBtn" onclick="finish()">Finish</button><br><br><button id="newBtn" onclick="returnHome();">Return Home</button></center>`;
  document.querySelector("#termInput").select();
}

function removeItem(n) {
  delete obj[document.querySelector(`#item${n}`).innerHTML.split(':')[0]];
  redisplay();
  console.log(`Removed item ${n} from obj\n${JSON.stringify(obj)}`);
}

function finish() {
  if (Object.keys(obj).length == 0) return alert("Please add some items to your list!"); 
  let a = confirm("Are you sure?");
  if (a) {
    mainContainer.innerHTML = `<center><h1>Loading...</h1></center>`;
    $.get("https://api.myjson.com/bins/1cgedr", function(data, textStatus, jqXHR) {
      let resp = data;
      let password = generatePassword(resp);
      console.log("password" + password);
      resp[password] = obj;
      console.log(resp);
      $.ajax({
        url:"https://api.myjson.com/bins/1cgedr",
        type:"PUT",
        data: JSON.stringify(resp),
        contentType:"application/json; charset=utf-8",
        dataType:"json",
        success: function(data, textStatus, jqXHR){
          console.log('yes');
          mainContainer.innerHTML = `<center><h1>Your password is:<br><p id="finishBtn">${password}</p></h1><p>You should probably write it down.</p><button id="newBtn" onclick="returnHome();">Return Home</button></center>`;
        }
      }); 
    });
  }
}

function generatePassword(resp) {
  let str = "";
  for (var i=0;i<6;i++) {
    str += chars[Math.floor((Math.random() * 25) + 0)];
  }
  if (resp[str]) {
    generatePassword();
  } else {
    return str;
  }
}

function check(a) {
  if (a == 'a:b') {
    if (document.querySelector("#answerInput").value.toLowerCase() == arr[counter].split(':')[1].toLowerCase()) { // Correct
      correct++;
      mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[0]}</h1><p class="c">Correct :)</p><br><form action="javascript:check('a:b')"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
    } else { // Wrong
      wrong++;
      mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[0]}</h1><p class="w">Wrong :(</p><br><form action="javascript:check('a:b')"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
    }
  } else if (a == 'b:a') {
    if (document.querySelector("#answerInput").value.toLowerCase() == arr[counter].split(':')[0].toLowerCase()) { // Correct
      correct++;
      mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[1]}</h1><p class="c">Correct :)</p><br><form action="javascript:check('b:a')"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
    } else { // Wrong
      wrong++;
      mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[1]}</h1><p class="w">Wrong :(</p><br><form action="javascript:check('b:a')"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
    }
  }

  setTimeout(() => {
    counter++;
    if (counter == arr.length) summary();
    if (a == 'a:b') {
      mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[0]}</h1><br><form action="javascript:check('a:b')"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
    } else if (a == 'b:a') {
      mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[1]}</h1><br><form action="javascript:check('b:a')"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
    }
    document.querySelector("#answerInput").select();
  }, 1000);
  
}

function transitionToLoad() {
  mainContainer.innerHTML = `<center><h1>Remembr</h1></center><hr><br><br><center><form action="javascript:loadClick()"><input type="text" placeholder="Your Password" id="loadInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form><br><button id="newBtn" onclick="returnHome();">Go Back</button></center>`;
}

function returnHome() {
  mainContainer.innerHTML = `<center><h1>Remembr</h1></center><hr><br><br><center><button id="newBtn" onclick="newClick()">New</button><br><br><button id="loadBtn" onclick="transitionToLoad()">Load</button><br><br><button id="quitBtn" onclick="window.close();">Quit</button></center>`;
}

function study() {
  mainContainer.innerHTML = `<center><h1>Study</h1><hr><br><br></center>`;
  for (var i=0;i<arr.length;i++) {
    mainContainer.innerHTML += `<center><p class="termP">${arr[i]}</p></center>`;
  }
  mainContainer.innerHTML += `<center><br><br><button id="newBtn" onclick="loadMenu()">Go Back</button></center>`;
}

function test() {
  counter = 0;
  correct = 0;
  wrong = 0;
  mainContainer.innerHTML = `<center><h1>How do you want to be tested?</h1><br><br><button id="newBtn" onclick="ab('a:b')">A:B</button><br><br><button id="newBtn" onclick="ab('b:a')">B:A</button></center>`;
  /*
  mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[0]}</h1><br><form action="javascript:check()"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
  */
}

function ab(a) {
  if (a == 'a:b') {
    mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[0]}</h1><br><form action="javascript:check('a:b')"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
  } else if (a == 'b:a') {
    mainContainer.innerHTML = `<center><h1>${arr[counter].split(':')[1]}</h1><br><form action="javascript:check('b:a')"><input type="text" id="answerInput" placeholder="Answer" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></form></center>`;
  }
}

function summary() {
  mainContainer.innerHTML = `<center><h1>Summary</h1><br><h1>Grade: ${Math.floor((correct/(correct+wrong)*100))}% (${correct}/${correct+wrong})</h1><br><br><button id="newBtn" onclick="loadMenu()
  ">Go Back</button></center>`;
}