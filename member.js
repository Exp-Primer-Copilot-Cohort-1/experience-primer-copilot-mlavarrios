function skillsMember() {
    var skills = document.getElementsByClassName("skills");
    var i;
    for (i = 0; i < skills.length; i++) {
        skills[i].style.display = "block";
    }
    document.getElementById("skillsBtn").className += " active";
}