
$(document).ready(function () {
    getCategories($("#categories"));
    $("#types").click(function () {
        var checkboxes = $(this).find("input :checked");
        console.log(checkboxes);
        if (checkboxes.length == 0) {
            
        }
    });
    $("#start").click(function () {
        $("#settings").fadeOut(0);
        $("#trivia").fadeIn(500);
        $("#time").animate({ width: '100%' }, 20000, "linear", function () {
            console.log("done");
        });
        
    });

});

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

//$("#q_category").text($(this).find(":selected").text());


