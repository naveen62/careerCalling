var button = document.querySelector('#check')

var question1 = document.querySelectorAll('.Q1')
var question2 = document.querySelectorAll('.Q2')
var question3 = document.querySelectorAll('.Q3')
var question4 = document.querySelectorAll('.Q4')
var question5 = document.querySelectorAll('.Q5')
var form = document.querySelector('form')
var info = document.querySelector('#info')
var getvalue = document.querySelector('#getvalue');
var userid = getvalue.value;
var host = location.hostname
var total = 0

button.addEventListener('click', function() {
    for(var i=0; i<4; i++) {
        if(question1[i].checked && question1[i].value == 'a') {
            total = total + 20
        }
        if(question2[i].checked && question2[i].value == 'a') {
            total = total + 20;
        }
        if(question3[i].checked && question3[i].value == 'd') {
            total = total + 20;
        }
        if(question4[i].checked && question4[i].value == 'a') {
            total = total + 20;
        }
        if(question5[i].checked && question5[i].value == 'c') {
            total = total + 20;
        }
    }
    if(total >= 60) {
        send();
        button.textContent = 'You Passed! now go to jobs'
        button.style.backgroundColor = '#00C853'
        button.style.borderColor = '#00C853'
    } else {
        // $('form').submit(function(e) {
        //     return false
        // });
        info.textContent = 'Your total score is '+total
    }
})

function send() {
    fetch('/student/test', {
    method: 'post',
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify({total: total, userid: userid})
})
.then(function(res) {
    console.log(res)
})
.catch(function(err) {
    console.log(err)
})    
}

