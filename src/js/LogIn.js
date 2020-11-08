"use strict";
export default class LogIn {

    constructor(app) {

        this.stage = app.stage;
        this.stage.alpha = 0;
        this.app = app;
        this.config = this.app.config;

        //apply inputs style
        this.wrapper = document.querySelector("#wrapper");
        this.wrapper.style.width = this.app.width * 0.8 + "px";
        this.wrapper.style.height = this.app.height / 5 + "px";
        this.wrapper.style.opacity = 0;
        this.wrapper.style.pointerEvents = "none";

        this.username = document.querySelector("#username");
        this.username.style.marginBottom = app.height * 0.05 + "px";
        this.username.oninput = this.inputLength;
        this.username.style.opacity = 0.6;
        this.username.style.pointerEvents = "none";

        this.password = document.querySelector("#password");
        this.password.oninput = this.inputLength;
        this.password.style.opacity = 0.6;
        this.password.style.pointerEvents = "none";

        this.go = document.querySelector("#go");
        this.go.style.opacity = 0.6;
        this.go.style.pointerEvents = "none";
        this.go.addEventListener("click", this.goPressed);

        document.querySelector("#wrapper").addEventListener("submit", (() => {
            this.goPressed();
        }));

        this.login = document.querySelector("#login");
        this.login.addEventListener("click", this.loginPressed);

        this.register = document.querySelector("#register");
        this.register.addEventListener("click", this.registerPressed);

        this.go.style.display = "block";
        this.login.style.display = "block";
        this.register.style.display = "block";
        this.username.style.display = "block";
        this.password.style.display = "block";

        TweenMax.delayedCall(1.2, () => {
            TweenMax.to(this.wrapper, 0.5, { opacity: 1 });
            TweenMax.to(this.stage, 0.5, { alpha: 1 });
        })

    }

    loginPressed() {
        this.action = "login";
        this.enableInputs();
        TweenMax.to(this.register, 0.5, { opacity: 0.5 });
        TweenMax.to(this.login, 0.5, { opacity: 1 });
        TweenMax.to(this.username, 0.5, { opacity: 1 });
        TweenMax.to(this.password, 0.5, { opacity: 1 });
        this.username.style.pointerEvents = "auto";
        this.password.style.pointerEvents = "auto";
    };

    goPressed() {
        this.validate();
    };

    registerPressed() {
        this.action = "register";
        this.enableInputs();
        TweenMax.to(this.register, 0.5, { opacity: 1 });
        TweenMax.to(this.login, 0.5, { opacity: 0.5 });
        TweenMax.to(this.username, 0.5, { opacity: 1 });
        TweenMax.to(this.password, 0.5, { opacity: 1 });
        this.username.style.pointerEvents = "auto";
        this.password.style.pointerEvents = "auto";
    };

    enableInputs() {
        TweenMax.to(this.wrapper, 0.5, { opacity: 1 });
        if (!this.picked) {
            TweenMax.to(this.go, 1, { alpha: 0.6 });
        }
        this.picked = true;
    }

    validate() {
        $.ajax({
            url: this.action, //login or register
            type: 'POST',
            //            mode: 'cors',
            contentType: 'application/json',
            //            Accept: 'application/json',
            //            Origin: "http://localhost:3000",
            //            "Access-Control-Allow-Origin": "*",
            data: JSON.stringify({ user: this.username.value, pass: this.password.value }),
            success: (res) => {
                if (res.nameInUse) {
                    this.clearUserInput();
                    window.alert("name in use!"); //TODO... 
                    return;
                }
                if (res.authorized) {
                    localStorage.setItem("match3football", res.storageItem);
                    TweenMax.to(this.wrapper, this.config.fadeTimeBetweenPhases, { opacity: 0 });
                    TweenMax.to(this.stage, this.config.fadeTimeBetweenPhases, {
                        alpha: 0, onComplete: () => {
                            this.stage.removeChildren();
                            this.app.startLevel();
                            TweenMax.killAll();
                            this.wrapper.remove();
                            this.wrapper.style.display = "none"
                        }
                    });
                } else if (!res.authorized) {
                    this.clearUserInput();
                    window.alert("invalid username or password!"); //TODO...
                }
            }
        });
    }

    clearUserInput() {
        this.username.value = "";
        this.password.value = "";
        this.inputLength();
    }

    //on input change. if any is empty, disable GO btn
    inputLength() {
        if (this.username.value === "" || this.password.value === "") {
            this.go.style.pointerEvents = "auto"
            TweenMax.to(this.go, 0.15, { alpha: 0.6, interactive: false });
            return;
        }
        TweenMax.to(this.go, 0.3, { alpha: 1, interactive: true });
        this.go.style.pointerEvents = "auto"
    }
}