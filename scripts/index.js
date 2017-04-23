$(document).ready(function () {
     getCategories($("#categories"));
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