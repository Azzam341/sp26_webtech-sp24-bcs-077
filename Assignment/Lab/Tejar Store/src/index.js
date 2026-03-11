function toggleVisibility() {
    var x = document.getElementsByClassName("category-sidebar")[0]
    if (x.style.display ==="none")
    {
        x.style.display="block";
    }
    else
    {
        x.style.display="none";
    }
}

const toggleButton = document.getElementById("categories-button");
toggleButton.addEventListener('click', toggleVisibility)