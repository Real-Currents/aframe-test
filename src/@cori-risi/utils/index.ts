
export function autoSignIn () {

    setTimeout(() => {
        console.log("Set credentials for auto sign in");

        const signInButton: HTMLButtonElement | null = document.querySelector('.amplify-button[type="submit"]');
        if (signInButton !== null && signInButton.innerHTML === "Sign in") {
            signInButton.innerHTML = "Continue";
            signInButton.style.display = "flex";

            const usernameInput: HTMLInputElement | null = document.querySelector('.amplify-textfield .amplify-field-group div .amplify-input[name="username"]');
            if (usernameInput !== null) {
                usernameInput.value = "cori-risi-public";
            }
            const passwordInput: HTMLInputElement | null = document.querySelector('.amplify-textfield .amplify-field-group div .amplify-input[name="password"]');
            if (passwordInput !== null) {
                passwordInput.value = "cori-risi-public";
            }

        }
    }, 533);
}
