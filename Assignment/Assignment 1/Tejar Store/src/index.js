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
const x = document.getElementsByClassName("category-sidebar")[0]
x.style.display = "none";
toggleButton.addEventListener('click', toggleVisibility)