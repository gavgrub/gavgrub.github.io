document.addEventListener("DOMContentLoaded", function () {
    const textarea = document.querySelector("textarea");

    console.log("Textarea:", textarea);

    function autoResize() {
        this.style.height = "0px";
        this.style.height = this.scrollHeight + "px";
    }

    textarea.addEventListener("input", autoResize);
    autoResize.call(textarea);
});