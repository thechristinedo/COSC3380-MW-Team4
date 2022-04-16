const tabLinks = document.querySelectorAll(".tabs a");
const tabPanels = document.querySelectorAll(".tabs-panel");

for (let el of tabLinks) {
  el.addEventListener("click", e => {
    e.preventDefault();

    document.querySelector(".tabs li.active").classList.remove("active");
    document.querySelector(".tabs-panel.active").classList.remove("active");

    const parentListItem = el.parentElement;
    parentListItem.classList.add("active");
    const index = [...parentListItem.parentElement.children].indexOf(parentListItem);

    const panel = [...tabPanels].filter(el => el.getAttribute("data-index") == index);
    panel[0].classList.add("active");
    });
  }

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

const handle_logout = (event) => {
    deleteCookie("UserID");
    window.location.href = "/";
}