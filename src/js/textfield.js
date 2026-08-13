function initTextfield() {
    const textarea = document.querySelector("textarea");
    if (!textarea) return; // this page has no textarea, nothing to do

    function autoResize() {
        this.style.height = "0px";
        this.style.height = this.scrollHeight + "px";
    }

    textarea.addEventListener("input", autoResize);
    autoResize.call(textarea);
}

document.addEventListener("DOMContentLoaded", initTextfield);
document.addEventListener("pageChanged", initTextfield);
