var urlHelper = [];
var q_helper = [];
var q_count = 0;
$(document).ready(function () {
    getCategories($("#categories"));

    $(".typecheck").click(function (e) {
        var checkbox = $(this).find("input");
        if (checkbox.is(":checked")) {
            var count = $(".typecheck>input:checkbox:checked").length;
            if (count == 1) {
                e.preventDefault();
                return false;
            }
        }
    });

    $("#start").click(function () {
        $("#settings").fadeOut(0);
        $("#trivia").fadeIn(500);
        play();
        
    });

});

function play() {
    if (urlHelper.length < 2) {
        setupOptions(nextQuestion);
    }
    else {
        nextQuestion();
    }
}
function startTimer() {
    $("#time").animate({ width: '100%' }, 5000, "linear", function () {
        $("#time").css("width", "0%");
        nextQuestion();
    });
}

function getToken(){
    $.ajax({
        url:"https://opentdb.com/api_token.php?command=request",
        context: document.body
    }).done(function (data) {
        urlHelper["session"] =  "token="+data["token"];
    });
}

function nextQuestion() {
    $("#q_answers").empty();
    var url = 'https://opentdb.com/api.php?' + urlHelper["amount"]
            + '&' + urlHelper["category"]
            + '&' + urlHelper["difficulty"]
            + '&' + urlHelper["type"]
            + '&' + urlHelper["token"];
    $.ajax({
        url: url,
        context: document.body
    }).done(function (data) {
        $("#q_text")[0].innerHTML = data.results[0].question;
        q_helper["correct"] = data.results[0].correct_answer;
        var amount = data.results[0].type == "boolean" ? 2:4;
        var answers = data.results[0].incorrect_answers;
        console.log(answers);
        answers.push(data.results[0].correct_answer);
        shuffle(answers);
        for (var i = 0 ; i < amount; i++) {
            htmlanswer = createAnswer(answers[i]);
            $("#q_answers").append(htmlanswer);
            startTimer();
        }
    });
    q_count++;
    $("#q_num").text("Question number " + q_count);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//https://opentdb.com/api.php?amount=11&category=12&difficulty=hard&type=multiple

function setupOptions( callback ){ 
    urlHelper["amount"] = "amount=1";
    urlHelper["difficulty"] = "difficulty=easy";
    var cat = $("#categories").val();
    urlHelper["cat"] = (cat == "any" )? "" : "category="+cat;
    var checked = $(".typecheck>input:checkbox:checked");
    if(checked.length == 1 ){
        urlHelper["type"] = "type=" + checked.val();
        if (urlHelper["type"] == "type=boolean") {
            $("#A4,#A3").toggle();
        }
    }else{
        urlHelper["type"] = "";
    }
    $("#q_category").text($("#categories :selected").text());
    callback();
}

function getCategories(select) {
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        context: document.body
    }).done(function (data) {
        categories = data.trivia_categories;
        for (i in categories) {
            var cat = categories[i];
            var option = "<option value=" + cat.id + ">" + cat.name + "</option>"
            select.append(option);
        }
    });
}

function createAnswer(text){
    return '<span class="q_btn btn btn-secondary">' + text + '</span>';
}

//$("#q_category").text($(this).find(":selected").text());


