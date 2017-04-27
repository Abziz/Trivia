var urlHelper = [];
var q_helper = [];
var game_info;

$(document).ready(function () {
    getCategories($("#categories"));
    getToken();
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
    $("#time").stop();
    $("#time").css("width","0%")
    $("#time").animate({ width: '100%' }, 15000, "linear", function () {
        wrong();
    });
}

function getToken(){
    $.ajax({
        url:"https://opentdb.com/api_token.php?command=request",
        context: document.body
    }).done(function (data) {
        urlHelper.session =  "token="+data.token;
    });
}

function nextQuestion() {
    var url = 'https://opentdb.com/api.php?' + urlHelper.amount
            + '&' + urlHelper.category
            + '&' + urlHelper.difficulty
            + '&' + urlHelper.type
            + '&' + urlHelper.session;
    $.ajax({
        url: url,
        context: document.body
    }).done(function (data) {
        $("#q_text")[0].innerHTML = data.results[0].question;
        $("#q_category").text(data.results[0].category);
        q_helper.correct = data.results[0].correct_answer;
        var amount = data.results[0].type == "boolean" ? 2:4;
        var answers = data.results[0].incorrect_answers;
        answers.push(data.results[0].correct_answer);
        shuffle(answers);
        var htmlanswer = ""
        for (var i = 0 ; i < amount; i++) {
            htmlanswer += createAnswer(answers[i]);
        }
        $("#q_answers").empty().append(htmlanswer);
        startTimer();
    });
    game_info.questions++;
    $("#q_num").text("Question number " + game_info.questions);
    if (game_info.questions == 11) {
        game_info.level++;
        
        $("#level").text("MEDIUM");
        urlHelper.difficulty = "difficulty=medium";
    }else if (game_info.questions == 21) {
        game_info.level++;
        $("#level").text("HARD");
        urlHelper.difficulty = "difficulty=hard";
    }
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
    game_info = { score: 0, life: 5, questions: 0, level: 1 };
    urlHelper["amount"] = "amount=1";
    urlHelper["difficulty"] = "difficulty=easy";
    var cat = $("#categories").val();
    urlHelper["category"] = (cat == "any" )? "" : "category="+cat;
    var checked = $(".typecheck>input:checkbox:checked");
    if(checked.length == 1 ){
        urlHelper["type"] = "type=" + checked.val();
        if (urlHelper["type"] == "type=boolean") {
            $("#A4,#A3").toggle();
        }
    }else{
        urlHelper["type"] = "";
    }

    for (var i = 0; i < game_info.life; i++) {
        $("#life").append(createHeart());
    }
    $("#alertmsg").fadeTo(1, 0);
    callback();
}

function createHeart() {
    return ' <i class="fa fa-heart text-danger"></i>';
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
    return '<span class="q_btn btn btn-secondary" onclick="answer(this); return false">' + text + '</span>';
}

function answer(elem) {
    $("#time").stop();
    if ($(elem).text() == q_helper.correct) {
        correct();
    } else {
        wrong();
    }
}
function correct() {
    game_info.score += (game_info.level * 100);
    $("#score").text(game_info.score);
    var alertb = $("#alertmsg");
    alertb.removeClass('alert-danger').addClass('alert-success').text("Correct!");
    ShowAndHide(alertb);
    nextQuestion();
}
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
function wrong() {
    game_info.life--
    var hearts = $("#life i");
    if (hearts.length > 1 ){
    $(hearts[0]).addClass("animated hinge").one(animationEnd, function () { $(hearts[0]).remove();});
    } else {
        $(hearts[0]).remove();
    }
    var alertb = $("#alertmsg");
    alertb.removeClass('alert-success').addClass('alert-danger').text("Wrong!");
    ShowAndHide(alertb);
    if (game_info.life == 0) {
        gameOver();
        return;
    }
    nextQuestion();
}
function showMsg(msg) {
    console.log(msg);
}

function gameOver() {
    $("#trivia").toggle();
    $("#settings").toggle();
    $("#score").text("0");
    $("#level").text("EASY");
}
//$("#q_category").text($(this).find(":selected").text());

  
function ShowAndHide(jqelem) {
    console.log($(jqelem))
    jqelem.fadeTo(1000, 1, function () {
       $(this).fadeTo(1000, 0);
    });
}
